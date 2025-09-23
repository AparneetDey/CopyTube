import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { deleteFromCloudinary, deleteVideoFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";



const publishAVideo = asyncHandler( async (req, res) => {
    // Get title and description from req.body
    // Validate title
    // Get video and thumbnail from req.files
    // Validate video and thumbnail file
    // Upload video and thumbnail into cloudinary
    // Check if files are uploaded properly in cloudinary
    // Create a video document in DB
    // Check if video is stored or not
    // return res
    
    const {title, description} = req.body;

    if(!title?.trim()) throw new ApiError(400, "Title is Required");

    let videoLocalPath;
    let thumbnailLocalPath;
    
    if(req.files && Array.isArray(req.files.videoFile) && Array.isArray(req.files.thumbnail) && req.files.videoFile.length > 0 && req.files.thumbnail.length > 0){
        videoLocalPath = req.files.videoFile[0].path;
        thumbnailLocalPath = req.files.thumbnail[0].path;
    }

    if(!videoLocalPath || !thumbnailLocalPath) throw new ApiError(400, "Video and thumbnail is Required");

    const video = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if(!video || !thumbnail) {
        if(thumbnail) deleteFromCloudinary(thumbnail?.url);
        if(video) deleteFromCloudinary(video?.url);

        throw new ApiError(500, "Something went wrong while uploading files on cloudinary");
    }

    const uploadedVideo = await Video.create({
        videoFile: video?.url,
        thumbnail: thumbnail?.url,
        title,
        description,
        owner: req.user?._id,
        duration: video?.duration.toFixed(2)
    });

    if(!uploadedVideo){
        deleteFromCloudinary(video?.url);
        deleteFromCloudinary(thumbnail?.url);
        throw new ApiError(500, "Something went wrong while uploading data on Database");
    }

    res
    .status(201)
    .json(
        new ApiResponse(
            200,
            uploadedVideo,
            "Video Uploaded Successfully"
        )
    )
})

const deleteAVideo = asyncHandler( async (req, res) => {
    // Get video id from req.params
    // Validate id
    // Check if the video exists
    // Check ownership
    // Take the url of thumbnail and videoFile
    // Delete the video document
    // Check if the video doc is deleted
    // Remove files from cloudinary
    // Validate remove
    // Return res

    const { videoId } = req.params;

    if(!videoId) throw new ApiError(400, "Video Id is Required");

    const storedVideo =  await Video.findById(videoId);

    if(!storedVideo) throw new ApiError(400, "Video Does Not Exist");

    if(!storedVideo.owner.equals(req.user?._id)) throw new ApiError(401, "User is not the Owner of the video");

    const videoUrl = storedVideo.videoFile;
    const thumbnailUrl = storedVideo.thumbnail;

    const deletedVideoResponse = await Video.deleteOne( { _id: storedVideo._id } );

    if(!deletedVideoResponse.acknowledged) throw new ApiError(500, "Something went wrong while deleting the video");

    const deletedVideoResponseCloudinary = await deleteVideoFromCloudinary(videoUrl);
    const deletedThumbnailResponseCloudinary = await deleteFromCloudinary(thumbnailUrl);

    if(!deletedVideoResponseCloudinary || !deletedThumbnailResponseCloudinary) {
        console.log("Something went wrong while deleting files from cloudinary");
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Video Deleted Successfully"
        )
    )
})

const getAVideo = asyncHandler( async (req, res) => {
    const { videoId } = req.params;

    if(!videoId) throw new ApiError(400, "Video Id is Required");

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribers"
                        }
                    },
                    {
                        $addFields: {
                            subscribersCount: {
                                $size: "$subscribers"
                            },
                            isSubscribed: {
                                $cond: {
                                    if: {$in: [req.user._id, "$subscribers.subscriber"]},
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            fullName: 1,
                            avatar: 1,
                            subscribersCount: 1,
                            isSubscribed: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        }
    ]);


    if(!video.length>0 || !video) throw new ApiError(400, "Video not Found");

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            video,
            "Video Fetched Successfully"
        )
    )
})


export {
    publishAVideo,
    deleteAVideo,
    getAVideo
}
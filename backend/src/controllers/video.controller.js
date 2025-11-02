import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteFromCloudinary, deleteVideoFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search_query, sortBy, sortType, userId } = req.query;

    let pipeline = [
        {
            $match: {
                isPublished: true
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
                        $project: {
                            fullName: 1,
                            avatar: 1
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
        },
    ];

    if (search_query) {
        pipeline.push(
            {
                $match: {
                    title:{
                        $regex: search_query,
                        $options: "i"
                    }
                }
            }
        )
    }

    if (userId) {
        pipeline.push(
            {
                $match: {
                    "owner._id": new mongoose.Types.ObjectId(userId)
                }
            }
        )
    }

    if (sortBy) {
        let sort = {};
        sort[sortBy] = sortType === "asc" ? 1 : -1;
        pipeline.push({ $sort: sort });
    }

    const paginateOptions = {
        page,
        limit,
        customLabels: {
            docs: "videos"
        }
    }

    const videos = await Video.aggregatePaginate(Video.aggregate(pipeline), paginateOptions);

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videos,
                "All Videos Fetched Succesfully"
            )
        )
})

const publishAVideo = asyncHandler(async (req, res) => {
    // Get title and description from req.body
    // Validate title
    // Get video and thumbnail from req.files
    // Validate video and thumbnail file
    // Upload video and thumbnail into cloudinary
    // Check if files are uploaded properly in cloudinary
    // Create a video document in DB
    // Check if video is stored or not
    // return res

    const { title, description, isPublished=true } = req.body;

    if (!title?.trim()) throw new ApiError(400, "Title is Required");

    let videoLocalPath;
    let thumbnailLocalPath;

    if (req.files && Array.isArray(req.files.videoFile) && Array.isArray(req.files.thumbnail) && req.files.videoFile.length > 0 && req.files.thumbnail.length > 0) {
        videoLocalPath = req.files.videoFile[0].path;
        thumbnailLocalPath = req.files.thumbnail[0].path;
    }

    if (!videoLocalPath || !thumbnailLocalPath) throw new ApiError(400, "Video and thumbnail is Required");

    const video = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!video || !thumbnail) {
        if (thumbnail) deleteFromCloudinary(thumbnail?.url);
        if (video) deleteFromCloudinary(video?.url);

        throw new ApiError(500, "Something went wrong while uploading files on cloudinary");
    }

    const uploadedVideo = await Video.create({
        videoFile: video?.secure_url,
        thumbnail: thumbnail?.secure_url,
        title,
        description,
        owner: req.user?._id,
        duration: video?.duration.toFixed(2),
        isPublished
    });

    if (!uploadedVideo) {
        deleteFromCloudinary(video?.url);
        deleteFromCloudinary(thumbnail?.url);
        throw new ApiError(500, "Something went wrong while uploading data on Database");
    }

    res
        .status(201)
        .json(
            new ApiResponse(
                200,
                {
                    video: uploadedVideo
                },
                "Video Uploaded Successfully"
            )
        )
})

const deleteAVideo = asyncHandler(async (req, res) => {
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

    if (!videoId) throw new ApiError(400, "Video Id is Required");

    const storedVideo = await Video.findById(videoId);

    if (!storedVideo) throw new ApiError(400, "Video Does Not Exist");

    if (!storedVideo.owner.equals(req.user?._id)) throw new ApiError(401, "User is not the Owner of the video");

    const videoUrl = storedVideo.videoFile;
    const thumbnailUrl = storedVideo.thumbnail;

    const deletedVideoResponse = await Video.deleteOne({ _id: storedVideo._id });

    if (!deletedVideoResponse.acknowledged) throw new ApiError(500, "Something went wrong while deleting the video");

    const deletedVideoResponseCloudinary = await deleteVideoFromCloudinary(videoUrl);
    const deletedThumbnailResponseCloudinary = await deleteFromCloudinary(thumbnailUrl);

    if (!deletedVideoResponseCloudinary || !deletedThumbnailResponseCloudinary) {
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

const getAVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) throw new ApiError(400, "Video Id is Required");

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
                                    if: { $in: [req.user._id, "$subscribers.subscriber"] },
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
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "videoLikes",
                pipeline: [
                    {
                        $project: {
                            likedBy: 1,
                            _id: 0
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                },
                totalLikes: {
                    $size: "$videoLikes"
                },
                likedBy: {
                    $map: {
                        input: "$videoLikes",
                        as: "like",
                        in: "$$like.likedBy"
                    }
                }
            }
        },
        {
            $project: {
                videoLikes: 0
            }
        }
    ]);


    if (!video.length > 0 || !video) throw new ApiError(400, "Video not Found");

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                video[0],
                "Video Fetched Successfully"
            )
        )
})

const updateVideoDetail = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) throw new ApiError(400, "Viode Id is Required");

    const { title, description } = req.body || "";
    const thumbnailLocalPath = req.file?.path;

    if (!title && !description && !thumbnailLocalPath) throw new ApiError(400, "Atleast one field is Required");

    const video = await Video.findById(videoId);

    if (!video) throw new ApiError(400, "Video not Found");

    if (!video.owner.equals(req.user?._id)) throw new ApiError(401, "User is not the Owner of the video");

    if (title) {
        video.title = title;
    }
    if (description) {
        video.description = description;
    }
    if (thumbnailLocalPath) {
        const uploadedThumb = await uploadOnCloudinary(thumbnailLocalPath);
        if (!uploadedThumb) throw new ApiError(500, "Thumbnail upload failed");

        const prevThumbnailUrl = video.thumbnail;
        video.thumbnail = uploadedThumb.url;

        const deletedThumbnailResponseCloudinary = await deleteFromCloudinary(prevThumbnailUrl);

        if (!deletedThumbnailResponseCloudinary) {
            console.log("Something went wrong while deleting file from cloudinary");
        }
    }

    await video.save({ validateBeforeSave: false });

    res
        .status(201)
        .json(
            new ApiResponse(
                200,
                {
                    video
                },
                "Video Details Updated Successfully"
            )
        )

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) throw new ApiError(400, "Video Id is Required");

    const video = await Video.findById(videoId);

    if (!video) throw new ApiError(400, "Video Not Found");


    if (!video.owner.equals(req.user?._id)) throw new ApiError(401, "User is not the owner of this video");

    video.isPublished = !video.isPublished;
    await video.save({ validateBeforeSave: false });

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    video
                },
                "Video Publish Status Updated"
            )
        )
})

const addVideoToWatchHistory = asyncHandler( async (req, res) => {
    const { videoId } = req.params;
    
    if(!videoId) throw new ApiError(400, "Video Id is Required");

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $push: {
                watchHistory: videoId
            }
        },
        {
            new: true
        }
    )

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                watchHistory: user?.watchHistory || []
            },
            "Added Video to User Watch History Successfully"
        )
    )
})

const incrementViewsOfVideo = asyncHandler( async (req, res) => {
    const { videoId } = req.params;

    if(!videoId) throw new ApiError(400, "Video Id is Required");

    const videoViews = await Video.findByIdAndUpdate(videoId,
        {
            $inc:{
                views: 1
            }
        },
        {
            new: true
        }
    )

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                views: videoViews.views
            },
            "Vidoe View Incremented Successfully"
        )
    )
})

export {
    publishAVideo,
    deleteAVideo,
    getAVideo,
    updateVideoDetail,
    togglePublishStatus,
    getAllVideos,
    addVideoToWatchHistory,
    incrementViewsOfVideo
}
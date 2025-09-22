import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";



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

    const deleteVideoFromCloudinary = await deleteFromCloudinary(videoUrl);
    const deleteThumbnailFromCloudinary = await deleteFromCloudinary(thumbnailUrl);

    if(!deleteVideoFromCloudinary || !deleteThumbnailFromCloudinary) {
        console.log("CLOUDINARY DELETE FAILED");
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


export {
    publishAVideo,
    deleteAVideo
}
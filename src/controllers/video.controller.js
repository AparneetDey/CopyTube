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

    const videoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

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
        duration: video?.duration
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


export {
    publishAVideo,
}
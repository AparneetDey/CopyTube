import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";


const toggleVideoLike = asyncHandler( async (req, res) => {
    const { videoId } = req.params;

    if(!videoId) throw new ApiError(400, "Video Id is Required");

    const likedVideo =await Like.find({
        video: videoId,
        likedBy: req.user?._id
    });

    if(!likedVideo || !likedVideo.length>0){
        const justLikedVideo = await Like.create({
            video: videoId,
            likedBy: req.user?._id
        });

        res
        .status(200)
        .json(
            new ApiResponse(
                200,
                justLikedVideo,
                "Liked Video Successfully"
            )
        )
    } else {
        const justUnlikedVideo = await Like.deleteOne({
            video: videoId,
            likedBy: req.user?._id
        });

        if(!justUnlikedVideo.acknowledged) throw new ApiError(500, "Something went wrong while unliking the video");

        res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Unliked Video Successfully"
            )
        )
    }
})


export {
    toggleVideoLike
}
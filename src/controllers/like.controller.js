import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";
import mongoose from "mongoose";


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

const toggleCommentLike = asyncHandler( async (req, res) => {
    const { commentId } = req.params;

    if(!commentId) throw new ApiError(400, "Comment Id is Required");

    const likedComment =await Like.find({
        comment: commentId,
        likedBy: req.user?._id
    });

    if(!likedComment || !likedComment.length>0){
        const justLikedComment = await Like.create({
            comment: commentId,
            likedBy: req.user?._id
        });

        res
        .status(200)
        .json(
            new ApiResponse(
                200,
                justLikedComment,
                "Liked Comment Successfully"
            )
        )
    } else {
        const justUnlikedComment = await Like.deleteOne({
            comment: commentId,
            likedBy: req.user?._id
        });

        if(!justUnlikedComment.acknowledged) throw new ApiError(500, "Something went wrong while unliking the comment");

        res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Unliked Comment Successfully"
            )
        )
    }
})

const toggleTweetLike = asyncHandler( async (req, res) => {
    const { tweetId } = req.params;

    if(!tweetId) throw new ApiError(400, "Tweet Id is Required");

    const likedTweet =await Like.find({
        tweet: tweetId,
        likedBy: req.user?._id
    });

    if(!likedTweet || !likedTweet.length>0){
        const justLikedTweet = await Like.create({
            tweet: tweetId,
            likedBy: req.user?._id
        });

        res
        .status(200)
        .json(
            new ApiResponse(
                200,
                justLikedTweet,
                "Liked Tweet Successfully"
            )
        )
    } else {
        const justUnlikedTweet = await Like.deleteOne({
            tweet: tweetId,
            likedBy: req.user?._id
        });

        if(!justUnlikedTweet.acknowledged) throw new ApiError(500, "Something went wrong while unliking the tweet");

        res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Unliked tweet Successfully"
            )
        )
    }
})

const getLikedVideos = asyncHandler( async (req, res) => {
    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "likedVideos",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            thumbnail: 1,
                            owner: 1,
                            duration: 1,
                            views: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                likedVideos: {
                    $first: "$likedVideos"
                }
            }
        },
        {
            $project: {
                likedVideos: 1,
                _id: 0
            }
        }
    ])

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            likedVideos,
            "Liked Videos Fetched Successfully"
        )
    )
})


export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}
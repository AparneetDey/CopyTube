import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";
import { Tweet } from "../models/tweet.model.js";
import mongoose from "mongoose";


const getChannelStats = asyncHandler( async (req, res) => {
    // Get total videos, total views, total subscribers, total likes
    // Get total tweets, total likes
    // return res

    const {userId} = req.params;

    const totalVideos = await Video.countDocuments({
        owner: new mongoose.Types.ObjectId(userId)
    });

    const totalViews = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: null,
                totalViews: {
                    $sum: "$views"
                }
            }
        }
    ])

    const totalSubscribers = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)
            }
        },
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
                }
            }
        },
        {
            $project: {
                _id: 0,
                subscribersCount: 1
            }
        }
    ])

    const totalLikes = await Like.countDocuments(
        {
            likedBy: new mongoose.Types.ObjectId(userId),
            video: {
                $exists: true,
            }
        }
    )

    const totalTweets = await Tweet.countDocuments({
        owner: new mongoose.Types.ObjectId(userId)
    })

    const totalTweetsLikes = await Like.countDocuments({
        likedBy: new mongoose.Types.ObjectId(userId),
        tweet: {
            $exists: true
        }
    })

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                totalVideos,
                totalVideosViews: totalViews[0]?.totalViews || 0,
                totalSubscribers: totalSubscribers[0]?.subscribersCount || 0,
                totalVideosLikes: totalLikes,
                totalTweets,
                totalTweetsLikes
            },
            "Channel Stats Fetched Successfully"
        )
    )
})

const getChannelVideos = asyncHandler( async(req, res) => {
    const channelVideos = await Video.aggregate([
        {
            $match: {
                owner: req.user?._id
            }
        },
        {
            $project: {
                title: 1,
                thumbnail: 1,
                duration: 1,
                views: 1,
                createdAt: 1
            }
        }
    ])

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            channelVideos,
            "Channel Videos Fetched Successfully"
        )
    )
})


export {
    getChannelStats,
    getChannelVideos
}
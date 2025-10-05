import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";
import { Tweet } from "../models/tweet.model.js";


const getChannelStats = asyncHandler( async (req, res) => {
    // Get total videos, total views, total subscribers, total likes
    // Get total tweets, total likes
    // return res

    const totalVideos = await Video.countDocuments({
        owner: req.user?._id
    });

    const totalViews = await Video.aggregate([
        {
            $match: {
                owner: req.user?._id
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
                _id: req.user?._id
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
            likedBy: req.user?._id,
            video: {
                $exists: true,
            }
        }
    )

    const totalTweets = await Tweet.countDocuments({
        owner: req.user?._id
    })

    const totalTweetsLikes = await Like.countDocuments({
        likedBy: req.user?._id,
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


export {
    getChannelStats
}
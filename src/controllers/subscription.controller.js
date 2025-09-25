import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";


const toggleSubscription = asyncHandler (async (req, res) => {
    const {channelId} = req.params;

    if(!channelId) throw new ApiError(400, "Channel Id is Required");

    const isUserSubscribed = await Subscription.aggregate([
        {
            $match: {
                channel: channelId
            }
        },
        {
            $addFields: {
                isSubscribed: {
                    if: {$in: [req.user?._id, "$subscriber"]},
                    then: true,
                    else: false
                }
            }
        }
    ])

    if(isUserSubscribed.isSubscribed){
        const unsubscribedChannel = await Subscription.deleteOne({ subscriber: req.user?._id});

        if(!unsubscribedChannel) throw new ApiError(500, "Something went wrong while unsubscribing channel");

        res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Unsubscribed Channel Successfully"
            )
        )
    }
})

const getUserChannelSubscribers = asyncHandler( async (req, res) => {
    const { channelId } = req.params;

    if(!channelId) throw new ApiError(400, "Channel Id is Required");

    const channelSubscribers = await User.aggregate([
        {
            $match: {
                _id: channelId
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
            }
        },
        {
            $addFields: {
                subscribers: {
                    $first: "$subscribers"
                },
                subscribersCount: {
                    $size: "$subscribers"
                }
            }
        },
        {
            $project: {
                subscribers: 1,
                subscribersCount: 1
            }
        }
    ]);

    if(!channelSubscribers) throw new ApiError(500, "Something went wrong while fetching subscribers");

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            channelSubscribers,
            "Subscribers Fetched Successfully"
        )
    )
})


export {
    getUserChannelSubscribers,
}
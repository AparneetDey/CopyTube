import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";


const toggleSubscription = asyncHandler (async (req, res) => {
    const {channelId} = req.params;

    if(!channelId) throw new ApiError(400, "Channel Id is Required");

    const isUserSubscribed = await Subscription.find({
        subscriber: req.user?._id,
        channel: channelId
    })

    if(isUserSubscribed.length>0){
        const unsubscribedChannel = await Subscription.deleteOne({ subscriber: req.user?._id});

        if(!unsubscribedChannel) throw new ApiError(500, "Something went wrong while unsubscribing channel");

        res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Unsubscribed Channel Successfully"
            )
        )
    } else {
        const subscribedChannel = await Subscription.create({
            subscriber: req.user?._id,
            channel: channelId
        });

        if(!subscribedChannel) throw new ApiError(500, "Something went wrong while subscribing to the channel");

        res
        .status(200)
        .json(
            new ApiResponse(
                200,
                true,
                "Subscribed Channel Successfully"
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

    console.log(channelSubscribers);

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
    toggleSubscription
}
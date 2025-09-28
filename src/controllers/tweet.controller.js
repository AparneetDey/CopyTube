import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js";
import mongoose from "mongoose";

const createTweet = asyncHandler( async (req, res) => {
    const { content } = req.body;

    if(!content) throw new ApiError(400, "Tweet Content is Required");

    const createdTweet =  await Tweet.create({
        content,
        owner: req.user?._id
    });

    if(!createdTweet) throw new ApiError(500, "Something went wrong while saving the tweet");

    res
    .status(201)
    .json(
        new ApiResponse(
            200,
            createdTweet,
            "Tweet Created Successfully"
        )
    )
})

const getUserTweets = asyncHandler( async (req, res) => {
    const userTweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $project: {
                content: 1
            }
        }
    ]);

    if(!userTweets) throw new ApiError(500, "Something went wrong while fetching the User's Tweets");

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            userTweets,
            "USer's Tweets Fetched Successfully"
        )
    )
})

const updateTweet = asyncHandler( async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if(!tweetId) throw new ApiError(400, "Tweet Id is Required");

    if(!content) throw new ApiError(400, "Tweet Content is Required");

    const storedTweet = await Tweet.findById(tweetId);

    if(!storedTweet.owner.equals(req.user?._id)) throw new ApiError(401, "Unauthorized Request");

    storedTweet.content = content;
    await storedTweet.save({validateBeforeSave: false});

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            storedTweet,
            "Tweet Updated Successfully"
        )
    )
})


export {
    createTweet,
    getUserTweets,
    updateTweet
}
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js";

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

})


export {
    createTweet,
    getUserTweets
}
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";


const getAllComments = asyncHandler( async (req, res) => {
    const { videoId } = req.params;
    const { page=1, limit=10 } = req.query;

    if(!videoId) throw new ApiError(400, "Video Id is Required");

    const pipeline = [
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        }
    ];

    const paginateOptions = {
        page,
        limit,
        customLabels: {
            docs: "comments",
            totalDocs: "totalComments"
        },
    };

    const allComments = await Comment.aggregatePaginate(Comment.aggregate(pipeline), paginateOptions);

    if(!allComments) throw new ApiError(500, "Something went wrong while fetching the comments");

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            allComments,
            "Comments Fetched Successfully"
        )
    )
})

const addComment = asyncHandler( async (req, res) => {
    // Get comment from req.body
    // Get videoId from params
    // Validate comment and videoId
    // Create a comment docs
    // Validate the doc
    // Return res

    const { content } = req.body;
    const { videoId } = req.params;

    if(!videoId) throw new ApiError(400, "Video Id is Required");

    if(!content) throw new ApiError(400, "Comment content is Required");

    const newComment = await Comment.create({
        content,
        video: videoId,
        owner: req.user?._id
    })

    if(!newComment) throw new ApiError(500, "Something went wrong while storing the comment");

    res
    .status(201)
    .json(
        new ApiResponse(
            200,
            newComment,
            "Comment Added Successfully"
        )
    )
})

const updateComment = asyncHandler( async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if(!commentId) throw new ApiError(400, "Comment Id is Required");

    const comment = await Comment.findById(commentId);

    if(!comment.owner.equals(req.user?._id)) throw new ApiError(401, "Unauthorized Request");

    comment.content = content;
    await comment.save({validateBeforeSave: false});

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            comment,
            "Comment Updated Successfully"
        )
    )
})

const deleteComment = asyncHandler( async (req, res) => {
    const { commentId } = req.params;

    if(!commentId) throw new ApiError(400, "Comment Id is Required");

    const storedComment = await Comment.findById(commentId);

    if(!storedComment) throw new ApiError("No comment Exist");

    if(!storedComment.owner.equals(req.user?._id)) throw new ApiError(401, "Unauthorized Request");

    const deletedResponse = await Comment.deleteOne({_id: storedComment._id});

    if(!deletedResponse.acknowledged) throw new ApiError(500, "Something went wrong while deleting the comment");

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Comment Deleted Successfully"
        )
    )
})


export {
    addComment,
    getAllComments,
    updateComment,
    deleteComment
}
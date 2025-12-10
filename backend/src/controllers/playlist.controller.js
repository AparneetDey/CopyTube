import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import mongoose from "mongoose";


const createPlayList = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name) throw new ApiError(400, "Name is Required");

    const createdPlayList = await Playlist.create({
        name,
        description,
        owner: req.user?._id
    });

    if (!createPlayList) throw new ApiError(500, "Something went wrong while creating the playlist");

    res
        .status(201)
        .json(
            new ApiResponse(
                200,
                createdPlayList,
                "Playlist Created Successfully"
            )
        )
})

const getUserPlayLists = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) throw new ApiError(400, "User Id is Required");

    const userPlayList = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videoDetail",
                pipeline: [
                    {
                        $project: {
                            thumbnail: 1,
                            title: 1,
                            createdAt: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                videoCount: {
                    $size: "$videos"
                }
            }
        }
    ])

    if (!userPlayList) throw new ApiError(500, "Something went wrong while fetching the user's playlist");

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                userPlayList,
                "User's Playlists Fetched Successfully"
            )
        )
})

const getPlayListById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    console.log(playlistId)

    if (!playlistId) throw new ApiError(400, "User Id is Required");

    const playList = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
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
                            avatar: 1,
                            fullName: 1,
                            username: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [
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
                                        username: 1
                                    }
                                }
                            ]
                        }
                    }, 
                    {
                        $project: {
                            thumbnail: 1,
                            title: 1,
                            owner: 1,
                            duration: 1,
                            views: 1,
                            createdAt: 1
                        }
                    }
                ]
            }
        }
    ])

    if (!playList) throw new ApiError(500, "Something went wrong while fetching the user's playlist");

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playList,
                "Playlist Fetched Successfully"
            )
        )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!playlistId || !videoId) throw new ApiError(400, "Playlist Id and Video Id are Required");

    const currentPlayList = await Playlist.findById(playlistId);

    if (currentPlayList.videos.some(video => video.equals(videoId))) throw new ApiError(400, "Video Already Exist in the Playlist");

    currentPlayList.videos.push(videoId);
    await currentPlayList.save({ validateBeforeSave: false });

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    videos: currentPlayList.videos
                },
                "Video Added to Playlist Successfully"
            )
        )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!playlistId || !videoId) throw new ApiError(400, "Playlist Id and Video Id are Required");

    const updatedPlayList = await Playlist.findByIdAndUpdate(playlistId,
        {
            $pull: {
                videos: videoId
            },
        },
        {
            new: true
        }
    );

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    videos: updatedPlayList.videos
                },
                "Video Removed from Playlist Successfully"
            )
        )
})

const deletePlayList = asyncHandler( async (req, res) => {
    const { playlistId } = req.params;

    if(!playlistId) throw new ApiError(400, "Playlist Id is Required");

    const deletedPlayList = await Playlist.findByIdAndDelete(playlistId);

    if(!deletedPlayList) throw new ApiError(500, "Something went wrong while deleting the playlist");

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Playlist Deleted Successfully"
        )
    )
})

const updatePlayList = asyncHandler( async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if(!playlistId) throw new ApiError(400, "Playlist Id is Required");

    if(!name && !description) throw new ApiError(400, "Atleast one field is Required");

    const updatedPlayList = await Playlist.findByIdAndUpdate(playlistId,
        {
            $set:{
                name,
                description
            }
        },
        {
            new: true
        }
    )

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedPlayList,
            "Playlist Updated Successfully"
        )
    )
})


export {
    createPlayList,
    getUserPlayLists,
    getPlayListById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlayList,
    updatePlayList
}
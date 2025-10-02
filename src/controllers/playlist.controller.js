import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";


const createPlayList = asyncHandler( async (req, res) => {
    const { name, description } = req.body;

    if(!name) throw new ApiError(400, "Name is Required");

    const createdPlayList = await Playlist.create({
        name,
        description,
        owner: req.user?._id
    });

    if(!createPlayList) throw new ApiError(500, "Something went wrong while creating the playlist");

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

const getUserPlayLists = asyncHandler( async (req, res) => {
    const { userId } = req.params;

    if(!userId) throw new ApiError(400, "User Id is Required");

    const userPlayList = await Playlist.find({
        owner: userId
    });

    if(!userPlayList) throw new ApiError(500, "Something went wrong while fetching the user's playlist");

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

const getPlayListById = asyncHandler( async (req, res) => {
    const { playlistId } = req.params;

    console.log(playlistId)

    if(!playlistId) throw new ApiError(400, "User Id is Required");

    const playList = await Playlist.find({
        _id: playlistId
    });

    if(!playList) throw new ApiError(500, "Something went wrong while fetching the user's playlist");

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


export {
    createPlayList,
    getUserPlayLists,
    getPlayListById
}
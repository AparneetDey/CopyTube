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


export {
    createPlayList
}
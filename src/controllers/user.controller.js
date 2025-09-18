import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const userRegister = asyncHandler( async (req, res) => {
    // Get user details from body
    // Validation - if required fields are empty
    // Check if user already exists
    // Get the avatar and coverImage
    // Check for images, check for avatar
    // Store the images on cloudinary
    // Check if images(avatar) is stored on cloudinary
    // Store the data in our db
    // Check if the data is stored
    // get the the user with out password and refreshToken
    // return res

    const {username, email, password, fullName} = req.body;
    console.log(email)

    if (
        [username, email, fullName, password].some((field) => {
            return field==="";
        })
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    });

    if(existedUser) return ApiError(409, "User already exist");

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPAth = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) return ApiError(400, "Avatar is required");

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPAth);

    if(!avatar) return ApiError(400, "Avatar is required");

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if(!createdUser) return ApiError(500, "Something went wrong while registering user");

    res.status(201).json(
        ApiResponse(200, createdUser, "User Registered Successfully")
    )


});

export {userRegister};
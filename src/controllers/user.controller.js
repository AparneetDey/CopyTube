import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"




const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken};


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
}

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

    if (
        [username, email, fullName, password].some((field) => field?.trim()==="" || !field)
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    });

    if(existedUser) throw new ApiError(409, "User already exist");

    let avatarLocalPath;
    let coverImageLocalPath;

    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0){
        avatarLocalPath = req.files.avatar[0].path;
    }
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath) throw new ApiError(400, "Avatar is required");

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) throw new ApiError(400, "Avatar is required");

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        refreshToken: ""
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if(!createdUser) throw new ApiError(500, "Something went wrong while registering user");

    res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )


});

const userLogIn = asyncHandler( async (req, res) => {
    // req.body -> data
    // validate data -> username and password
    // find user from db
    // Check if password is correct
    // generate access and refresh token
    // send cookie

    const {username, email, password} = req.body;

    if(!username || !email) throw new ApiError(400, "Username or Email is required");

    const user =  await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user) throw new ApiError(404, "User does not exist");

    const isPAsswordValid = user.isPasswordCorrect(password);

    if(!isPAsswordValid) throw new ApiError(401, "Password is incorrect");

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUSer = await User.findById(user._id).select("-password -refreshToken");

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUSer, accessToken, refreshToken
            },
            "User Logged In successfully"
        )
    )
})

const userLogOut = asyncHandler( async (req, res) => {
    // Get user from middleware
    // Clear refresh token
    // Clear cookie
    // return

    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined,
        }
    }, {
        new: true,
    })

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(
        new ApiResponse(200, {}, "User Logged Out")
    )
})

export {
    userRegister,
    userLogIn,
    userLogOut
};
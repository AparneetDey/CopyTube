import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"


const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none"
}


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
}



//Route Controllers
const userRegister = asyncHandler(async (req, res) => {
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

    const { username, email, password, fullName } = req.body;

    if (
        [username, email, fullName, password].some((field) => field?.trim() === "" || !field)
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) throw new ApiError(409, "User already exist");

    let avatarLocalPath;
    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path;
    }
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) throw new ApiError(400, "Avatar is required");

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

    if (!createdUser) throw new ApiError(500, "Something went wrong while registering user");

    res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )


});

const userLogIn = asyncHandler(async (req, res) => {
    // req.body -> data
    // validate data -> username and password
    // find user from db
    // Check if password is correct
    // generate access and refresh token
    // send cookie

    const { email, password, username } = req.body;

    if (!username && !email) throw new ApiError(400, "Username or Email is required");

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) throw new ApiError(404, "User does not exist");

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) throw new ApiError(401, "Password is incorrect");

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUSer = await User.findById(user._id).select("-password -refreshToken");

    res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUSer,
                    accessToken,
                    refreshToken
                },
                "User Logged In successfully"
            )
        )
})

const userLogOut = asyncHandler(async (req, res) => {
    // Get user from middleware
    // Clear refresh token
    // Clear cookie
    // return

    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: "",
        }
    }, {
        new: true,
    })

    res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(
            new ApiResponse(200, {}, "User Logged Out")
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    // Get refresh token from req.cookies
    // Validate token
    // Decode the token
    // Find the user using the decoded token
    // Compare the incoming token and stored token
    // Generate new tokens
    // return cookies
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken || "";

    if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized Request");

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id);

        if (!user) throw new ApiError(401, "Invalid Refresh Token :: User not found");

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh Token is Expired or Used");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        res
            .status(201)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken
                    },
                    "New Tokens Created Successfully"
                )
            )
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Something went wrong while refreshing Access token");
    }
})

const changeUserPassword = asyncHandler(async (req, res) => {
    // Get old and new password from req.body
    // Get user -> db -> req
    // Validate old password
    // Change password to new password
    // return res

    const { oldPassword, newPassword } = req.body;

    if (newPassword === "") throw new ApiError(400, "New Password can not be empty");

    const user = await User.findById(req.user._id);

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordValid) throw new ApiError(400, "Invalid Old Password");

    user.password = newPassword
    await user.save({ validateBeforeSave: false });

    res
        .status(201)
        .json(
            new ApiResponse(200, "Password Changed Successfully")
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    // Get the user -> db -> req
    // return res

    const currentUser = await User.findById(req.user._id).select("-password -refreshToken");

    if (!currentUser) throw new ApiError(401, "Token is Expired or Used");

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    user: currentUser
                },
                "User Fetched Successfully"
            )
        )
})

const userDetailUpdate = asyncHandler(async (req, res) => {
    const { fullName } = req.body;

    if (!fullName) throw new ApiError(400, "Fullname is Required");

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                fullName
            }
        },
        { new: true }
    ).select("-password -refreshToken");

    if (!user) throw new ApiError(404, "User Not Found");

    res
        .status(201)
        .json(
            new ApiResponse(
                200,
                user,
                "Fullname Updated Successfully"
            )
        )
})

const userAvatarUpdate = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) throw new ApiError(400, "Avatar is Required");

    const newAvatar = await uploadOnCloudinary(avatarLocalPath);

    if (!newAvatar) throw new ApiError(500, "Something went wrong while uploading avatar on cloudinary");

    const user = await User.findById(req.user._id).select("-password -refreshToken");

    if (!user) throw new ApiError(404, "User Not Found");

    const previousAvatarUrl = user.avatar;

    user.avatar = newAvatar.url;
    await user.save({ validateBeforeSave: false });

    const deleteResponse = await deleteFromCloudinary(previousAvatarUrl);

    if (!deleteResponse) {
        console.log("The previous Avatar is not Deleted from Cloudinary")
    }

    res
        .status(201)
        .json(
            new ApiResponse(
                200,
                user,
                "Avatar Updated Successfully"
            )
        )
})

const userCoverImageUpdate = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) throw new ApiError(400, "coverImage is Required");

    const newCoverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!newCoverImage) throw new ApiError(500, "Something went wrong while uploading Cover Image on cloudinary");

    const user = await User.findById(req.user._id).select("-password -refreshToken");

    if (!user) throw new ApiError(404, "User Not Found");

    const previousCoverImageUrl = user.coverImage;

    user.coverImage = newCoverImage.url;
    await user.save({ validateBeforeSave: false });

    const deleteResponse = await deleteFromCloudinary(previousCoverImageUrl);

    // console.log(deleteResponse);

    if (!deleteResponse) {
        console.log("The previous Cover Image is not Deleted from Cloudinary");
    }

    res
        .status(201)
        .json(
            new ApiResponse(
                200,
                user,
                "Avatar Updated Successfully"
            )
        )
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username?.trim()) throw new ApiError(400, "User name is Required");

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                username: 1,
                fullName: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                subscribersCount: 1,
                channelSubscribedToCount: 1,
                isSubscribed: 1
            }
        }
    ])

    if (!channel?.length) throw new ApiError(400, "Channel not Found");

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    channel: channel[0]
                },
                "User Channel Fetched Successfully"
            )
        )
})

const getUserWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: req.user?._id
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
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
                    },
                    {
                        $project: {
                            thumbnail: 1,
                            title: 1,
                            description: 1,
                            owner: 1,
                            duration: 1,
                            views: 1
                        }
                    }
                ]
            }
        },
    ]);

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0].watchHistory,
                "User watch hostory Fetched Successfully"
            )
        )
})

export {
    userRegister,
    userLogIn,
    userLogOut,
    refreshAccessToken,
    changeUserPassword,
    getCurrentUser,
    userDetailUpdate,
    userAvatarUpdate,
    userCoverImageUpdate,
    getUserChannelProfile,
    getUserWatchHistory
};
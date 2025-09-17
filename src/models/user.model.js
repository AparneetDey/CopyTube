import mongoose, { Schema} from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        avatar: {
            type: String, //CLoudinary URL
            required: true,
        },
        coverImage: {
            type: String, //CLoudinary URL
            required: true,
        },
        watchHistory: [
            {  
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        refreshToken: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);



export const User = mongoose.model("User", userSchema);
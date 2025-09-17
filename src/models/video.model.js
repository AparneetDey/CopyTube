import mongoose, { Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String, //CLoudinary URL
            required: true,
        },
        thumbnail: {
            type: String, //CLoudinary URL
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        duration: {
            type: Number,
            required: true,
        },
        views: {
            type: Number,
            required: true,
        },
        isPublished: {
            type: Boolean,
            Default: true,
        }
    },
    {
        timestamps: true,
    }
)

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
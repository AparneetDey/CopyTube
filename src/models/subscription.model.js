import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
    {
        subscriber: { //User who subscribed
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        channel: { //User who is "subscriber" subscribed too
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)



export const Subscription = mongoose.model("Subscription", subscriptionSchema);
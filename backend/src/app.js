import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = [
    process.env.DEV_ORIGIN,              // local frontend
    process.env.PROD_ORIGIN,   // deployed frontend
]

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like Postman or curl)
            if (!origin) return callback(null, true)
            if (allowedOrigins.includes(origin)) return callback(null, true)
            return callback(new Error("Not allowed by CORS"))
        },
        credentials: true, // if using cookies or auth headers
    })
)

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


//Router import
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import commentRouter from "./routes/comment.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"


//Router Declaration
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);



export { app }
import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

const router = Router();

router.use(verifyToken);


router.route("/l/video/:videoId").get(toggleVideoLike);

router.route("/l/comment/:commentId").get(toggleCommentLike);

router.route("/l/tweet/:tweetId").get(toggleTweetLike);

router.route("/").get(getLikedVideos);


export default router;
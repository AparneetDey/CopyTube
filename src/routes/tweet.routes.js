import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";

const router = Router();

router.use(verifyToken);


router.route("/")
.post(createTweet)
.get(getUserTweets);

router.route("/t/:tweetId").post(updateTweet).get(deleteTweet);



export default router;
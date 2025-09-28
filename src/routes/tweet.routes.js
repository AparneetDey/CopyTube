import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";

const router = Router();

router.use(verifyToken);


router.route("/")
.post(createTweet)
.get(getUserTweets);

router.route("/t/update/:tweetId").post(updateTweet);



export default router;
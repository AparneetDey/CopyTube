import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getAllTweets, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";

const router = Router();

router.use(verifyToken);


router.route("/")
.post(createTweet)


router.route("/t/c/:userId").get(getUserTweets);

router.route("/all").get(getAllTweets);

router.route("/t/:tweetId").post(updateTweet).get(deleteTweet);



export default router;
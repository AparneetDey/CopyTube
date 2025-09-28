import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createTweet, getUserTweets } from "../controllers/tweet.controller.js";

const router = Router();

router.use(verifyToken);


router.route("/")
    .post(createTweet)
    .get(getUserTweets);


export default router;
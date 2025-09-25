import { Router } from "express";
import { getUserChannelSubscribers } from "../controllers/subscription.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken)


router.route("/s/subscribers/:channelId").get(getUserChannelSubscribers);


export default router;
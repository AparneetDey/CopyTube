import { Router } from "express";
import { getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken)


router.route("/s/:channelId").get(toggleSubscription);

router.route("/s/subscribers/:channelId").get(getUserChannelSubscribers);


export default router;
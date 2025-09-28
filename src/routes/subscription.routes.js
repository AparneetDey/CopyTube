import { Router } from "express";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken)


router.route("/s/:channelId").get(toggleSubscription);

router.route("/s/subscribers/:channelId").get(getUserChannelSubscribers);

router.route("/s/channels/:subscriberId").get(getSubscribedChannels);


export default router;
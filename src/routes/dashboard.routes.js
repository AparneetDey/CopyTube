import { Router } from "express";
import { getChannelStats } from "../controllers/dashboard.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken)


router.route("/").get(getChannelStats);


export default router;
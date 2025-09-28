import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { toggleCommentLike, toggleVideoLike } from "../controllers/like.controller.js";

const router = Router();

router.use(verifyToken);


router.route("/l/video/:videoId").get(toggleVideoLike);

router.route("/l/comment/:commentId").get(toggleCommentLike);


export default router;
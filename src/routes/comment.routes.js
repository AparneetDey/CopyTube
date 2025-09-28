import { Router } from "express";
import { addComment, getAllComments, updateComment } from "../controllers/comment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken);


router.route("/c/:videoId")
.post(addComment)
.get(getAllComments)

router.route("/c/update/:commentId").post(updateComment);


export default router;
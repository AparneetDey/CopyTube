import { Router } from "express";
import { addComment, deleteComment, getAllComments, updateComment } from "../controllers/comment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken);


router.route("/c/:videoId")
.post(addComment)
.get(getAllComments)

router.route("/c/update/:commentId").post(updateComment);

router.route("/c/delete/:commentId").get(deleteComment);


export default router;
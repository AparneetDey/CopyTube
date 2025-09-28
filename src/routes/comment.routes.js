import { Router } from "express";
import { addComment, getAllComments } from "../controllers/comment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyToken);


router.route("/c/:videoId")
.post(addComment)
.get(getAllComments)


export default router;
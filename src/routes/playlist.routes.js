import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createPlayList } from "../controllers/playlist.controller.js";

const router = Router();

router.use(verifyToken);


router.route("/").post(createPlayList);


export default router;
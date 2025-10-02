import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createPlayList, getUserPlayLists } from "../controllers/playlist.controller.js";

const router = Router();

router.use(verifyToken);


router.route("/").post(createPlayList);

router.route("/p/:userId").get(getUserPlayLists);


export default router;
import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createPlayList, getPlayListById, getUserPlayLists } from "../controllers/playlist.controller.js";

const router = Router();

router.use(verifyToken);


router.route("/").post(createPlayList);

router.route("/p/user/:userId").get(getUserPlayLists);

router.route("/p/:playlistId").get(getPlayListById);


export default router;
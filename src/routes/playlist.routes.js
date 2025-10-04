import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlayList, getPlayListById, getUserPlayLists, removeVideoFromPlaylist } from "../controllers/playlist.controller.js";

const router = Router();

router.use(verifyToken);


router.route("/").post(createPlayList);

router.route("/p/user/:userId").get(getUserPlayLists);

router.route("/p/:playlistId").get(getPlayListById);

router.route("/p/add/:playlistId/:videoId").patch(addVideoToPlaylist);

router.route("/p/remove/:playlistId/:videoId").patch(removeVideoFromPlaylist);




export default router;
import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlayList, deletePlayList, getPlayListById, getUserPlayLists, removeVideoFromPlaylist, updatePlayList } from "../controllers/playlist.controller.js";

const router = Router();

router.use(verifyToken);


router.route("/").post(createPlayList);

router.route("/p/user/:userId").get(getUserPlayLists);

router.route("/p/:playlistId").get(getPlayListById);

router.route("/p/add/:playlistId/:videoId").patch(addVideoToPlaylist);

router.route("/p/remove/:playlistId/:videoId").patch(removeVideoFromPlaylist);

router.route("/p/delete/:playlistId").delete(deletePlayList);

router.route("/p/update/:playlistId").patch(updatePlayList);


export default router;
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { deleteAVideo, getAVideo, publishAVideo, togglePublishStatus, updateVideoDetail } from "../controllers/video.controller.js";

const router = Router();

router.use(verifyToken);


router.route("/").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishAVideo
);

router.route("/v/update/:videoId").post(
    upload.single("thumbnail"),
    updateVideoDetail
)

router.route("/v/toggle-publish/:videoId").get(togglePublishStatus);

router.route("/v/delete/:videoId").get(deleteAVideo);

router.route("/v/:videoId").get(getAVideo);

export default router;
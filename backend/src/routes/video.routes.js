import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { addVideoToWatchHistory, deleteAVideo, getAllVideos, getAVideo, incrementViewsOfVideo, publishAVideo, togglePublishStatus, updateVideoDetail } from "../controllers/video.controller.js";

const router = Router();

router.use(verifyToken);


router.route("/")
.post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
            limits: { fileSize: 1024 * 1024 * 500 }
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishAVideo
)
.get(getAllVideos);

router.route("/v/update/:videoId").post(
    upload.single("thumbnail"),
    updateVideoDetail
)

router.route("/v/toggle-publish/:videoId").get(togglePublishStatus);

router.route("/v/delete/:videoId").get(deleteAVideo);

router.route("/v/:videoId").get(getAVideo);

router.route("/v/watch-history/:videoId").get(addVideoToWatchHistory);

router.route("/v/views/:videoId").get(incrementViewsOfVideo);


export default router;
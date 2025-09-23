import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { deleteAVideo, getAVideo, publishAVideo, updateVideoDetail } from "../controllers/video.controller.js";

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

router.route("/update/:videoId").post(
    upload.single("thumbnail"),
    updateVideoDetail
)

router.route("/delete/:videoId").get(deleteAVideo);

router.route("/:videoId").get(getAVideo);

export default router;
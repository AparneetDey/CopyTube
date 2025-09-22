import { Router } from "express";
import { 
    changeUserPassword, 
    getCurrentUser, 
    getUserChannelProfile, 
    getUserWatchHistory, 
    refreshAccessToken, 
    userAvatarUpdate, 
    userCoverImageUpdate, 
    userDetailUpdate, 
    userLogIn, 
    userLogOut, 
    userRegister 
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    userRegister
);

router.route("/login").post(
    userLogIn
);

router.route("/refresh-token").post(refreshAccessToken);

//secure routes
router.route("/logout").post(
    verifyToken,
    userLogOut
);

router.route("/change-password").post(
    verifyToken,
    changeUserPassword
);



router.route("/update-user").patch(
    verifyToken,
    userDetailUpdate
);

router.route("/update-avatar").patch(
    upload.single('avatar'),
    verifyToken,
    userAvatarUpdate
);

router.route("/update-cover-image").patch(
    upload.single('coverImage'),
    verifyToken,
    userCoverImageUpdate
);



router.route("/current-user").get(
    verifyToken,
    getCurrentUser
);

router.route("/c/:username").get(
    verifyToken,
    getUserChannelProfile
);

router.route("/history").get(
    verifyToken,
    getUserWatchHistory
);



export default router;
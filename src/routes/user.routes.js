import { Router } from "express";
import { changeUserPassword, getCurrentUser, refreshAccessToken, userDetailUpdate, userLogIn, userLogOut, userRegister } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
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

router.route("/update-user").post(
    verifyToken,
    userDetailUpdate
);

router.route("/current-user").get(
    verifyToken,
    getCurrentUser
);



export default router;
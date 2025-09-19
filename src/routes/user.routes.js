import { Router } from "express";
import { changeUserPassword, refreshAccessToken, userLogIn, userLogOut, userRegister } from "../controllers/user.controller.js";
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



export default router;
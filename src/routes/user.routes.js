import { Router } from "express";
import { userLogIn, userLogOut, userRegister } from "../controllers/user.controller.js";
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

//secure routes
router.route("/logout").post(
    verifyToken,
    userLogOut
);



export default router;
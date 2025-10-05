import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const healthCheck = asyncHandler(async (req, res) => {
    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                status: "ok"
            },
            "Health Check Successfully"
        )
    )
})


export {
    healthCheck
}
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        //File successfully saved in cloudinary
        // console.log("File has been saved in cloudinary: ", response);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log("CLOUDINARY UPLOAD ERROR :: ", error);
        return null;
    }
}


const getCloudinaryPublicId = (url) => {
    try {
        const u = new URL(url);
        const path = u.pathname;

        // console.log(path);

        // find "/upload/" part
        const uploadIndex = path.indexOf('/upload/');
        if (uploadIndex === -1) return null;

        // substring after "/upload/"
        let afterUpload = path.slice(uploadIndex + '/upload/'.length);

        // remove version segment if present: "/v12345/"
        const vMatch = afterUpload.match(/^v\d+\//);

        if (!vMatch) return null;

        afterUpload = afterUpload.slice(vMatch[0].length);

        // remove file extension (last dot + letters)
        const lastDot = afterUpload.lastIndexOf('.');
        const publicId = lastDot === -1 ? afterUpload : afterUpload.slice(0, lastDot);

        // console.log(publicId);

        // decode %20 etc
        return decodeURIComponent(publicId);
    } catch (error) {
        return null;
    }
}

const deleteFromCloudinary = async (url) => {
    try {
        if (!url) return null;

        const publicId = getCloudinaryPublicId(url);

        // console.log(publicId);

        if (!publicId) return null;

        const res = await cloudinary.uploader.destroy(publicId);

        return (res.result !== "not found");
    } catch (error) {
        console.log("CLOUDINARY DELETE FAILED :: ", error);
    }
}

const deleteVideoFromCloudinary = async (url) => {
    try {
        if (!url) return null;

        const publicId = getCloudinaryPublicId(url);

        // console.log(publicId);

        if (!publicId) return null;

        const res = await cloudinary.uploader.destroy(publicId, {resource_type: "video"});

        return (res.result !== "not found");
    } catch (error) {
        console.log("CLOUDINARY DELETE FAILED :: ", error);
    }
}


export { uploadOnCloudinary, deleteFromCloudinary, deleteVideoFromCloudinary }
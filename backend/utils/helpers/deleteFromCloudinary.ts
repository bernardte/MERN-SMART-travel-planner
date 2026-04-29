import cloudinary from "../../config/cloudinary"

export const deleteFromCloudinary = async (cloudinaryImagePublicId: string) => {
    try {
        await cloudinary.uploader.destroy(cloudinaryImagePublicId);
        
    } catch (error) {
        console.log("Cloudinary delete error", error);
    }
}
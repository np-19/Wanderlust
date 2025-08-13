const cloudinary = require('cloudinary').v2;
const fs = require('fs');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET    
})


const uploadOnCloudinary = async(filePath) => {
    try {
        //upload file on cloudinary
        if(!filePath){
            return null;
        }
        const response = await cloudinary.uploader.upload(filePath,{
            resource_type: 'auto',
            folder: 'wanderlust_dev'
        
        })
        console.log("File uploaded on cloudinary",
            response.url)
            return response;
        
    } catch (error) {
        req.flash('error', error.message)
        fs.unlinkSync(filePath)
        return null;
        
    }
}



const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted from Cloudinary: ${publicId}`, result);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
    return null;
  }
};

module.exports = {
  uploadOnCloudinary,
  deleteFromCloudinary
};



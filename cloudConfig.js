const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ 
    cloud_name: process.env.COULD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET // Click 'View Credentials' below to copy your API secret
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wonderlust_dev_listing_image',
      allowedformat: ["png","jpg","jpeg"], // supports promises as well
      
    },
  });

  module.exports = {cloudinary,storage};
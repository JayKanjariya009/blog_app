const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const uploadToImgBB = async (filePath, apiKey) => {
  try {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath));
    
    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData, {
      headers: formData.getHeaders()
    });
    
    return response.data.data.url;
  } catch (error) {
    throw new Error('Failed to upload image to ImgBB: ' + error.message);
  }
};

module.exports = { uploadToImgBB };
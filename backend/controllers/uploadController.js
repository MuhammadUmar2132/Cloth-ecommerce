// @desc    Upload image (saves to Cloudinary)
// @route   POST /api/upload
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const cloudinary = require('../config/cloudinary');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Upload local file saved by multer to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'uploads',
    });

    // Remove local temp file
    await unlinkFile(req.file.path).catch(() => {});

    res.json({ success: true, url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
};

module.exports = { uploadImage };

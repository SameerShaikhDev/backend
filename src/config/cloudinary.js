const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Readable } = require('stream');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(file.mimetype);
        if (extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed'));
    },
});

const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `pandit-ji/${folder}`,
                resource_type: 'auto',
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
    });
};

const deleteFromCloudinary = (publicId) => {
    return cloudinary.uploader.destroy(publicId);
};

module.exports = { cloudinary, upload, uploadToCloudinary, deleteFromCloudinary };
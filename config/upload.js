/**
 * Configuring image file upload
 * to the db with multer
 */

const multer = require('multer');
const path = require('path');

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Set up multer with storage, file size limit, and file type filter
const upload = multer({
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024}, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/'))
            cb(null, true);
        else {
            req.fileValidationError = 'Only images are allowed';
            cb(null, false);
        }
    }
});

module.exports = upload;

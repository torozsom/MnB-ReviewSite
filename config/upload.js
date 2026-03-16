/**
 * Configuring image file upload
 * to the db with multer
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directory exists
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir))
    fs.mkdirSync(uploadDir, { recursive: true });


// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Set up multer with storage, file size limit, and file type filter
const upload = multer({
    storage: storage,
    limits: {fileSize: 15 * 1024 * 1024}, // 15MB limit
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

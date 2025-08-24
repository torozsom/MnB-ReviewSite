/**
 * Configuring image file upload
 * to the db with multer
 */

const multer = require('multer');
const storage = multer.memoryStorage(); // Store in memory before saving to DB
const upload = multer({
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024}, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/'))
            cb(null, true);
        else
            cb(new Error('Only images are allowed'), false);
    }
});

module.exports = upload;

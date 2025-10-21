const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Use OS temp directory for initial upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const tempDir = path.join(os.tmpdir(), 'upload-temp');
        fs.mkdirSync(tempDir, { recursive: true });
        cb(null, tempDir);
    },
    filename: function(req, file, cb) {
        // Use a simple timestamp for temporary files
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, `${timestamp}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedMimes.includes(file.mimetype)) {
        cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP)'), false);
        return;
    }

    if (file.size && file.size > maxSize) {
        cb(new Error('File size exceeds 10MB limit'), false);
        return;
    }

    cb(null, true);
};

const limits = {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
});

module.exports = upload;
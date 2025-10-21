const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { sanitizeTitle } = require("../../utils/sanitize");
const Schema = require("../../model/Update.model");
const Controller = require("../../controller/Update.controller");
const { isLoggedIn } = require("../../middleware/Auth.middleware");

// Error handler wrapper
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const router = express.Router();

const getFolderName = (req) => {
    // Use centralized sanitizer to create a consistent folder slug
    return sanitizeTitle(req.body.title);
};

const createStorage = (getFolderNameFn) => {
    return multer.diskStorage({
        destination: async (req, file, cb) => {
            try {
                const dir = await getFolderNameFn(req);
                const projDir = path.join('./uploads/Update', dir);
                fs.mkdirSync(projDir, { recursive: true });
                cb(null, projDir);
            } catch (error) {
                cb(error);
            }
        },
        filename: (req, file, cb) => {
            try {
                // Sanitize filename while preserving extension
                const ext = path.extname(file.originalname);
                const basename = path.basename(file.originalname, ext)
                    .replace(/[^a-zA-Z0-9-_]/g, '-');
                const filename = `${Date.now()}-${basename}${ext}`;
                cb(null, filename);
            } catch (error) {
                cb(error);
            }
        },
    });
};

// Multer limits to support large text fields without affecting file streams
const multerLimits = {
    fileSize: 50 * 1024 * 1024, // 50MB per file
    fields: 2000,               // allow many text fields
    fieldSize: 10 * 1024 * 1024 // 10MB per text field (description etc.)
};

// Storage for new posts
const newPostStorage = createStorage(getFolderName);
const uploads = multer({ storage: newPostStorage, limits: multerLimits });

// Storage for updating existing posts
const getExistingFolderName = async (req) => {
    const update = await Schema.findById(req.params.id);
    return sanitizeTitle(update.title);
};
const updateStorage = createStorage(getExistingFolderName);
const updateUploads = multer({ storage: updateStorage, limits: multerLimits });

router.get("/", isLoggedIn, Controller.view);
router.get("/add", isLoggedIn, Controller.add);
router.post(
	"/",
	isLoggedIn,
	uploads.fields([
		{ name: "download", maxCount: 1 },
		{ name: "photos", maxCount: 10 },
	]),
	Controller.post
);
router.delete("/:id", isLoggedIn, Controller.remove);
router.patch("/:id/citation", isLoggedIn, Controller.updateCitation);

// Update any field route
router.patch("/:id", isLoggedIn, Controller.updateFields);

// Photo update route with logging middleware
router.patch("/:id/photos", 
    isLoggedIn,
    (req, res, next) => {
        console.log('Processing photo update request for ID:', req.params.id);
        next();
    },
    updateUploads.fields([{ name: "newImages", maxCount: 10 }]),
    asyncHandler(Controller.updatePhotos)
);

module.exports = router;

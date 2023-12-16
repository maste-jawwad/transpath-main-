const express = require("express");
const multer = require("multer");

const Controller = require("../../controller/Stream1.controller");
const { isLoggedIn } = require("../../middleware/Auth.middleware");

const router = express.Router();

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads/Stream1");
	},
	filename: (req, file, cb) => {
		const filename = file.originalname.replace(/\s/g, "");
		cb(null, Date.now().toString() + filename);
	},
});

const upload = multer({ storage });

router.get("/", isLoggedIn, Controller.view);
router.get("/add", isLoggedIn, Controller.add);
router.post("/", isLoggedIn, upload.single("photo"), Controller.post);
router.delete("/:id", isLoggedIn, Controller.remove);

module.exports = router;

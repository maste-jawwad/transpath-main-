const express = require("express");
const fs = require("fs");
const multer = require("multer");

const Controller = require("../../controller/Update.controller");

const router = express.Router();

const getFolderName = (req) => {
	const title = req.body.title;
	const formatTitle = title.replace(/\s/g, "").toLowerCase();
	return formatTitle;
};

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const dir = getFolderName(req);
		const projDir = `./uploads/Update/${dir}`;
		fs.mkdirSync(projDir, {
			recursive: true,
		});
		cb(null, projDir);
	},
	filename: (req, file, cb) => {
		const filename = file.originalname.replace(/\s/g, "");
		cb(null, Date.now().toString() + filename);
	},
});

const uploads = multer({ storage });

router.get("/", Controller.view);
router.get("/add", Controller.add);
router.post(
	"/",
	uploads.fields([
		{ name: "download", maxCount: 1 },
		{ name: "photos", maxCount: 5 },
	]),
	Controller.post
);
router.delete("/:id", Controller.remove);

module.exports = router;

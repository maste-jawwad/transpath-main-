const express = require("express");
const multer = require("multer");

const Controller = require("../../controller/People.controller");

const router = express.Router();

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads/People/");
	},
	filename: (req, file, cb) => {
		const fileName = file.originalname.replace(/\s/g, "");
		cb(null, Date.now().toString() + fileName);
	},
});

const upload = multer({ storage });

router.get("/", Controller.view);
router.get("/add", Controller.add);
router.post("/", upload.single("photo"), Controller.post);
router.delete("/:id", Controller.remove);

module.exports = router;

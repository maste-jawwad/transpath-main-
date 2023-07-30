const express = require("express");
const multer = require("multer");

const Controller = require("../../controller/ProjectPartner.controller");
const { isLoggedIn } = require("../../middleware/Auth.middleware");

const router = express.Router();

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads/Project_Partners/");
	},
	filename: (req, file, cb) => {
		const fileName = file.originalname.replace(/\s/g, "");
		cb(null, Date.now().toString() + fileName);
	},
});

const upload = multer({ storage });

router.get("/", isLoggedIn, Controller.viewProjectPartner);
router.get("/add", isLoggedIn, Controller.addProjectPartnerForm);
router.post(
	"/",
	isLoggedIn,
	upload.single("photo"),
	Controller.postProjectPartner
);
router.delete("/:id", isLoggedIn, Controller.deleteProjectPartner);

module.exports = router;

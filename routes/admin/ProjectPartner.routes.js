const express = require("express");
const multer = require("multer");

const Controller = require("../../controller/ProjectPartner.controller");

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

router.get("/", Controller.viewProjectPartner);
router.get("/add", Controller.addProjectPartnerForm);
router.post("/", upload.single("photo"), Controller.postProjectPartner);
router.delete("/:id", Controller.deleteProjectPartner);

module.exports = router;

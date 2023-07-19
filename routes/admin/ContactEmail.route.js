const express = require("express");
const router = express.Router();

const Controller = require("../../controller/ContactEmail.controller");

router.get("/", Controller.viewEmail);

router.get("/add", Controller.addEmailForm);

router.post("/", Controller.postEmail);

router.delete("/:id", Controller.deleteEmail);

module.exports = router;

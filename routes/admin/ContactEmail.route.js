const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../../middleware/Auth.middleware");

const Controller = require("../../controller/ContactEmail.controller");

router.get("/", isLoggedIn, Controller.viewEmail);

router.get("/add", isLoggedIn, Controller.addEmailForm);

router.post("/", isLoggedIn, Controller.postEmail);

router.delete("/:id", isLoggedIn, Controller.deleteEmail);

module.exports = router;

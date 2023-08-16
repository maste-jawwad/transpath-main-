const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../../middleware/Auth.middleware");

const Controller = require("../../controller/GridHomePage.controller");

router.get("/", isLoggedIn, Controller.getGridHome);

// router.get("/add", isLoggedIn, Controller.addGridForm);

// router.post("/", isLoggedIn, Controller.postGrid);

router.get("/:id", isLoggedIn, Controller.getSingleGrid);
router.post("/:id", isLoggedIn, Controller.editGrid);

router.delete("/:id", isLoggedIn, Controller.deleteGrid);

module.exports = router;

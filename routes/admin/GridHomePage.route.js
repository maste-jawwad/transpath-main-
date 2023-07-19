const express = require("express");
const router = express.Router();

const Controller = require("../../controller/GridHomePage.controller");

router.get("/", Controller.getGridHome);

router.get("/add", Controller.addGridForm);

router.post("/", Controller.postGrid);

router.delete("/:id", Controller.deleteGrid);

module.exports = router;

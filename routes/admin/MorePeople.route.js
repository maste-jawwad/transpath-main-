const express = require("express");
const Controller = require("../../controller/MorePeople.controller");

const router = express.Router();

router.get("/", Controller.view);
router.get("/add", Controller.add);
router.post("/", Controller.post);
router.delete("/:id", Controller.remove);

module.exports = router;

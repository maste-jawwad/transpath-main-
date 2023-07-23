const express = require("express");
const router = express.Router();

const Controller = require("../../controller/Publication.controller");

router.get("/", Controller.view);
router.get("/add", Controller.add);
router.post("/", Controller.post);
router.delete("/:id", Controller.remove);

module.exports = router;

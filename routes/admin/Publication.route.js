const express = require("express");
const router = express.Router();

const Controller = require("../../controller/Publication.controller");
const { isLoggedIn } = require("../../middleware/Auth.middleware");

router.get("/", isLoggedIn, Controller.view);
router.get("/add", isLoggedIn, Controller.add);
router.post("/", isLoggedIn, Controller.post);
router.delete("/:id", isLoggedIn, Controller.remove);

module.exports = router;

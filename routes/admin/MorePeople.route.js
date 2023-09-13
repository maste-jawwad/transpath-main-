const express = require("express");
const Controller = require("../../controller/MorePeople.controller");

const { isLoggedIn } = require("../../middleware/Auth.middleware");

const router = express.Router();

router.get("/:something", isLoggedIn, (req, res) => {
	res.redirect("/admin/people");
});
// router.get("/", isLoggedIn, Controller.view);
router.get("/", isLoggedIn, (req, res) => {
	res.redirect("/admin/people");
});
router.get("/add", isLoggedIn, Controller.add);
router.post("/", isLoggedIn, Controller.post);
router.delete("/:id", isLoggedIn, Controller.remove);

module.exports = router;

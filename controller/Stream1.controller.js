const fs = require("fs");

const Schema = require("../model/Stream1.model");

const view = async (req, res) => {
	try {
		const updates = await Schema.find({});
		res.render("admin/Stream1/index", {
			updates,
		});
	} catch (error) {
		req.flash("error", error.message);
		res.redirect("/admin");
	}
};

const add = (req, res) => {
	res.render("admin/Stream1/add");
};

const post = async (req, res) => {
	try {
		const { link, basin, isBlob } = req.body;
		const photo = req.file ? req.file.filename : "";

		const newUpdate = await new Schema({
			link,
			basin,
			isBlob: isBlob == "on" ? true : false,
			photo,
		});

		await newUpdate.save();

		if (!newUpdate) {
			req.flash("error", "Cannot add the Update");
			return res.redirect("/admin/stream1/add");
		}
		res.redirect("/admin/stream1");
	} catch (error) {
		req.flash("error", error.message);
		res.redirect("/admin");
	}
};

const remove = async (req, res) => {
	try {
		const id = req.params.id;
		const instance = await Schema.findById(id);
		const img = `uploads/Stream1/${instance.photo}`;

		if (fs.existsSync(img)) fs.unlinkSync(img);
		await Schema.findByIdAndDelete(id);
		res.redirect("/admin/stream1");
	} catch (error) {
		req.flash("error", error.message);
		res.redirect("/admin");
	}
};

module.exports = {
	view,
	add,
	post,
	remove,
};

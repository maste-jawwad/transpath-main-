const fs = require("fs");

const Schema = require("../model/Update.model");

const view = async (req, res) => {
	try {
		const updates = await Schema.find({});
		// console.log(updates);
		res.render("admin/Update/index", {
			updates,
		});
	} catch (error) {
		console.log(error);
		req.flash("error", error.message);
		res.redirect("/admin");
	}
};

const add = (req, res) => {
	res.render("admin/Update/add.ejs");
};

const post = async (req, res) => {
	try {
		const { title, category, date, basin, link, description, div_id } =
			req.body;
		console.log(req.body);
		let people = [];
		if (req.body["people[][name]"] instanceof Array) {
			let size = req.body["people[][name]"].length;
			for (let i = 0; i < size; i++) {
				const instance = {
					name: req.body["people[][name]"][i],
					designation: req.body["people[][designation]"][i],
					department: req.body["people[][department]"][i],
					institute: req.body["people[][institute]"][i],
				};
				console.log(instance);
				people.push(instance);
			}
		} else {
			// console.log(req.body["people[][name]"]);
			people.push({
				name: req.body["people[][institute]"],
				designation: req.body["people[][designation]"],
				department: req.body["people[][department]"],
				institute: req.body["people[][institute]"],
			});
		}
		console.log(people);
		// console.log(req.files);
		const download = req.files.download[0].filename;
		const photos = [];
		req.files.photos.forEach((file, i) => {
			photos.push(file.filename);
		});
		// console.log(download);
		const newUpdate = new Schema({
			title,
			category,
			date,
			basin,
			link,
			description,
			people,
			download,
			photos,
			div_id,
		});
		console.log(newUpdate);
		await newUpdate.save();
		if (!newUpdate) {
			req.flash("error", "Unable to create the update");
			return res.redirect("/admin/update/add");
		}

		res.redirect("/admin/update/");
		// res.send(req.files);
	} catch (error) {
		console.log(error);
		req.flash("error", error.message);
		res.redirect("/admin/update/add");
	}
};

const remove = async (req, res) => {
	try {
		const id = req.params.id;
		const update = await Schema.findById(id);
		if (!update) {
			req.flash("error", `unable to find the update with id: ${id}`);
			return res.redirect("/admin/update");
		}
		await Schema.findByIdAndDelete(id);
		const foldername = update.title.replace(/\s/g, "").toLowerCase();
		fs.rmdirSync(`./uploads/Update/${foldername}`, {
			recursive: true,
			force: true,
		});
		res.redirect("/admin/update");
	} catch (error) {
		console.log(error);
		req.flash("error", error.message);
		res.redirect("/admin/update");
	}
};

module.exports = {
	view,
	add,
	post,
	remove,
};

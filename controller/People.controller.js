const fs = require("fs");
const Schema = require("../model/People.model");

const view = async (req, res) => {
	try {
		const people = await Schema.find({});
		res.render("admin/People/index", {
			people,
		});
	} catch (error) {
		res.send(error);
	}
};

const add = async (req, res) => {
	res.render("admin/People/add");
};

const post = async (req, res) => {
	try {
		const {
			name,
			designation,
			department,
			institute,
			description,
			linkedin,
			twitter,
			type,
		} = req.body;

		const photo = req.file ? req.file.filename : null;

		const newPerson = await new Schema({
			name,
			designation,
			department,
			institute,
			description,
			linkedin,
			twitter,
			photo,
			type,
		});

		await newPerson.save();

		if (!newPerson) {
			req.flash("error", "Cannot add person");
			return res.redirect("/admin/people/add");
		}

		res.redirect("/admin/people");
	} catch (error) {
		res.send(error);
	}
};

const remove = async (req, res) => {
	try {
		const id = req.params.id;
		const instance = await Schema.findById(id);

		const img = `uploads/People/${instance.photo}`;

		if (fs.existsSync(img)) fs.unlinkSync(img);

		await Schema.findByIdAndDelete(id);

		res.redirect("/admin/people");
	} catch (error) {
		res.send(error);
	}
};

module.exports = {
	view,
	add,
	post,
	remove,
};

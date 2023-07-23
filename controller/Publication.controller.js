const Schema = require("../model/Publication.model");

const view = async (req, res) => {
	try {
		const publications = await Schema.find({});
		res.render("admin/Publication/index", {
			publications,
		});
	} catch (error) {
		console.log(error);
		res.send(error);
	}
};

const add = (req, res) => {
	res.render("admin/Publication/add");
};

const post = async (req, res) => {
	try {
		const { title, subtitle, date, author, type, link, description } =
			req.body;

		console.log(req.body);
		if (!title || !subtitle || !date || !author) {
			req.flash("error", "incomplete fields");
			return res.redirect("/admin/publication/add");
		}
		const newPublication = new Schema({
			title,
			subtitle,
			date,
			author,
			type,
			link,
			description,
		});

		await newPublication.save();
		if (!newPublication) {
			req.flash("error", "Some problem occurred");
			return res.redirect("/admin/publication/add");
		}
		res.redirect("/admin/publication");
	} catch (error) {
		console.log(error);
		res.send(error);
	}
};

const remove = async (req, res) => {
	try {
		const id = req.params.id;
		const publication = await Schema.findByIdAndDelete(id);
		if (!publication) {
			req.flash("error", "Unable to find the id");
		}
		res.redirect("/admin/publication");
	} catch (error) {
		console.log(error);
		res.send(error);
	}
};

module.exports = {
	view,
	add,
	post,
	remove,
};

const Schema = require("../model/MorePeople.model");

const view = async (req, res) => {
	try {
		const people = await Schema.find({});
		res.render("admin/MorePeople/index", { people });
	} catch (error) {
		console.log(error);
		res.send(error);
	}
};

const add = (req, res) => {
	res.render("admin/MorePeople/add");
};

const post = async (req, res) => {
	try {
		const { name, designation, department, institute } = req.body;
		const newPerson = new Schema({
			name,
			designation,
			department,
			institute,
		});

		newPerson.save();

		if (!newPerson) {
			req.flash("error", "Cannot add the person");
			return res.redirect("/admin/phds/add");
		}

		res.redirect("/admin/phds");
	} catch (error) {
		console.log(error);
		res.send(error);
	}
};

const remove = async (req, res) => {
	try {
		const id = req.params.id;
		const instance = await Schema.findByIdAndDelete(id);
		res.redirect("/admin/phds");
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

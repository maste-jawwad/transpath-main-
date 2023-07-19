const Email = require("../model/ContactEmail.model");

const viewEmail = async (req, res) => {
	try {
		const emails = await Email.find({});
		const email = emails[0];
		res.render("admin/ContactEmail/index", {
			email,
		});
	} catch (err) {
		console.log(err);
		res.send(err);
	}
};

const addEmailForm = async (req, res) => {
	res.send("Email Form");
};

const postEmail = async (req, res) => {
	try {
		const { email } = req.body;
		if (!email || email.length == 0) {
			res.send({ message: "Incomplete fields" });
		}
		const newEmail = new Email({ email });
		await newEmail.save();
		res.redirect("/admin/contactemail");
	} catch (error) {
		res.send(error);
	}
};

const deleteEmail = async (req, res) => {
	try {
		const emailId = req.params.id;
		const deletedEmail = await Email.findByIdAndDelete(emailId);
		if (deletedEmail) {
			res.redirect("/admin/contactemail");
		} else {
			res.send({ message: "Unable to find ID" });
		}
	} catch (err) {
		console.log(err);
		res.send(err);
	}
};

module.exports = {
	viewEmail,
	addEmailForm,
	postEmail,
	deleteEmail,
};

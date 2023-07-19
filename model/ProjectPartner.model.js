const mongoose = require("mongoose");

const projectPartner = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	photo: {
		type: String,
		required: true,
	},
	link: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("projectPartner", projectPartner);

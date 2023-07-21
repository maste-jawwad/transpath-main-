const mongoose = require("mongoose");

const PeopleSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	designation: {
		type: String,
		required: true,
	},
	department: {
		type: String,
		required: true,
	},
	institute: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	linkedin: {
		type: String,
		default: "",
	},
	twitter: {
		type: String,
		default: "",
	},
	photo: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("People", PeopleSchema);

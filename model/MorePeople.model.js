const mongoose = require("mongoose");

const MorePeopleSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("MorePeople", MorePeopleSchema);

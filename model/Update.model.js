const mongoose = require("mongoose");

const PeopleSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	designation: String,
	department: String,
	institute: String,
});

const UpdateSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	basin: {
		type: String,
	},
	link: {
		type: String,
	},
	download: {
		type: String,
	},
	photos: [
		{
			type: String,
		},
	],
	description: {
		type: String,
	},
	people: [PeopleSchema],
});

module.exports = mongoose.model("Update", UpdateSchema);

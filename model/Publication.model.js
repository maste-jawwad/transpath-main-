const mongoose = require("mongoose");

const PublicationSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	subtitle: {
		type: String,
		required: true,
		default: "",
	},
	date: {
		type: Date,
		default: Date.now,
	},
	author: {
		type: String,
		required: true,
	},
	type: {
		type: String,
	},
	description: {
		type: String,
	},
	link: {
		type: String,
	},
});

module.exports = mongoose.model("Publication", PublicationSchema);

const mongoose = require("mongoose");

const gridHomePageSchema = new mongoose.Schema({
	link: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	gridItem1: {
		type: String,
		required: true,
	},
	gridItem2: {
		type: String,
		required: true,
	},
	gridItem3: {
		type: String,
		required: true,
	},
	gridItem4: {
		type: String,
		required: true,
	},
	gridItem5: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("gridHomePage", gridHomePageSchema);

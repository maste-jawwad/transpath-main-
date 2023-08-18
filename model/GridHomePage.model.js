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
	gridId: {
		type: Number,
		default: 100,
	},
});

module.exports = mongoose.model("gridHomePage", gridHomePageSchema);

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
        maxLength: 1000 // Allow for very long titles
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
        maxLength: 1000 // Allow for detailed basin information
	},
	link: {
		type: String,
        maxLength: 2000 // Allow for long URLs
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
        maxLength: 100000 // Allow for very long descriptions
	},
	people: [PeopleSchema],
	div_id: {
		type: String,
	},
	citation: {
		type: String,
		default: "",
	},
});

// Index for faster sorting/filtering by date
UpdateSchema.index({ date: -1 });

module.exports = mongoose.model("Update", UpdateSchema);

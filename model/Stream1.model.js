const mongoose = require("mongoose");

const Stream1Schema = new mongoose.Schema({
	photo: {
		type: String,
		required: true,
		default: "",
	},
	link: {
		type: String,
		required: true,
		default: "#",
	},
	basin: {
		type: String,
		required: true,
		default: "Brahmaputra River Basin",
	},
	isBlob: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model("Stream1", Stream1Schema);

const bcrypt = require("bcryptjs");

const User = require("./model/User.model");
const ContactEmail = require("./model/ContactEmail.model");
const GridHomePage = require("./model/GridHomePage.model");
const MorePeople = require("./model/MorePeople.model");
const People = require("./model/People.model");
const ProjectPartner = require("./model/ProjectPartner.model");
const Publication = require("./model/Publication.model");
const Update = require("./model/Update.model");

const createAdmin = () => {
	const newUser = new User({
		username: "admin",
		password: "admin123",
	});
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			if (err) throw err;
			newUser.password = hash;
			newUser
				.save()
				.then((user) => console.log(user))
				.catch((err) => console.log(err));
		});
	});
};

const deleteUser = async () => {
	await User.deleteMany({}, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log("All users deleted");
		}
	});
};

const clearDB = async () => {
	try {
		await ContactEmail.deleteMany({});
		await GridHomePage.deleteMany({});
		await MorePeople.deleteMany({});
		await People.deleteMany({});
		await ProjectPartner.deleteMany({});
		await Publication.deleteMany({});
		await Update.deleteMany({});

		console.log("Database Cleared");
	} catch (error) {
		console.log(error);
	}
};

const createGridItems = async () => {
	try {
		for (let i = 0; i < 3; i++) {
			const grid = new GridHomePage({
				link: "https://google.com",
				description: `Grid #${i}`,
				gridItem1: `Grid #${i} Item 1`,
				gridItem2: `Grid #${i} Item 2`,
				gridItem3: `Grid #${i} Item 3`,
				gridItem4: `Grid #${i} Item 4`,
				gridItem5: `Grid #${i} Item 5`,
				gridId: i,
			});

			await grid.save();

			console.log(`grid item created ${grid}`);
		}
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	createAdmin,
	deleteUser,
	clearDB,
	createGridItems,
};

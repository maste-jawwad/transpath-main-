const bcrypt = require("bcryptjs");

const User = require("./model/User.model");

const createAdmin = () => {
	const newUser = new User({
		username: "Admin",
		password: "Admin123",
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

const deleteUser = () => {
	User.deleteMany({}, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log("All users deleted");
		}
	});
};

module.exports = {
	createAdmin,
	deleteUser,
};

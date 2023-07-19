const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require("../model/User.model");

const passportSetup = (passport) => {
	passport.use(
		new LocalStrategy(
			{ usernameField: "username" },
			(username, password, done) => {
				User.findOne({
					username,
				}).then((user) => {
					if (!user) {
						return done(null, false, {
							message: "Unable to find user",
						});
					}

					bcrypt.compare(password, user.password, (err, isMatch) => {
						if (err) throw err;
						if (isMatch) return done(null, user);
						else
							done(null, false, {
								message: "Password Incorrect",
							});
					});
				});
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id)
			.then((user) => {
				done(null, user);
			})
			.catch((err) => {
				done(err, null);
			});
	});
};

module.exports = passportSetup;

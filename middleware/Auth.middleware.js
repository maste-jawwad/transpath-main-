const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect("/login");
	}
};

const forwardAuthenticated = (req, res, next) => {
	if (!req.isAuthenticated()) return next();
	res.redirect("/admin");
};

module.exports = {
	isLoggedIn,
	forwardAuthenticated,
};

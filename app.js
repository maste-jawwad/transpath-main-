const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const mongoSanitize = require("express-mongo-sanitize");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const helmet = require("helmet");

const passportConfig = require("./config/Passport.config");

const GridHomePageRoutes = require("./routes/admin/GridHomePage.route");
const ContactEmailRoutes = require("./routes/admin/ContactEmail.route");
const ProjectPartnerRoutes = require("./routes/admin/ProjectPartner.routes");
const PeopleRoutes = require("./routes/admin/People.route");
const MorePoepleRoutes = require("./routes/admin/MorePeople.route");

const {
	isLoggedIn,
	forwardAuthenticated,
} = require("./middleware/Auth.middleware");
const { createAdmin, deleteUser } = require("./helper");

const app = express();

mongoose
	.connect("mongodb://localhost:27017/brwd")
	.then(() => {
		console.log("Database Connected");
	})
	.catch((err) => console.log(err.message));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(
	express.urlencoded({
		limit: "50mb",
		extended: true,
		parameterLimit: 50000,
	})
);

app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(mongoSanitize());
app.use(
	session({
		secret: "Some Secret Stuff",
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 180 * 60 * 10000,
		},
	})
);

// Passport
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.session = req.session;
	next();
});
app.use(flash());
app.use(
	helmet({
		contentSecurityPolicy: false,
	})
);
app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.info = req.flash("info");
	next();
});

app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/static`));
app.use("/static", express.static(`${__dirname}/static`));
app.use("/uploads", express.static(__dirname + "/uploads"));

passportConfig(passport);

app.get("/", async (req, res) => {
	res.send("Home");
});

app.get("/about", async (req, res) => {
	res.send("About");
});

app.get("/stream-1", async (req, res) => {
	res.send("Coming Soon");
});

app.get("/stream-2", async (req, res) => {
	res.send("stream2");
});

app.get("/publication", async (req, res) => {
	res.send("/publication");
});

app.get("/output", async (req, res) => {
	res.send("/output");
});

app.get("/login", forwardAuthenticated, (req, res) => {
	res.render("login");
});

app.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/admin",
		failureRedirect: "/login",
	})
);

app.get("/logout", isLoggedIn, (req, res) => {
	req.logout((err) => {
		if (err) {
			console.log(err);
		} else {
			req.flash("success_msg", "Logged IN");
			res.redirect("/");
		}
	});
});

app.get("/createAdmin", (req, res) => {
	createAdmin();
	res.redirect("/");
});

app.get("/deleteUser", (req, res) => {
	deleteUser();
	res.redirect("/");
});

app.get("/admin", isLoggedIn, (req, res) => {
	res.render("admin/index");
});

app.use("/admin/homegrid", GridHomePageRoutes);
app.use("/admin/contactemail", ContactEmailRoutes);
app.use("/admin/projectpartner", ProjectPartnerRoutes);
app.use("/admin/people", PeopleRoutes);
app.use("/admin/morepeople", MorePoepleRoutes);

app.listen(3000, () => {
	console.log(`Server started on http://localhost:3000/`);
});

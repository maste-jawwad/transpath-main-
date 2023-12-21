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
const dotenv = require("dotenv");

dotenv.config();

const passportConfig = require("./config/Passport.config");

const ContactEmail = require("./model/ContactEmail.model");
const GridHomePage = require("./model/GridHomePage.model");
const MorePeople = require("./model/MorePeople.model");
const People = require("./model/People.model");
const ProjectPartner = require("./model/ProjectPartner.model");
const Publication = require("./model/Publication.model");
const Update = require("./model/Update.model");
const Stream1 = require("./model/Stream1.model");

const GridHomePageRoutes = require("./routes/admin/GridHomePage.route");
const ContactEmailRoutes = require("./routes/admin/ContactEmail.route");
const ProjectPartnerRoutes = require("./routes/admin/ProjectPartner.routes");
const PeopleRoutes = require("./routes/admin/People.route");
const MorePoepleRoutes = require("./routes/admin/MorePeople.route");
const PublicationRoutes = require("./routes/admin/Publication.route");
const UpdateRoutes = require("./routes/admin/Update.route");
const Stream1Routes = require("./routes/admin/Stream1.route");

const {
	isLoggedIn,
	forwardAuthenticated,
} = require("./middleware/Auth.middleware");

const {
	createAdmin,
	deleteUser,
	clearDB,
	createGridItems,
} = require("./helper");

const app = express();

mongoose
	.connect(process.env.MONGO_URI || "mongodb://localhost:27017/brwd")
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
app.use("/", express.static(`${__dirname}/public`));
app.use("/static", express.static(`${__dirname}/static`));
app.use("/uploads", express.static(__dirname + "/uploads"));

passportConfig(passport);

// clearDB();
// createGridItems();

app.get("/", async (req, res) => {
	try {
		const email = await ContactEmail.find({});
		const grids = await GridHomePage.find({});
		const partners = await ProjectPartner.find({});

		res.render("main/index", {
			email: email[0],
			grids: grids.sort((a, b) => a.gridId - b.gridId),
			partners,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.get("/about", async (req, res) => {
	try {
		const people = await People.find({});
		const morePeople = await MorePeople.find({});
		const email = await ContactEmail.find({});

		people.sort((a, b) => {
			var textA = a.name.toUpperCase();
			var textB = b.name.toUpperCase();
			return textA < textB ? -1 : textA > textB ? 1 : 0;
		});

		morePeople.sort((a, b) => {
			var textA = a.name.toUpperCase();
			var textB = b.name.toUpperCase();
			return textA < textB ? -1 : textA > textB ? 1 : 0;
		});
		res.render("main/about", {
			people,
			morePeople,
			email: email[0],
		});
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.get("/stream-1", async (req, res) => {
	try {
		const email = await ContactEmail.find({});
		const people = await People.find({
			type: {
				$in: ["brah", "nile", "gezi", "meko", "yala", "xoch", "wadd"],
			},
		});
		const stream1 = await Stream1.find({});
		res.render("main/stream-1", {
			email: email[0],
			people,
			updates: stream1,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.get("/stream-2", async (req, res) => {
	try {
		const updates = await Update.find({});
		const email = await ContactEmail.find({});
		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		res.render("main/stream-2", {
			updates,
			email: email[0],
			months,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.get("/publication", async (req, res) => {
	try {
		const publications = await Publication.find({});
		const email = await ContactEmail.find({});
		res.render("main/publication", {
			publications,
			email: email[0],
		});
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.get("/output", async (req, res) => {
	try {
		const email = await ContactEmail.find({});
		const updates = await Update.find({});
		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		res.render("main/output", {
			updates,
			email: email[0],
			months,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.get("/blogs/:id", async (req, res) => {
	try {
		const blog = await Update.findById(req.params.id);
		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		if (blog.category != "Blog") {
			return res.send("<h1>404 error, Not found</h1>");
		}
		res.render("main/blog", {
			update: blog,
			months,
		});
	} catch (error) {}
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
app.use("/admin/phds", MorePoepleRoutes);
app.use("/admin/publication", PublicationRoutes);
app.use("/admin/update", UpdateRoutes);
app.use("/admin/stream1", Stream1Routes);

app.listen(process.env.PORT || 3000, () => {
	console.log(
		`Server started on http://localhost:${process.env.PORT || 3000}/`
	);
});

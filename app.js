const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const mongoSanitize = require("express-mongo-sanitize");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const helmet = require("helmet");
const compression = require("compression");
const dotenv = require("dotenv");
const cache = require("memory-cache");

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

// MongoDB connection options
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4, skip trying IPv6
    maxPoolSize: 10,
    connectTimeoutMS: 10000,
    retryWrites: true
};

// Connect to MongoDB with retry logic
const connectWithRetry = () => {
    console.log('MongoDB connection attempt...');
    return mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/brwd", mongoOptions)
        .then(() => {
            console.log('MongoDB is connected');
        })
        .catch(err => {
            console.error('MongoDB connection error:', err);
            console.log('Retrying in 5 seconds...');
            setTimeout(connectWithRetry, 5000);
        });
};

connectWithRetry();

// Configure CORS
app.use(cors({
    origin: true,
    credentials: true
}));

// Configure body parsers
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ 
    extended: true,
    limit: '50mb',
    parameterLimit: 50000 
}));

app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(mongoSanitize());
// Enable HTTP compression for faster transfers
app.use(compression({ level: 6 }));
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
	res.locals.sanitizeTitle = require('./utils/sanitize').sanitizeTitle;
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

// Static asset caching and delivery
const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
const setLongCache = (res, path) => {
	res.setHeader("Cache-Control", "public, max-age=" + Math.floor(thirtyDaysMs / 1000) + ", immutable");
};
const setMediumCache = (res, path) => {
	res.setHeader("Cache-Control", "public, max-age=" + Math.floor(sevenDaysMs / 1000));
};
// Add a short cache on uploads responses (including 404) to reduce repeat hits
app.use('/uploads', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=600');
    next();
});
app.use(express.static(`${__dirname}/public`, { etag: true, maxAge: thirtyDaysMs, setHeaders: setLongCache }));
app.use(express.static(`${__dirname}/static`, { etag: true, maxAge: thirtyDaysMs, setHeaders: setLongCache }));
app.use("/", express.static(`${__dirname}/public`, { etag: true, maxAge: thirtyDaysMs, setHeaders: setLongCache }));
app.use("/static", express.static(`${__dirname}/static`, { etag: true, maxAge: thirtyDaysMs, setHeaders: setLongCache }));
app.use("/uploads", express.static(__dirname + "/uploads", { etag: true, maxAge: sevenDaysMs, setHeaders: setMediumCache }));

passportConfig(passport);

// clearDB();
// createGridItems();

// Simple in-memory page cache middleware
const pageCache = (durationSeconds) => (req, res, next) => {
    if (req.method !== 'GET') return next();
    const key = '__express__' + (req.originalUrl || req.url);
    const cached = cache.get(key);
    if (cached) {
        res.setHeader('X-Cache', 'HIT');
        return res.send(cached);
    } else {
        res.setHeader('X-Cache', 'MISS');
        const sendResponse = res.send.bind(res);
        res.send = (body) => {
            try { cache.put(key, body, durationSeconds * 1000); } catch (_) { }
            return sendResponse(body);
        };
        return next();
    }
};

app.get("/", pageCache(120), async (req, res) => {
	try {
        const email = await ContactEmail.find({}).lean();
        const grids = await GridHomePage.find({}).lean();
        const partners = await ProjectPartner.find({}).lean();

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

// Helper function to detect ALL basin names from description
function detectBasinsFromDescription(description) {
	if (!description) return [];
	
	const basinKeywords = {
		'nile': ['nile', 'nile river', 'nile basin'],
		'brah': ['brahmaputra', 'brahmaputra river', 'brahmaputra basin'],
		'gezi': ['gezira', 'gezira irrigation'],
		'meko': ['mekong', 'mekong delta', 'mekong basin'],
		'yala': ['yala', 'kingwal', 'yala and kingwal', 'yala & kingwal'],
		'xoch': ['xochimilco', 'xochimilco wetland'],
		'wadd': ['wadd', 'wadden', 'wadden sea']
	};
	
	const descLower = description.toLowerCase();
	const detectedBasins = [];
	
	for (const [basinCode, keywords] of Object.entries(basinKeywords)) {
		for (const keyword of keywords) {
			if (descLower.includes(keyword)) {
				if (!detectedBasins.includes(basinCode)) {
					detectedBasins.push(basinCode);
				}
				break; // Found this basin, move to next basin
			}
		}
	}
	
	return detectedBasins;
}

// Helper function to check if a type is a basin code
function isBasinType(type) {
	if (!type) return false;
	const basinTypes = ['nile', 'brah', 'gezi', 'meko', 'yala', 'xoch', 'wadd'];
	return basinTypes.includes(type.toLowerCase());
}

// Helper function to get all basins for a person (Type priority over description)
function getPersonBasins(person) {
	const type = person.type ? person.type.toLowerCase() : '';
	
	// If type is a basin, return only that basin
	if (isBasinType(type)) {
		return [type];
	}
	
	// If type is 'core' or other, check description for basins
	return detectBasinsFromDescription(person.description);
}

app.get("/about", pageCache(300), async (req, res) => {
	try {
        const people = await People.find({}).lean();
        const morePeople = await MorePeople.find({}).lean();
        const email = await ContactEmail.find({}).lean();

		// Filter people for About page: Core Team OR people with basin descriptions (but not if type is already a basin)
		const aboutPeople = people.filter(person => {
			// Show if type is 'core' (Core Team)
			if (person.type === 'core') return true;
			
			// Don't show if type is already a basin (they should only appear in Stream 1)
			if (isBasinType(person.type)) return false;
			
			// Show if description contains basin names (for non-basin types with basin descriptions)
			const detectedBasins = getPersonBasins(person);
			return detectedBasins.length > 0;
		});

		aboutPeople.sort((a, b) => {
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
			people: aboutPeople,
			morePeople,
			email: email[0],
		});
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.get("/stream-1", pageCache(180), async (req, res) => {
	try {
        const email = await ContactEmail.find({}).lean();
        const allPeople = await People.find({}).lean();
        
        // Filter people for Stream 1 page based on Type or description containing basin names
        const stream1People = allPeople.filter(person => {
			// Check if person has any basins (from type or description)
			const detectedBasins = getPersonBasins(person);
			return detectedBasins.length > 0;
		});
        
		const stream1 = await Stream1.find({}).lean();
		res.render("main/stream-1", {
			email: email[0],
			people: stream1People,
			updates: stream1,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.get("/stream-2", pageCache(120), async (req, res) => {
	try {
        const updatesDocs = await Update.find({}).sort({ date: -1 }).lean();
        const email = await ContactEmail.find({}).lean();
        // Attach slugs for both new and legacy folder strategies
        const { sanitizeTitle } = require("./utils/sanitize");
        const updates = updatesDocs.map(u => ({
            ...u,
            slug: sanitizeTitle(u.title),
            legacySlug: (u.title || '').toString().trim().toLowerCase().replace(/\s/g, '')
        }));
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

app.get("/publication", pageCache(600), async (req, res) => {
	try {
        const publications = await Publication.find({}).lean();
        const email = await ContactEmail.find({}).lean();
		res.render("main/publication", {
			publications,
			email: email[0],
		});
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.get("/output", pageCache(180), async (req, res) => {
    try {
        const email = await ContactEmail.find({}).lean();
        const updatesDocs = await Update.find({}).sort({ date: -1 }).lean();
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
        // Provide slug and legacySlug for media paths
        const { sanitizeTitle } = require("./utils/sanitize");
        const updates = updatesDocs.map(u => ({
            ...u,
            slug: sanitizeTitle(u.title),
            legacySlug: (u.title || '').toString().trim().toLowerCase().replace(/\s/g, '')
        }));

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

app.get("/blogs/:id", pageCache(300), async (req, res) => {
	try {
        const blog = await Update.findById(req.params.id).lean();
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
			return res.redirect("/output");
		}
		// Generate alternative slugs for fallback
		const sanitizeTitle = require("./utils/sanitize").sanitizeTitle;
		const alternativeSlugs = {
			current: sanitizeTitle(blog.title),
			legacy: (blog.title || '').toString().trim().toLowerCase().replace(/\s/g, ''),
			urlDecoded: decodeURIComponent((blog.title || '').toString().trim().toLowerCase().replace(/\s/g, '')),
			alphanumeric: (blog.title || '').toString().trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '')
		};
		
		return res.render("main/blogs", {
			update: blog,
			months,
			alternativeSlugs,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            error: 'File upload error: ' + err.message
        });
    }
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log(
        `Server started on http://localhost:${process.env.PORT || 3000}/`
    );
});

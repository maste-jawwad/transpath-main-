const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

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

app.use(morgan("dev"));

app.set("view engine", "ejs");

app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/static`));
app.use("/static", express.static(`${__dirname}/static`));
app.use("/uploads", express.static(__dirname + "/uploads"));

app.get("/", async (req, res) => {
	res.send("Hello");
});

app.listen(3000, () => {
	console.log(`Server started on http://localhost:3000/`);
});

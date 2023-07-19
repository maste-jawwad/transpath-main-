const Grid = require("../model/GridHomePage.model");

const getGridHome = async (req, res) => {
	try {
		const grid = await Grid.find({});
		console.log(grid);
		return res.render("admin/GridHome/index", { grid });
	} catch (error) {
		console.log(error.message);
		return res.send(error);
	}
};

const addGridForm = async (req, res) => {
	try {
		const grid = await Grid.find({});
		return res.render("admin/GridHome/add", { grid });
	} catch (error) {
		console.log(error.message);
		return res.send(error);
	}
};

const postGrid = async (req, res) => {
	try {
		const {
			link,
			description,
			gridItem1,
			gridItem2,
			gridItem3,
			gridItem4,
			gridItem5,
		} = req.body;

		if (
			!link ||
			!gridItem1 ||
			!gridItem2 ||
			!gridItem3 ||
			!gridItem4 ||
			!gridItem5
		) {
			return res.send({ message: "Incomplete Fields" });
		}
		const newGrid = new Grid({
			link,
			description,
			gridItem1,
			gridItem2,
			gridItem3,
			gridItem4,
			gridItem5,
		});

		await newGrid.save();

		return res.redirect("/admin/homegrid");
	} catch (error) {
		console.log(error.message);
		return res.send(error);
	}
};

const deleteGrid = async (req, res) => {
	try {
		const gridId = req.params.id;
		const deletedGrid = await Grid.findByIdAndDelete(gridId);
		if (deletedGrid) {
			// res.send({ message: "success" });
			res.redirect("/admin/homegrid");
		} else {
			res.send({ message: "Failed, ID not found" });
		}
	} catch (error) {
		console.log(error.message);
		return res.send(error);
	}
};

module.exports = {
	getGridHome,
	addGridForm,
	postGrid,
	deleteGrid,
};

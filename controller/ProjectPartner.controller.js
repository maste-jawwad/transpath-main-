const mongoose = require('mongoose');
const ProjectPartner = require("../model/ProjectPartner.model");

let gfs;
mongoose.connection.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
    });
});

const viewProjectPartner = async (req, res) => {
    try {
        const projectPartners = await ProjectPartner.find({});
        res.render("admin/ProjectPartner/index", {
            projectPartners,
        });
    } catch (error) {
        res.send(error);
    }
};

const addProjectPartnerForm = async (req, res) => {
	res.render("admin/ProjectPartner/add");
};

const postProjectPartner = async (req, res) => {
    try {
        const { name, link } = req.body;
        const photo = req.file ? req.file.filename : null;
        
        const newProjectPartner = await new ProjectPartner({
            name,
            photo,
            link,
        });
        await newProjectPartner.save();
        
        if (!newProjectPartner) {
            req.flash("error", "Cannot add partner");
            return res.redirect("/admin/projectpartner/add");
        }
        res.redirect("/admin/projectpartner");
    } catch (error) {
        res.send(error);
    }
};

const deleteProjectPartner = async (req, res) => {
	try {
		const id = req.params.id;
		const projectPartner = await ProjectPartner.findById(id);
		const imgPath = `uploads/Project_Partners/${projectPartner.photo}`;

		if (fs.existsSync(imgPath)) {
			fs.unlinkSync(imgPath);
		}

		await ProjectPartner.findByIdAndDelete(id);

		res.redirect("/admin/projectpartner");
	} catch (error) {}
};

module.exports = {
	viewProjectPartner,
	addProjectPartnerForm,
	postProjectPartner,
	deleteProjectPartner,
};

const Schema = require("../model/Update.model");

const view = async (req, res) => {
    try {
        const updates = await Schema.find({});
        res.render("admin/Update/index", { updates });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/admin");
    }
};

const add = (req, res) => {
    res.render("admin/Update/add.ejs");
};

const post = async (req, res) => {
    try {
        const { title, category, date, basin, link, description, div_id, citation } = req.body;
        
        // Handle people data
        let people = [];
        if (req.body["people[][name]"]) {
            if (Array.isArray(req.body["people[][name]"])) {
                let size = req.body["people[][name]"].length;
                for (let i = 0; i < size; i++) {
                    people.push({
                        name: req.body["people[][name]"][i],
                        designation: req.body["people[][designation]"]?.[i] || "",
                        department: req.body["people[][department]"]?.[i] || "",
                        institute: req.body["people[][institute]"]?.[i] || "",
                    });
                }
            } else {
                people.push({
                    name: req.body["people[][name]"],
                    designation: req.body["people[][designation]"] || "",
                    department: req.body["people[][department]"] || "",
                    institute: req.body["people[][institute]"] || "",
                });
            }
        }

        // Get filenames from multer
        const download = req.files?.download?.[0]?.filename || "";
        const photos = req.files?.photos ? req.files.photos.map(file => file.filename) : [];

        // Create new update
        const newUpdate = new Schema({
            title,
            category,
            date,
            basin,
            link,
            description,
            people,
            download,
            photos,
            div_id,
            citation
        });

        await newUpdate.save();
        if (!newUpdate) {
            req.flash("error", "Unable to create the update");
            return res.redirect("/admin/update/add");
        }

        res.redirect("/admin/update/");
    } catch (error) {
        console.error('Error in post:', error);
        req.flash("error", error.message);
        res.redirect("/admin/update/add");
    }
};

const updateCitation = async (req, res) => {
    try {
        const id = req.params.id;
        const { citation } = req.body;
        
        const update = await Schema.findByIdAndUpdate(
            id,
            { citation },
            { new: true }
        );

        if (!update) {
            return res.status(404).json({ error: 'Update not found' });
        }

        res.json({ message: 'Citation updated successfully', update });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePhotos = async (req, res) => {
    let session;
    try {
        if (!req.params.id) {
            throw new Error('Project ID is required');
        }

        session = await Schema.startSession();
        session.startTransaction();

        const id = req.params.id;
        const update = await Schema.findById(id).session(session);
        
        if (!update) {
            throw new Error('Post not found');
        }

        // Handle new images
        if (req.files && req.files.newImages) {
            const newPhotos = req.files.newImages.map(file => file.filename);
            update.photos = [...update.photos, ...newPhotos];
        }

        const savedUpdate = await update.save({ session });
        await session.commitTransaction();
        
        res.json({ 
            message: 'Photos updated successfully',
            update: {
                id: savedUpdate._id,
                title: savedUpdate.title,
                photos: savedUpdate.photos
            }
        });
    } catch (error) {
        console.error('Error in updatePhotos:', error);
        if (session) {
            await session.abortTransaction();
        }
        res.status(500).json({ error: error.message });
    } finally {
        if (session) {
            await session.endSession();
        }
    }
};

const remove = async (req, res) => {
    const session = await Schema.startSession();
    session.startTransaction();

    try {
        const id = req.params.id;
        const update = await Schema.findById(id).session(session);
        
        if (!update) {
            await session.abortTransaction();
            session.endSession();
            req.flash("error", `Unable to find the update with id: ${id}`);
            return res.redirect("/admin/update");
        }

        await Schema.findByIdAndDelete(id).session(session);
        await session.commitTransaction();
        session.endSession();
        res.redirect("/admin/update");
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        req.flash("error", error.message);
        res.redirect("/admin/update");
    }
};

module.exports = {
    view,
    add,
    post,
    remove,
    updateCitation,
    updatePhotos,
};
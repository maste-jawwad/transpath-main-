const fs = require("fs");
const path = require("path");
const Schema = require("../model/Update.model");
const { sanitizeTitle } = require("../utils/sanitize");

const view = async (req, res) => {
	try {
        const updates = await Schema.find({});
        // Attach slugs for both new and legacy folder strategies
        const updatesWithSlug = updates.map(u => ({
            ...u.toObject(),
            slug: sanitizeTitle(u.title),
            legacySlug: (u.title || '').toString().trim().toLowerCase().replace(/\s/g, '')
        }));
        res.render("admin/Update/index", {
            updates: updatesWithSlug,
        });
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
		const { title, category, date, basin, link, description, div_id, citation } =
			req.body;
		let people = [];
		if (req.body["people[][name]"] instanceof Array) {
			let size = req.body["people[][name]"].length;
			for (let i = 0; i < size; i++) {
				const instance = {
					name: req.body["people[][name]"][i],
					designation: req.body["people[][designation]"][i],
					department: req.body["people[][department]"][i],
					institute: req.body["people[][institute]"][i],
				};
				people.push(instance);
			}
		} else {
			people.push({
				name: req.body["people[][name]"],
				designation: req.body["people[][designation]"],
				department: req.body["people[][department]"],
				institute: req.body["people[][institute]"],
			});
		}
		const download = req.files.download[0].filename;
		const photos = [];
		// Handle photos array properly and ensure at least one photo
		if (!req.files.photos) {
			req.flash("error", "At least one photo is required");
			return res.redirect("/admin/update/add");
		}

		if (Array.isArray(req.files.photos)) {
			req.files.photos.forEach((file) => {
				photos.push(file.filename);
			});
		} else {
			// Single photo case
			photos.push(req.files.photos.filename);
		}
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
			citation,
		});
		await newUpdate.save();
		if (!newUpdate) {
			req.flash("error", "Unable to create the update");
			return res.redirect("/admin/update/add");
		}

		res.redirect("/admin/update/");
		// res.send(req.files);
	} catch (error) {
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

const updateFields = async (req, res) => {
    try {
        const id = req.params.id;
        const allowedFields = ['title', 'description', 'basin', 'category', 'date', 'link', 'div_id'];
        const updateData = {};

        // Load current document to compare title/slug
        const existing = await Schema.findById(id);
        if (!existing) {
            return res.status(404).json({ error: 'Update not found' });
        }

        const oldSlug = sanitizeTitle(existing.title);

        // Only include allowed fields that are present in the request
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        }

        // Handle people array separately if it exists
        if (req.body.people) {
            updateData.people = req.body.people;
        }

        // If title is changing, rename the folder to keep paths consistent
        if (updateData.title) {
            const newSlug = sanitizeTitle(updateData.title);
            if (newSlug !== oldSlug) {
                const basePath = path.join(__dirname, '..', '..', 'uploads', 'Update');
                const oldPath = path.join(basePath, oldSlug);
                const newPath = path.join(basePath, newSlug);
                try {
                    if (fs.existsSync(oldPath)) {
                        // Ensure destination exists/parent ok
                        fs.mkdirSync(basePath, { recursive: true });
                        fs.renameSync(oldPath, newPath);
                    } else {
                        // If old folder doesn't exist, ensure new exists for future uploads
                        fs.mkdirSync(newPath, { recursive: true });
                    }
                } catch (e) {
                    return res.status(500).json({ error: 'Failed to rename media folder', details: e.message });
                }
            }
        }

        const update = await Schema.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!update) {
            return res.status(404).json({ error: 'Update not found' });
        }

        res.json({ 
            message: 'Fields updated successfully', 
            update
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to update fields',
            details: error.message
        });
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
        console.log('Incoming request for project:', id);
        console.log('Request body:', req.body);
        
        let imagesToDelete = [];
        try {
            imagesToDelete = JSON.parse(req.body.imagesToDelete || '[]');
        } catch (e) {
            console.error('Error parsing imagesToDelete:', e);
            throw new Error('Invalid format for imagesToDelete');
        }
        
        console.log('Processing update request:', {
            postId: id,
            imagesToDelete,
            newFiles: req.files ? Object.keys(req.files).length : 0
        });

        const update = await Schema.findById(id).session(session);
        if (!update) {
            throw new Error('Post not found');
        }

        console.log('Found post:', update.title);

        if (!update) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: 'Update not found' });
        }

        const foldername = sanitizeTitle(update.title);
        const folderPath = path.join(__dirname, '..', '..', 'uploads', 'Update', foldername);
        
        // Ensure the folder exists
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        console.log('Working with folder:', folderPath);

        // Handle image deletions
        if (imagesToDelete.length > 0) {
            console.log('Starting image deletion process for:', imagesToDelete);
            
            for (const imageToDelete of imagesToDelete) {
                // Validate filename
                if (!imageToDelete || typeof imageToDelete !== 'string') {
                    console.log('Invalid filename:', imageToDelete);
                    continue;
                }

                // Ensure we're only dealing with the filename, not a path
                const safeFilename = path.basename(imageToDelete);
                const imagePath = path.join(folderPath, safeFilename);

                console.log('Attempting to delete:', imagePath);

                try {
                    if (fs.existsSync(imagePath)) {
                        await fs.promises.unlink(imagePath);
                        console.log('Successfully deleted file:', safeFilename);
                        update.photos = update.photos.filter(photo => photo !== safeFilename);
                    } else {
                        console.log('File not found, removing from database:', safeFilename);
                        update.photos = update.photos.filter(photo => photo !== safeFilename);
                    }
                } catch (error) {
                    console.error('Error while deleting file:', error);
                    throw new Error(`Failed to delete image ${safeFilename}: ${error.message}`);
                }
            }
            
            console.log('Remaining photos after deletion:', update.photos);
        }

        // Handle new images
        if (req.files && req.files.newImages) {
            console.log('Adding new images:', req.files.newImages.length);
            const newPhotos = req.files.newImages.map(file => file.filename);
            update.photos = [...update.photos, ...newPhotos];
            console.log('Updated photos array:', update.photos);
        }

        try {
            // Save changes
            const savedUpdate = await update.save({ session });
            await session.commitTransaction();
            
            console.log('Successfully saved update:', savedUpdate._id);
            
            // Send success response
            res.json({ 
                message: 'Photos updated successfully',
                update: {
                    id: savedUpdate._id,
                    title: savedUpdate.title,
                    photos: savedUpdate.photos
                }
            });
        } catch (error) {
            throw new Error(`Failed to save updates: ${error.message}`);
        }
    } catch (error) {
        console.error('Error in updatePhotos:', error);
        if (session) {
            try {
                await session.abortTransaction();
            } catch (abortError) {
                console.error('Error aborting transaction:', abortError);
            }
        }
        res.status(500).json({ 
            error: error.message || 'Failed to update photos',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    } finally {
        if (session) {
            try {
                await session.endSession();
            } catch (sessionError) {
                console.error('Error ending session:', sessionError);
            }
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

			req.flash("error", `unable to find the update with id: ${id}`);
			return res.redirect("/admin/update");
		}

        const foldername = sanitizeTitle(update.title);
		fs.rmSync(`./uploads/Update/${foldername}`, {
			recursive: true,
			force: true,
		});

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
    updateFields
};

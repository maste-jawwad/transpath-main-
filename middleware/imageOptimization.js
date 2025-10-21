const sharp = require('sharp');
const path = require('path');

// Configuration for different image sizes
const imageSizes = {
    thumbnail: { width: 150, height: 150 },
    medium: { width: 600, height: null }, // Keep aspect ratio
    large: { width: 1200, height: null }  // Keep aspect ratio
};

// Middleware to optimize uploaded images
const optimizeImage = async (req, file, folderPath) => {
    if (!file) return null;
    
    const filename = path.parse(file.filename);
    const optimizedFilename = `${filename.name}-optimized${filename.ext}`;
    const thumbnailFilename = `${filename.name}-thumb${filename.ext}`;
    
    try {
        // Create optimized version
        await sharp(file.path)
            .resize(imageSizes.medium.width, imageSizes.medium.height)
            .jpeg({ quality: 80, progressive: true })
            .withMetadata()
            .toFile(path.join(folderPath, optimizedFilename));

        // Create thumbnail
        await sharp(file.path)
            .resize(imageSizes.thumbnail.width, imageSizes.thumbnail.height)
            .jpeg({ quality: 70 })
            .withMetadata()
            .toFile(path.join(folderPath, thumbnailFilename));

        return {
            original: file.filename,
            optimized: optimizedFilename,
            thumbnail: thumbnailFilename
        };
    } catch (error) {
        console.error('Image optimization failed:', error);
        return { original: file.filename };
    }
};

module.exports = { optimizeImage };
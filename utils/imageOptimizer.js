const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Create optimized versions of images
async function optimizeImage(inputPath, outputPath, options = {}) {
    const {
        width = 800,
        quality = 80,
        format = 'webp'
    } = options;

    try {
        await sharp(inputPath)
            .resize(width, null, { fit: 'inside' })
            .webp({ quality })
            .toFile(outputPath);
    } catch (error) {
        console.error('Error optimizing image:', error);
        throw error;
    }
}

// Generate thumbnails for preview
async function generateThumbnail(inputPath, outputPath, size = 300) {
    try {
        await sharp(inputPath)
            .resize(size, size, { fit: 'cover' })
            .webp({ quality: 80 })
            .toFile(outputPath);
    } catch (error) {
        console.error('Error generating thumbnail:', error);
        throw error;
    }
}

// Function to ensure optimized image directory exists
function ensureOptimizedDir(baseDir) {
    const optimizedDir = path.join(baseDir, 'optimized');
    if (!fs.existsSync(optimizedDir)) {
        fs.mkdirSync(optimizedDir, { recursive: true });
    }
    return optimizedDir;
}

module.exports = {
    optimizeImage,
    generateThumbnail,
    ensureOptimizedDir
};
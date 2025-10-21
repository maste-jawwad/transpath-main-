const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

/**
 * Process and optimize an image file
 * @param {string} inputPath Path to input file
 * @param {string} outputPath Path to save processed file
 * @param {Object} options Processing options
 */
async function processImage(inputPath, outputPath, options = {}) {
    try {
        const {
            maxWidth = 1920,
            quality = 80,
            format = 'jpeg'
        } = options;

        await sharp(inputPath)
            .resize({
                width: maxWidth,
                height: undefined,
                fit: 'inside',
                withoutEnlargement: true
            })
            .toFormat(format, { quality })
            .toFile(outputPath);

        // Clean up original file
        await fs.unlink(inputPath).catch(console.error);
    } catch (error) {
        console.error('Image processing error:', error);
        // If processing fails, copy original file as fallback
        const buffer = await fs.readFile(inputPath);
        await fs.writeFile(outputPath, buffer);
        await fs.unlink(inputPath).catch(console.error);
    }
}

/**
 * Process multiple images in sequence
 */
async function processMultipleImages(files, outputDir, options = {}) {
    const results = [];
    
    for (const file of files) {
        const ext = path.extname(file.originalname).toLowerCase();
        const timestamp = Date.now();
        const filename = `${timestamp}_${path.basename(file.originalname, ext)}.jpg`;
        const outputPath = path.join(outputDir, filename);
        
        await processImage(file.path, outputPath, options);
        results.push(filename);
    }
    
    return results;
}

module.exports = {
    processImage,
    processMultipleImages
};
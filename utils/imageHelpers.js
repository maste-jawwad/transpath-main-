const path = require('path');
const fs = require('fs').promises;

async function processImages(files, outputDir) {
    const results = [];
    
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    for (const file of files) {
        try {
            // Create a safe filename
            const timestamp = Date.now();
            const safeFilename = `${timestamp}-${path.basename(file.originalname).replace(/[^a-zA-Z0-9.-]/g, '-')}`;
            const outputPath = path.join(outputDir, safeFilename);
            
            // Copy file to destination
            await fs.copyFile(file.path, outputPath);
            results.push(safeFilename);
            
            // Try to clean up temp file
            try {
                await fs.unlink(file.path);
            } catch (err) {
                console.warn('Could not delete temp file:', err.message);
            }
        } catch (error) {
            console.error(`Error processing file ${file.originalname}:`, error);
            throw error;
        }
    }
    
    return results;
}

module.exports = {
    processImages,
    optimizeImage
};
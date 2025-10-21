const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    if (err.code === 'LIMIT_FILE_SIZE') {
        req.flash('error', 'File too large');
        return res.redirect('back');
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
        req.flash('error', 'Too many files');
        return res.redirect('back');
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        req.flash('error', 'Unexpected file type');
        return res.redirect('back');
    }

    req.flash('error', err.message || 'Something went wrong');
    res.redirect('back');
};

module.exports = errorHandler;
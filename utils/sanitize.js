const sanitizeTitle = (title) => {
    if (!title) {
        throw new Error("Title is required");
    }
    return title
        .toString()
        .replace(/[^a-zA-Z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .toLowerCase()
        .trim();
};

module.exports = {
    sanitizeTitle
};
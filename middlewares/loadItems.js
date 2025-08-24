/**
 * Generic loader middleware to retrieve items from the database.
 * Builds a search query across provided fields and attaches results to res.locals.items.
 *
 * @param {mongoose.Model} model - Mongoose model to query.
 * @param {string[]} fields - Fields to include in text search.
 * @returns {function} Express middleware.
 */
module.exports = (model, fields) => {
    return (req, res, next) => {
        const searchQuery = req.query.search;
        let query = {};

        res.locals.query = req.query;

        if (searchQuery && Array.isArray(fields) && fields.length > 0) {
            query = {
                $or: fields.map(field => ({ [field]: { $regex: searchQuery, $options: 'i' } }))
            };
        }

        model.find(query)
            .then(items => {
                res.locals.items = items;
                return next();
            })
            .catch(err => {
                console.error('Error loading items:', err);
                res.locals.items = [];
                return next();
            });
    };
};

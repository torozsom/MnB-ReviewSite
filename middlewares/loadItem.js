/**
 * Loads a single book or movie from the database.
 *
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {

    /**
     * Loads comments associated with a specific item from the database, sorts them by date in descending order,
     * and attaches the result to `res.locals.item.comments`.
     *
     * @param {string} itemId - The ID of the item (e.g., book or movie) to which the comments are assigned.
     * @param {string} modelType - The type of the model (`Book` or `Movie`) to search comments for.
     * @param {Object} res - The response object for attaching the comments.
     * @returns {Promise<void>} Resolves when the operation is complete or logs an error if it fails.
     */
    async function loadComments(itemId, modelType, res) {
        try {
            const comments = await objRepo.CommentModel.find({
                _assignedTo: itemId,
                onModel: modelType
            }).sort({date: -1});
            if (comments)
                res.locals.item.comments = comments;
        } catch (err) {
            console.error('Error loading comments:', err);
            res.locals.item.comments = [];
        }
    }


    /**
     * Loads the user rating for a specific item and sets it in the response's local variables.
     *
     * @param {string} itemId - The unique identifier of the item for which the rating is being loaded.
     * @param {string} modelType - The type of the model associated with the item.
     * @param {string} username - The username of the user whose rating is being retrieved.
     * @param {object} res - The response object where the loaded user rating will be set in the `locals` property.
     * @return {Promise<void>} A promise that resolves when the rating has been loaded and the response's locals are updated.
     */
    async function loadUserRating(itemId, modelType, username, res) {
        if (!username) {
            res.locals.userRatings = [];
            return Promise.resolve();
        }

        try {
            const rating = await objRepo.RatingModel.findOne({
                _assignedTo: itemId,
                onModel: modelType,
                username: username
                }
            );
            if (rating)
                res.locals.userRating = rating ? rating.rating : null;
        } catch (err) {
            console.error('Error loading user rating:', err);
            res.locals.userRating = null;
        }
    }


    return async (req, res, next) => {
        const itemId = req.params.id;
        const username = req.session.username;

        if (!itemId)
            return res.status(400).send('⚠️  Item ID is required.');

        try {
            let item = await objRepo.BookModel.findById(itemId);
            if (item) {
                res.locals.item = item;
                await loadComments(itemId, 'Book', res);
                await loadUserRating(itemId, 'Book', username, res);
                return next();
            } else {
                item = await objRepo.MovieModel.findById(itemId);
                if (item) {
                    res.locals.item = item;
                    await loadComments(itemId, 'Movie', res);
                    await loadUserRating(itemId, 'Movie', username, res);
                    return next();
                } else {
                    return res.status(404).send('⚠️  Item not found.');
                }
            }
        } catch (err) {
            console.error('Error loading item:', err);
            next(err);
        }

    };

}

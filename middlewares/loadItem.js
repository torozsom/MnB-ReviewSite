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
    function loadComments(itemId, modelType, res) {
        return objRepo.CommentModel.find({
            _assignedTo: itemId,
            onModel: modelType
        })
            .sort({ date: -1 })
            .populate('user', 'username')
            .then(comments => {
                res.locals.item.comments = comments;
            })
            .catch(err => {
                console.error('Error loading comments:', err);
                res.locals.item.comments = [];
            });
    }


    /**
     * Loads a user's rating for a specific item from the database and attaches it to `res.locals.userRating`.
     *
     * @param {string} itemId - The ID of the item (e.g., book or movie) to which the rating is assigned.
     * @param {string} modelType - The type of the model (`Book` or `Movie`) to search the rating for.
     * @param {string|null} userId - The ID of the user whose rating is being retrieved.
     * @param {Object} res - The response object for attaching the user's rating.
     * @returns {Promise<void>} Resolves when the operation is complete or logs an error if it fails.
     */
    function loadUserRating(itemId, modelType, userId, res) {
        if (!userId) {
            res.locals.userRating = null;
            return Promise.resolve();
        }

        return objRepo.RatingModel.findOne({
            _assignedTo: itemId,
            onModel: modelType,
            user: userId
        })
            .then(rating => {
                res.locals.userRating = rating ? rating.rating : null;
            })
            .catch(err => {
                console.error('Error loading user rating:', err);
                res.locals.userRating = null;
            });
    }


    return (req, res, next) => {
        const itemId = req.params.id;
        const userId = req.session?.userId;

        if (!itemId)
            return res.status(400).send('Item ID is required.');

        let foundItem = null;
        let foundModelType = null;

        objRepo.BookModel.findById(itemId)
            .then(book => {
                if (book) {
                    foundItem = book;
                    foundModelType = 'Book';
                    return book;
                }
                return objRepo.MovieModel.findById(itemId).then(movie => {
                    if (movie) {
                        foundItem = movie;
                        foundModelType = 'Movie';
                    }
                    return movie;
                });
            })
            .then(item => {
                if (!item) return;

                res.locals.item = foundItem;

                return Promise.all([
                    loadComments(itemId, foundModelType, res),
                    loadUserRating(itemId, foundModelType, userId, res)
                ]);
            })
            .then(() => {
                if (!foundItem)
                    return res.status(404).send('⚠️ Item not found.');
                return next();
            })
            .catch(err => {
                console.error('Error loading item:', err);
                return next(err);
            });
    };

}

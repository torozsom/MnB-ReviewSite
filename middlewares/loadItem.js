/**
 * Loads a single book or movie from the database.
 *
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    const BookModel = objRepo.BookModel;
    const MovieModel = objRepo.MovieModel;
    const CommentModel = objRepo.CommentModel;
    const RatingModel = objRepo.RatingModel;


    return (req, res, next) => {
        const itemId = req.params.id;
        const username = req.session.username;

        if (!itemId)
            return res.status(400).send('⚠️  Item ID is required.');

        // First try to find the item as a book
        BookModel.findById(itemId)
            .then(book => {
                if (book) {
                    // Item is a book
                    res.locals.item = book;
                    return Promise.all([
                        loadComments(itemId, 'Book'),
                        loadUserRating(itemId, 'Book', username)
                    ]);
                } else {
                    // Try to find the item as a movie
                    return MovieModel.findById(itemId)
                        .then(movie => {
                            if (movie) {
                                // Item is a movie
                                res.locals.item = movie;
                                return Promise.all([
                                    loadComments(itemId, 'Movie', res),
                                    loadUserRating(itemId, 'Movie', username, res)
                                ]);
                            } else {
                                return res.status(404).send('⚠️  Item not found.');
                            }
                        });
                }
            })
            .then(() => {
                return next();
            })
            .catch(err => {
                console.error('Error loading item:', err);
                next(err);
            });
    };


    /**
     * Fetches and loads comments associated with a specific item in the database.
     *
     * @param {string} itemId - The unique identifier of the item for which comments are being retrieved.
     * @param {string} modelType - The type of the item's model.
     * @returns {Promise<void>} - A promise that resolves when comments are successfully fetched and assigned
     *                              to `res.locals.item.comments`, or rejects in case of an error.
     */
    function loadComments(itemId, modelType, res) {
        return CommentModel.find({
            _assignedTo: itemId,
            onModel: modelType
        })
            .sort({date: -1}) // Sort by date descending (newest first)
            .then(comments => {
                res.locals.item.comments = comments;
            })
            .catch(err => {
                console.error('Error loading comments:', err);
                res.locals.item.comments = [];
            });
    }


    /**
     * Fetches and loads the user rating for a specific item from the database.
     *
     * @param {string} itemId - The unique identifier of the item for which the rating is being retrieved.
     * @param {string} modelType - The type of the item's model.
     * @param {string|null} username - The username of the user whose rating is being retrieved. (If no username is provided, no rating is fetched.)
     * @returns {Promise<void>} A promise that resolves after attempting to fetch the user rating:
     *                          - If the user rating is found, it is stored in `res.locals.userRating`.
     *                          - If no rating is found or an error occurs, `res.locals.userRating` is set to `null`.
     */
    function loadUserRating(itemId, modelType, username, res) {
        if (!username) {
            res.locals.userRating = null;
            return Promise.resolve();
        }

        return RatingModel.findOne({
            _assignedTo: itemId,
            onModel: modelType,
            username: username
        })
            .then(rating => {
                res.locals.userRating = rating ? rating.rating : null;
            })
            .catch(err => {
                console.error('Error loading user rating:', err);
                res.locals.userRating = null;
            });
    }

};

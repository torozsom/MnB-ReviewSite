/**
 * Loads a single book or movie from the database.
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
            return res.status(400).send('⚠️ Item ID is required.');

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
                                    loadComments(itemId, 'Movie'),
                                    loadUserRating(itemId, 'Movie', username)
                                ]);
                            } else {
                                return res.status(404).send('⚠️ Item not found.');
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

        function loadComments(itemId, modelType) {
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

        function loadUserRating(itemId, modelType, username) {
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
};

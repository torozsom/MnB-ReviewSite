/**
 * Saves a comment of an item from a user to the database.
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    const CommentModel = objRepo.CommentModel;

    return (req, res, next) => {

        const username = req.session.username;

        // Extract data from request body
        const text = req.body.text;
        const itemId = req.params.id;

        // Validate required fields
        if (!username || !text || !itemId)
            return res.status(400).send('⚠️ All fields are required.');

        // Determine if the item is a book or movie
        const BookModel = objRepo.BookModel;
        const MovieModel = objRepo.MovieModel;

        // First try to find the item as a book
        BookModel.findById(itemId)
            .then(book => {
                if (book) {
                    // Item is a book
                    return saveComment('Book', itemId);
                } else {
                    // Try to find the item as a movie
                    return MovieModel.findById(itemId)
                        .then(movie => {
                            if (movie) {
                                // Item is a movie
                                return saveComment('Movie', itemId);
                            } else {
                                return res.status(404).send('⚠️ Item not found.');
                            }
                        });
                }
            })
            .catch(err => {
                console.error('Error finding item:', err);
                next(err);
            });

        function saveComment(modelType, itemId) {
            // Create new comment
            const newComment = new CommentModel({
                username,
                text,
                date: new Date(),
                _assignedTo: itemId,
                onModel: modelType
            });

            return newComment.save()
                .then(savedComment => {
                    console.log('✅ Comment saved successfully');
                    res.redirect('/details/' + itemId);
                })
                .catch(err => {
                    console.error('Error saving comment:', err);
                    next(err);
                });
        }
    };
};

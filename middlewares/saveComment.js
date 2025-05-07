/**
 * Saves a comment of an item from a user to the database.
 *
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    const CommentModel = objRepo.CommentModel;
    const BookModel = objRepo.BookModel;
    const MovieModel = objRepo.MovieModel;


    /**
     * Validates comment data
     *
     * @param username - Username of the commenter
     * @param text - Comment text
     * @param itemId - ID of the item being commented on
     * @returns {string|null} - Error message or null if valid
     */
    function validateCommentData(username, text, itemId) {
        if (!username || !text || !itemId)
            return '⚠️  All fields are required.';

        return null;
    }


    /**
     * Finds an item (book or movie) by ID
     *
     * @param itemId - ID of the item to find
     * @returns {Promise<{modelType: string, item: *}|null>} - Promise resolving to the item and its type, or null if not found
     */
    function findItem(itemId) {
        // First try to find the item as a book
        return BookModel.findById(itemId)
            .then(book => {
                if (book) {
                    return {item: book, modelType: 'Book'};
                } else {
                    // Try to find the item as a movie
                    return MovieModel.findById(itemId)
                        .then(movie => {
                            if (movie)
                                return {item: movie, modelType: 'Movie'};
                            else
                                return null;
                        });
                }
            });
    }


    /**
     * Saves a comment for an item
     *
     * @param username - Username of the commenter
     * @param text - Comment text
     * @param itemId - ID of the item being commented on
     * @param modelType - Type of the model ('Book' or 'Movie')
     * @returns {Promise<*>} - Promise resolving when the comment is saved
     */
    function saveComment(username, text, itemId, modelType) {
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
                console.log('✅  Comment saved successfully');
                return savedComment;
            });
    }


    return (req, res, next) => {
        const username = req.session.username;
        const text = req.body.text;
        const itemId = req.params.id;

        // Validate comment data
        const validationError = validateCommentData(username, text, itemId);
        if (validationError)
            return res.status(400).send(validationError);

        // Find the item
        findItem(itemId)
            .then(result => {
                if (!result)
                    return res.status(404).send('⚠️  Item not found.');

                // Save the comment
                return saveComment(username, text, itemId, result.modelType)
                    .then(() => {
                        res.redirect('/details/' + itemId);
                    });
            })
            .catch(err => {
                console.error('Error saving comment:', err);
                next(err);
            });
    };

}

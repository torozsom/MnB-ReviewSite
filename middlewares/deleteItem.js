/**
 * Middleware for deleting books or movies from the database.
 * Handles validation, deletion of the item, and cleanup of associated comments.
 *
 * @param objRepo - Object repository containing models
 * @returns {function(*, *, *): *} - Express middleware function
 */
module.exports = (objRepo) => {
    const BookModel = objRepo.BookModel;
    const MovieModel = objRepo.MovieModel;
    const CommentModel = objRepo.CommentModel;


    /**
     * Validates that the item ID is provided
     *
     * @param itemId - ID of the item to delete
     * @returns {string|null} - Error message or null if valid
     */
    function validateItemId(itemId) {
        if (!itemId)
            return '⚠️  Item ID is required.';

        return null;
    }


    /**
     * Deletes a book by ID
     *
     * @param itemId - ID of the book to delete
     * @returns {Promise<*>} - Promise resolving to the deleted book or null if not found
     */
    function deleteBook(itemId) {
        return BookModel.findByIdAndDelete(itemId)
            .then(deletedBook => {
                if (deletedBook) {
                    console.log('✅  Book deleted successfully:', deletedBook.title);
                    return {item: deletedBook, modelType: 'Book'};
                }
                return null;
            });
    }


    /**
     * Deletes a movie by ID
     *
     * @param itemId - ID of the movie to delete
     * @returns {Promise<*>} - Promise resolving to the deleted movie or null if not found
     */
    function deleteMovie(itemId) {
        return MovieModel.findByIdAndDelete(itemId)
            .then(deletedMovie => {
                if (deletedMovie) {
                    console.log('✅  Movie deleted successfully:', deletedMovie.title);
                    return {item: deletedMovie, modelType: 'Movie'};
                }
                return null;
            });
    }


    /**
     * Deletes comments associated with an item
     *
     * @param itemId - ID of the item
     * @param modelType - Type of the model ('Book' or 'Movie')
     * @returns {Promise<*>} - Promise resolving when comments are deleted
     */
    function deleteComments(itemId, modelType) {
        return CommentModel.deleteMany({
            _assignedTo: itemId,
            onModel: modelType
        })
            .then(result => {
                console.log(`✅  Deleted ${result.deletedCount} comments associated with the item.`);
            })
            .catch(err => {
                console.error('Error deleting comments:', err);
            });
    }


    return (req, res, next) => {
        const itemId = req.params.id;

        // Validate item ID
        const validationError = validateItemId(itemId);
        if (validationError)
            return res.status(400).send(validationError);

        // Try to delete the item as a book first, then as a movie if not found
        deleteBook(itemId)
            .then(result => {
                if (result) {
                    return deleteComments(itemId, result.modelType);
                } else {
                    // Try to find and delete the item as a movie
                    return deleteMovie(itemId)
                        .then(result => {
                            if (result)
                                return deleteComments(itemId, result.modelType);
                            else
                                return res.status(404).send('⚠️  Item not found.');
                        });
                }
            })
            .then(() => {
                // Redirect to home page after successful deletion
                res.redirect('/');
            })
            .catch(err => {
                console.error('Error deleting item:', err);
                next(err);
            });
    };

}

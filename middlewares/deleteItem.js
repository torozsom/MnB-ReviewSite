/**
 * Middleware for deleting books or movies from the database.
 * Handles validation, deletion of the item, and cleanup of associated comments.
 *
 * @param objRepo - Object repository containing models
 * @returns {function(*, *, *): *} - Express middleware function
 */
module.exports = (objRepo) => {

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
     * Deletes a book from the database based on the provided item ID.
     *
     * @param {string} itemId - The unique identifier of the book to be deleted.
     * @return {Promise<{item: Object, modelType: string} | null>}
     *          A promise that resolves to an object
     *          containing the deleted book's data and its model type if successful,
     *          or null if no book was found with the given ID.
     */
    async function deleteBook(itemId) {
        try {
            const deletedBook = await objRepo.BookModel.findByIdAndDelete(itemId);
            if (deletedBook) {
                console.log('✅  Book deleted successfully:', deletedBook.title);
                return {item: deletedBook, modelType: 'Book'};
            }
            return null;
        } catch (err) {
            console.error('Error deleting book:', err);
        }
    }


    /**
     * Deletes a movie from the database by its unique identifier.
     *
     * @param {string} itemId - The unique identifier of the movie to be deleted.
     *
     * @return {Promise<Object|null>} A promise that resolves to an object
     *          containing the deleted movie and model type if successful,
     *          or null if no movie is found with the given identifier.
     */
    async function deleteMovie(itemId) {
        try {
            const deletedMovie = await objRepo.MovieModel.findByIdAndDelete(itemId);
            if (deletedMovie) {
                console.log('✅  Movie deleted successfully:', deletedMovie.title);
                return {item: deletedMovie, modelType: 'Movie'};
            }
            return null;
        } catch (err) {
            console.error('Error deleting movie:', err);
        }
    }


    /**
     * Deletes all comments associated with a specific item and model type.
     *
     * @param {string} itemId - The identifier of the item whose comments are to be deleted.
     * @param {string} modelType - The type of the model to which the item belongs.
     * @return {Promise<void>} A promise that resolves when the deletion process is complete.
     */
    async function deleteComments(itemId, modelType) {
        try {
            const deletedComments = await objRepo.CommentModel.deleteMany({
                assignedTo: itemId,
                onModel: modelType
            });
            if (deletedComments)
                console.log(`✅  Deleted ${deletedComments.deletedCount} comments associated with the item.`)
        } catch (err) {
            console.error('Error deleting comments:', err);
        }
    }


    return async (req, res, next) => {
        const itemId = req.params.id;

        // Validate item ID
        const validationError = validateItemId(itemId);
        if (validationError)
            return res.status(400).send(validationError);

        try {
            let deletedItem = await deleteBook(itemId);

            if (deletedItem)
                await deleteComments(itemId, deletedItem.modelType);
            else {
                deletedItem = await deleteMovie(itemId);
                if (deletedItem)
                    await deleteComments(itemId, deletedItem.modelType);
                else
                    return res.status(404).send('⚠️  Item not found.');
            }

            res.redirect('/');

        } catch (err) {
            console.error('Error deleting item:', err);
            next(err);
        }

    };

}

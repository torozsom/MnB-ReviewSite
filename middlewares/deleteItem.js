/**
 * Middleware for deleting books or movies from the database.
 * Handles validation, deletion of the item, and cleanup of associated comments.
 *
 * @param objRepo - Object repository containing models
 * @returns {function(*, *, *): *} - Express middleware function
 */
module.exports = (objRepo) => {

    /**
     * Deletes an item (book or movie) from the database based on the provided ID.
     *
     * @param itemId The ID of the item to be deleted
     * @returns {Promise<{item: *, modelType: string}>}
     */
    function deleteItem(itemId) {
        return objRepo.BookModel.findByIdAndDelete(itemId)
            .then(deletedBook => {
                if (deletedBook) {
                    console.log('Book deleted successfully:', deletedBook.title);
                    return { item: deletedBook, modelType: 'Book' };
                }

                return objRepo.MovieModel.findByIdAndDelete(itemId)
                    .then(deletedMovie => {
                        if (deletedMovie) {
                            console.log('✅ Movie deleted successfully:', deletedMovie.title);
                            return { item: deletedMovie, modelType: 'Movie' };
                        }
                        return null;
                    });
            });
    }


    /**
     * Deletes all comments and ratings associated with a specific item (book or movie) from the database.
     *
     * @param itemId The ID of the item to delete associated comments and ratings for
     * @param modelType The type of the item (book or movie)
     * @returns {Promise<void>} A Promise that resolves when the cleanup is complete
     */
    function deleteAssociatedData(itemId, modelType) {
        // A Mongoose query-k elindulnak, de nem várunk rájuk egyenként
        const commentsPromise
            = objRepo.CommentModel.deleteMany({ _assignedTo: itemId, onModel: modelType });
        const ratingsPromise
            = objRepo.RatingModel.deleteMany({ _assignedTo: itemId, onModel: modelType });

        return Promise.all([commentsPromise, ratingsPromise])
            .then(([commentResult, ratingResult]) =>
                console.log(`Cleaned up: ${commentResult.deletedCount} comments and ${ratingResult.deletedCount} ratings.`)
            );
    }


    return (req, res, next) => {
        const itemId = req.params.id;

        if (!itemId)
            return res.status(400).send('Item ID is required.');

        deleteItem(itemId)
            .then(result => {
                if (!result)
                    return res.status(404).send('Item not found.');

                return deleteAssociatedData(itemId, result.modelType)
                    .then(() => {
                        return res.redirect('/');
                    });
            })
            .catch(err => {
                console.error('Error during deletion process:', err);
                return next(err);
            });
    };
};

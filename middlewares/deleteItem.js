/**
 * Deletes a book or movie from the database.
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    const BookModel = objRepo.BookModel;
    const MovieModel = objRepo.MovieModel;
    const CommentModel = objRepo.CommentModel;

    return (req, res, next) => {
        const itemId = req.params.id;

        if (!itemId)
            return res.status(400).send('⚠️ Item ID is required.');

        // First try to find and delete the item as a book
        BookModel.findByIdAndDelete(itemId)
            .then(deletedBook => {
                if (deletedBook) {
                    // Item was a book and has been deleted
                    console.log('✅ Book deleted successfully:', deletedBook.title);
                    // Delete all comments associated with this book
                    return deleteComments(itemId, 'Book');
                } else {
                    // Try to find and delete the item as a movie
                    return MovieModel.findByIdAndDelete(itemId)
                        .then(deletedMovie => {
                            if (deletedMovie) {
                                // Item was a movie and has been deleted
                                console.log('✅ Movie deleted successfully:', deletedMovie.title);
                                // Delete all comments associated with this movie
                                return deleteComments(itemId, 'Movie');
                            } else {
                                return res.status(404).send('⚠️ Item not found.');
                            }
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

        function deleteComments(itemId, modelType) {
            return CommentModel.deleteMany({
                _assignedTo: itemId,
                onModel: modelType
            })
                .then(result => {
                    console.log(`✅ Deleted ${result.deletedCount} comments associated with the item.`);
                })
                .catch(err => {
                    console.error('Error deleting comments:', err);
                });
        }
    };
};

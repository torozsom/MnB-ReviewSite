/**
 * Saves a comment of an item from a user to the database.
 *
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {

    /**
     * Saves a comment to the database. If the item being commented on is not found, sends a 404 response.
     * If the comment is saved successfully, redirects to the details page of the item. If any error occurs
     * during the process, logs the error and passes it to the next middleware.
     *
     * @param res The response object.
     * @param next The next middleware function.
     * @param userId The ID of the user who is making the comment.
     * @param text The text content of the comment.
     * @param itemId The ID of the item being commented on.
     */
    function saveComment(res, next, userId, text, itemId) {
        let modelType = null;

        objRepo.BookModel.findById(itemId)
            .then(book => {
                if (book) {
                    modelType = 'Book';
                    return book;
                }
                return objRepo.MovieModel.findById(itemId).then(movie => {
                    if (movie) modelType = 'Movie';
                    return movie;
                });
            })
            .then(item => {
                if (!item)
                    return res.status(404).send('Item not found.');

                const newComment = new objRepo.CommentModel({
                    user: userId,
                    text: text,
                    _assignedTo: itemId,
                    onModel: modelType
                });

                return newComment.save();
            })
            .then(savedComment => {
                if (savedComment) {
                    console.log('Comment saved successfully');
                    return res.redirect('/details/' + itemId);
                }
            })
            .catch(err => {
                console.error('Error saving comment:', err);
                return next(err);
            });
    }


    return (req, res, next) => {

        const userId = req.session.userId;
        const text = req.body.text;
        const itemId = req.params.id;

        if (!userId || !text || !itemId)
            return res.status(400).send('All fields are required.');

        saveComment(res, next, userId, text, itemId);
    };
};

/**
 * Loads all books from the database.
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    const BookModel = objRepo.BookModel;

    return (req, res, next) => {
        BookModel.find({})
            .then(books => {
                res.locals.items = books;
                return next();
            })
            .catch(err => {
                console.error('Error loading books:', err);
                res.locals.items = [];
                return next();
            });
    }
}

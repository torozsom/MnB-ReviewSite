/**
 * Loads all books from the database.
 * If a search query is provided, filters books by title or author.
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    const BookModel = objRepo.BookModel;

    return (req, res, next) => {
        const searchQuery = req.query.search;
        let query = {};

        // Store the query in res.locals for access in the view
        res.locals.query = req.query;

        if (searchQuery) {
            // Search in title or author fields
            query = {
                $or: [
                    {title: {$regex: searchQuery, $options: 'i'}},
                    {author: {$regex: searchQuery, $options: 'i'}}
                ]
            };
        }

        BookModel.find(query)
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

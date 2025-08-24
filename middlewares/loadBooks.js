
// Wrapper around generic item loader for movies.
const loadItems = require('./loadItems');


/**
 * Loads all books from the database.
 * If a search query is provided, filters books by title or author.
 *
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    return loadItems(objRepo.BookModel, ['title', 'author']);
}


// Wrapper around generic item loader for movies.
const loadItems = require('./loadItems');


/**
 * Loads all movies from the database.
 * If a search query is provided, filters movies by title or director.
 *
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    return loadItems(objRepo.MovieModel, ['title', 'director']);
}

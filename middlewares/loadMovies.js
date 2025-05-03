/**
 * Loads all movies from the database.
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    const MovieModel = objRepo.MovieModel;

    return (req, res, next) => {
        MovieModel.find({})
            .then(movies => {
                res.locals.items = movies;
                return next();
            })
            .catch(err => {
                console.error('Error loading movies:', err);
                res.locals.items = [];
                return next();
            });
    }
}

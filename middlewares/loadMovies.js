﻿/**
 * Loads all movies from the database.
 * If a search query is provided, filters movies by title or director.
 *
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {

    return (req, res, next) => {
        const searchQuery = req.query.search;
        let query = {};

        // Store the query in res.locals for access in the view
        res.locals.query = req.query;

        if (searchQuery) {
            // Search in title or director fields
            query = {
                $or: [
                    {title: {$regex: searchQuery, $options: 'i'}},
                    {director: {$regex: searchQuery, $options: 'i'}}
                ]
            };
        }

        objRepo.MovieModel.find(query)
            .then(movies => {
                res.locals.items = movies;
                return next();
            })
            .catch(err => {
                console.error('Error loading movies:', err);
                res.locals.items = [];
                return next();
            });
    };

}

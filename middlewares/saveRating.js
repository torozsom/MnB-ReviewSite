/**
 * Saves a rating of an item from a user to the database.
 *
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {

    return (req, res, next) => {
        const username = req.session.username;

        // Extract data from request body
        const rating = parseInt(req.body.rating);
        const itemId = req.params.id;

        // Validate required fields
        if (!username || !rating || !itemId)
            return res.status(400).send('⚠️  All fields are required.');

        // Validate rating value
        if (rating < 1 || rating > 5)
            return res.status(400).send('⚠️  Rating must be between 1 and 5.');

        // First try to find the item as a book
        objRepo.BookModel.findById(itemId)
            .then(book => {
                if (book) {
                    return saveRating('Book', itemId, book);
                } else {
                    // Try to find the item as a movie
                    return objRepo.MovieModel.findById(itemId)
                        .then(movie => {
                            if (movie)
                                return saveRating('Movie', itemId, movie);
                            else
                                return res.status(404).send('⚠️ Item not found.');
                        });
                }
            })
            .catch(err => {
                console.error('Error finding item:', err);
                next(err);
            });


        /**
         * Saves a rating for a specific item to the database. If a rating from the
         * user already exists, it updates the existing rating; otherwise, it creates
         * a new rating entity. After saving, it triggers an update for the item's
         * average rating.
         *
         * @param {string} modelType - The type of model being rated.
         * @param {string} itemId - The ID of the item being rated.
         * @param {Object} item - The item to update with the rating.
         * @returns {Promise} - Resolves when the rating is saved and the average is updated.
         */
        function saveRating(modelType, itemId, item) {
            // Check if user has already rated this item
            return objRepo.RatingModel.findOne({
                _assignedTo: itemId,
                onModel: modelType,
                username: username
            })
                .then(existingRating => {
                    if (existingRating) {
                        // Update existing rating
                        existingRating.rating = rating;
                        existingRating.date = new Date();
                        return existingRating.save().then(() => updateAverageRating(modelType, itemId, item));
                    } else {
                        // Create new rating
                        const newRating = new objRepo.RatingModel({
                            username,
                            rating,
                            date: new Date(),
                            _assignedTo: itemId,
                            onModel: modelType
                        });

                        return newRating.save().then(() => updateAverageRating(modelType, itemId, item));
                    }
                });
        }


        /**
         * Updates the average rating and rating count of an item based on all ratings
         * for that item in the database. If no ratings exist, sets the average
         * to 0. Saves the updated item back to the database.
         *
         * @param {string} modelType - The type of model being rated.
         * @param {string} itemId - The ID of the item for which the average rating will be calculated.
         * @param {Object} item - The item to update with the average rating.
         * @returns {Promise} - Resolves when the item's average rating is updated and saved.
         */
        function updateAverageRating(modelType, itemId, item) {
            return objRepo.RatingModel.find({
                _assignedTo: itemId,
                onModel: modelType
            })
                .then(ratings => {
                    if (ratings.length === 0) {
                        item.averageRating = 0;
                        item.ratingCount = 0;
                    } else {
                        const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
                        item.averageRating = totalRating / ratings.length;
                        item.ratingCount = ratings.length;
                    }
                    return item.save();
                })
                .then(() => {
                    console.log('✅  Rating saved successfully');
                    res.redirect('/details/' + itemId);
                })
                .catch(err => {
                    console.error('Error saving rating:', err);
                    next(err);
                });
        }
    };

}
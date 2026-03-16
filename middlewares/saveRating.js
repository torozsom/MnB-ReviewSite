/**
 * Saves a rating of an item from a user to the database.
 *
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {

    /**
     * Finds an item by ID and determines its model type (Book or Movie).
     * If the item is found, returns an object with item and modelType; otherwise, returns null.
     *
     * @param itemId
     * @returns {Promise<{item: *, modelType: string}|null>} Promise resolving to the found item info or null
     */
    function findItem(itemId) {
        return objRepo.BookModel.findById(itemId)
            .then(book => {
                if (book)
                    return { item: book, modelType: 'Book' };

                return objRepo.MovieModel.findById(itemId)
                    .then(movie => {
                        if (movie)
                            return { item: movie, modelType: 'Movie' };
                        return null;
                    });
            });
    }


    /**
     * Saves a new rating or updates an existing rating for a user and item.
     * If an existing rating is found, it updates the rating value and saves it.
     * If no existing rating is found, it creates a new rating document and saves it to the database.
     *
     * @param existingRating The existing rating document, if any.
     * @param userId The ID of the user who is making the rating.
     * @param rating The rating value to be saved or updated.
     * @param itemId The ID of the item being rated.
     * @param modelType The type of the item (Book or Movie).
     * @returns {Promise<*>} A promise that resolves to the saved or updated rating document.
     */
    function saveOrUpdateRating(existingRating, userId, rating, itemId, modelType) {
        if (existingRating) {
            existingRating.rating = rating;
            return existingRating.save();
        } else {
            // If no existing rating, create a new one
            const newRating = new objRepo.RatingModel({
                user: userId,
                rating: rating,
                _assignedTo: itemId,
                onModel: modelType
            });
            return newRating.save();
        }
    }


    /**
     * Calculates the average rating for an item based on all ratings
     * and updates the item's averageRating and ratingCount fields.
     *
     * @param allRatings Array of rating documents for the item.
     * @param foundItem The item object to update.
     * @returns {Promise<*>} A promise that resolves to the updated item object.
     */
    function calculateAverageRating(allRatings, foundItem) {
        const totalRating = allRatings.reduce((sum, r) => sum + r.rating, 0);
        foundItem.averageRating = allRatings.length > 0
            ? (totalRating / allRatings.length)
            : 0;
        foundItem.ratingCount = allRatings.length;
        return foundItem.save();
    }


    return (req, res, next) => {
        const userId = req.session.userId;
        const rating = parseInt(req.body.rating);
        const itemId = req.params.id;

        if (!userId || isNaN(rating) || !itemId)
            return res.status(400).send('All fields are required.');
        if (rating < 1 || rating > 5)
            return res.status(400).send('Rating must be between 1 and 5.');

        let modelType = null;
        let foundItem = null;

        findItem(itemId)
            .then(result => {
                if (!result)
                    return res.status(404).send('Item not found.');
                
                foundItem = result.item;
                modelType = result.modelType;

                // Check if a rating from this user already exists for this item
                return objRepo.RatingModel.findOne({
                    _assignedTo: itemId,
                    onModel: modelType,
                    user: userId
                });
            })
            .then(existingRating => {
                if (!foundItem) return;
                return saveOrUpdateRating(existingRating, userId, rating, itemId, modelType);
            })
            .then(savedOrUpdatedRating => {
                if (!savedOrUpdatedRating) return;
                return objRepo.RatingModel.find({ _assignedTo: itemId, onModel: modelType });
            })
            .then(allRatings => {
                if (!allRatings) return;
                return calculateAverageRating(allRatings, foundItem);
            })
            .then(savedItem => {
                if (savedItem) {
                    console.log('Rating processed and average updated successfully');
                    return res.redirect('/details/' + itemId);
                }
            })
            .catch(err => {
                console.error('Error during rating process:', err);
                return next(err);
            });
    };
};
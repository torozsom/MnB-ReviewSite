/**
 * Saves a new movie to the database or updates an existing one.
 *
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    const MovieModel = objRepo.MovieModel;


    /**
     * Validates movie data from the request
     *
     * @param title - Movie title
     * @param director - Movie director
     * @param releaseYear - Movie release year
     * @param description - Movie description
     * @returns {string|null} - Error message or null if valid
     */
    function validateMovieData(title, director, releaseYear, description) {
        // Validate required fields
        if (!title || !director || !releaseYear || !description)
            return '⚠️  All fields are required.';

        // Validate release year
        if (isNaN(releaseYear) || releaseYear < 1800 || releaseYear > new Date().getFullYear())
            return '⚠️  Invalid release year.';

        return null;
    }


    /**
     * Processes image data from the request
     *
     * @param req - Request object
     * @returns {object|undefined} - Image data object or undefined
     */
    function processImageData(req) {
        return req.file ? {
            data: req.file.buffer,
            contentType: req.file.mimetype
        } : undefined;
    }


    /**
     * Updates an existing movie in the database
     *
     * @param movieId - ID of the movie to update
     * @param updateData - Data to update
     * @returns {Promise<*>} - Promise resolving to the updated movie
     */
    function updateExistingMovie(movieId, updateData) {
        return MovieModel.findByIdAndUpdate(
            movieId,
            updateData,
            {new: true}
        )
            .then(updatedMovie => {
                if (!updatedMovie)
                    throw new Error('⚠️  Movie not found.');

                console.log('✅  Movie updated successfully:', updatedMovie.title);
                return updatedMovie;
            });
    }


    /**
     * Creates a new movie in the database
     *
     * @param movieData - Data for the new movie
     * @returns {Promise<*>} - Promise resolving to the saved movie
     */
    function createNewMovie(movieData) {
        const newMovie = new MovieModel(movieData);
        return newMovie.save()
            .then(savedMovie => {
                console.log('✅  Movie saved successfully:', savedMovie.title);
                return savedMovie;
            });
    }


    return (req, res, next) => {
        // Check if we're adding a new movie or editing an existing one
        const isEdit = req.params.id !== undefined;

        // Only process if itemType is 'movie' (for both add and edit forms)
        if (req.body.itemType !== 'movie')
            return next();

        // Extract data from request body
        const title = req.body.title;
        const director = req.body.creator;
        const releaseYear = parseInt(req.body.year);
        const description = req.body.description;

        // Validate movie data
        const validationError = validateMovieData(title, director, releaseYear, description);
        if (validationError)
            return res.status(400).send(validationError);

        // Process image if uploaded
        const imageData = processImageData(req);

        if (isEdit) {
            // Create update object
            const updateData = {
                title,
                director,
                releaseYear,
                description
            };

            // Only update image if a new one was uploaded
            if (imageData)
                updateData.image = imageData;

            // Update existing movie
            updateExistingMovie(req.params.id, updateData)
                .then(() => {
                    res.redirect('/movies');
                })
                .catch(err => {
                    if (err.message === '⚠️  Movie not found.')
                        return res.status(404).send(err.message);

                    console.error('Error updating movie:', err);
                    next(err);
                });
        } else {
            // Create new movie data object
            const movieData = {
                title,
                director,
                releaseYear,
                description,
                image: imageData
            };

            // Create and save new movie
            createNewMovie(movieData)
                .then(() => {
                    res.redirect('/movies');
                })
                .catch(err => {
                    console.error('Error saving movie:', err);
                    next(err);
                });
        }
    };

}

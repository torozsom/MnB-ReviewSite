/**
 * Saves a new movie to the database or updates an existing one.
 *
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {

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
            return 'All fields are required.';

        // Validate release year
        if (isNaN(releaseYear) || releaseYear < 1900 || releaseYear > new Date().getFullYear())
            return 'Invalid release year.';

        return null;
    }


    /**
     * Updates an existing movie in the database
     *
     * @param req The request object
     * @param res The response object
     * @param next The next middleware function
     * @param updateData The data to update the movie with
     */
    function updateExistingMovie(req, res, next, updateData) {
        objRepo.MovieModel.findByIdAndUpdate(req.params.id, updateData, { new: true })
            .then(movie => {
                if (!movie)
                    return res.status(404).send('The movie was not found.');
                console.log('Movie updated successfully:', movie.title);
                return res.redirect('/');
            })
            .catch(err => {
                console.error('Error updating movie:', err);
                return next(err);
            });
    }


    /**
     * Creates a new movie in the database
     *
     * @param res The response object
     * @param next The next middleware function
     * @param movieData - Data for the new movie
     * @returns {Promise<*>} - Promise resolving to the saved movie
     */
    function createNewMovie(res, next, movieData) {
        const newMovie = new objRepo.MovieModel(movieData);
        newMovie.save()
            .then(savedMovie => {
                console.log('Movie saved successfully:', savedMovie.title);
                return res.redirect('/');
            })
            .catch(err => {
                console.error('Error saving movie:', err);
                return next(err);
            });
    }


    return (req, res, next) => {
        if (req.body.itemType !== 'movie')
            return next();

        // Validate image file
        if (req.fileValidationError)
            return res.status(400).send(req.fileValidationError);

        // Extract data from request body
        const title = req.body.title;
        const director = req.body.creator;
        const releaseYear = parseInt(req.body.year);
        const description = req.body.description;

        // Validate movie data
        const validationError = validateMovieData(title, director, releaseYear, description);
        if (validationError)
            return res.status(400).send(validationError);

        // Check if we're adding a new movie or editing an existing one
        const isEdit = req.params.id !== undefined;
        const movieData = { title, director, releaseYear, description };

        // Upload image
        if (req.file)
            movieData.imageUrl = '/uploads/' + req.file.filename;

        if (isEdit)
            updateExistingMovie(req, res, next, movieData);
        else
            createNewMovie(res, next, movieData);
    };

}

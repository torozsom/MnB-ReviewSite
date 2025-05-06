/**
 * Saves a new movie to the database or updates an existing one.
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    const MovieModel = objRepo.MovieModel;

    return (req, res, next) => {
        // Check if we're adding a new movie or editing an existing one
        const isEdit = req.params.id !== undefined;

        // For add form, only process if itemType is 'movie'
        if (!isEdit && req.body.itemType !== 'movie')
            return next();

        // Extract data from request body
        const title = req.body.title;
        const producer = req.body.creator;
        const releaseYear = parseInt(req.body.year);
        const description = req.body.description;

        // Validate required fields
        if (!title || !producer || !releaseYear || !description)
            return res.status(400).send('⚠️ All fields are required.');

        // Validate release year
        if (isNaN(releaseYear) || releaseYear < 1800 || releaseYear > new Date().getFullYear())
            return res.status(400).send('⚠️ Invalid release year.');

        // Process image if uploaded
        const imageData = req.file ? {
            data: req.file.buffer,
            contentType: req.file.mimetype
        } : undefined;

        if (isEdit) {
            // Create update object
            const updateData = {
                title,
                producer,
                releaseYear,
                description
            };

            // Only update image if a new one was uploaded
            if (imageData)
                updateData.image = imageData;

            // Update existing movie
            MovieModel.findByIdAndUpdate(
                req.params.id,
                updateData,
                {new: true}
            )
                .then(updatedMovie => {
                    if (!updatedMovie) {
                        return res.status(404).send('⚠️ Movie not found.');
                    }
                    console.log('✅ Movie updated successfully:', updatedMovie.title);
                    res.redirect('/movies');
                })
                .catch(err => {
                    console.error('Error updating movie:', err);
                    next(err);
                });
        } else {
            // Create new movie
            const newMovie = new MovieModel({
                title,
                producer,
                releaseYear,
                description,
                image: imageData
            });

            newMovie.save()
                .then(savedMovie => {
                    console.log('✅ Movie saved successfully:', savedMovie.title);
                    res.redirect('/movies');
                })
                .catch(err => {
                    console.error('Error saving movie:', err);
                    next(err);
                });
        }
    };
};

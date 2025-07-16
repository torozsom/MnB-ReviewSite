/**
 * Saves a new book to the database or updates an existing one.
 *
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {

    /**
     * Validates book data from the request
     *
     * @param title - Book title
     * @param author - Book author
     * @param releaseYear - Book release year
     * @param description - Book description
     * @returns {string|null} - Error message or null if valid
     */
    function validateBookData(title, author, releaseYear, description) {
        // Validate required fields
        if (!title || !author || !releaseYear || !description)
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
     * Updates an existing book in the database
     *
     * @param bookId - ID of the book to update
     * @param updateData - Data to update
     * @returns {Promise<*>} - Promise resolving to the updated book
     */
    function updateExistingBook(bookId, updateData) {
        return objRepo.BookModel.findByIdAndUpdate(
            bookId,
            updateData,
            {new: true}
        )
            .then(updatedBook => {
                if (!updatedBook)
                    throw new Error('⚠️  Book not found.');

                console.log('✅  Book updated successfully:', updatedBook.title);
                return updatedBook;
            });
    }


    /**
     * Creates a new book in the database
     *
     * @param bookData - Data for the new book
     * @returns {Promise<*>} - Promise resolving to the saved book
     */
    function createNewBook(bookData) {
        const newBook = new objRepo.BookModel(bookData);
        return newBook.save()
            .then(savedBook => {
                console.log('✅  Book saved successfully:', savedBook.title);
                return savedBook;
            });
    }


    return (req, res, next) => {
        // Check if we're adding a new book or editing an existing one
        const isEdit = req.params.id !== undefined;

        // Only process if itemType is 'book' (for both add and edit forms)
        if (req.body.itemType !== 'book')
            return next();

        // Extract data from request body
        const title = req.body.title;
        const author = req.body.creator; // 'creator' is used in the form
        const releaseYear = parseInt(req.body.year);
        const description = req.body.description;

        // Validate book data
        const validationError = validateBookData(title, author, releaseYear, description);
        if (validationError)
            return res.status(400).send(validationError);

        // Process image if uploaded
        const imageData = processImageData(req);

        if (isEdit) {
            // Create update object
            const updateData = {
                title,
                author,
                releaseYear,
                description
            };

            // Only update image if a new one was uploaded
            if (imageData)
                updateData.image = imageData;

            // Update existing book
            updateExistingBook(req.params.id, updateData)
                .then(() => {
                    res.redirect('/books');
                })
                .catch(err => {
                    if (err.message === '⚠️  Book not found.')
                        return res.status(404).send(err.message);

                    console.error('Error updating book:', err);
                    next(err);
                });
        } else {
            // Create new book data object
            const bookData = {
                title,
                author,
                releaseYear,
                description,
                image: imageData
            };

            // Create and save new book
            createNewBook(bookData)
                .then(() => {
                    res.redirect('/books');
                })
                .catch(err => {
                    console.error('Error saving book:', err);
                    next(err);
                });
        }
    };

}

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
            return 'All fields are required.';

        // Validate release year
        if (isNaN(releaseYear) || releaseYear < 1800 || releaseYear > new Date().getFullYear())
            return 'Invalid release year.';

        return null;
    }


    /**
     * Updates an existing book in the database
     *
     * @param req The request object
     * @param res The response object
     * @param next The next middleware function
     * @param updateData The data to update the book with
     */
    function updateExistingBook(req, res, next, updateData) {
        objRepo.BookModel.findByIdAndUpdate(req.params.id, updateData, { new: true })
            .then(book => {
                if (!book)
                    return res.status(404).send('The book was not found.');
                console.log('Book updated successfully:', book.title);
                return res.redirect('/details/' + book._id);
            })
            .catch(err => {
                console.error('Error updating book:', err);
                return next(err);
            });
    }


    /**
     * Creates a new book in the database
     *
     * @param res The response object
     * @param next The next middleware function
     * @param bookData The data for the new book
     */
    function createNewBook(res, next, bookData) {
        const newBook = new objRepo.BookModel(bookData);
        newBook.save()
            .then(savedBook => {
                console.log('Book saved successfully:', savedBook.title);
                return res.redirect('/');
            })
            .catch(err => {
                console.error('Error saving book:', err);
                return next(err);
            });
    }


    return (req, res, next) => {
        if (req.body.itemType !== 'book')
            return next();

        // Validate image file
        if (req.fileValidationError)
            return res.status(400).send(req.fileValidationError);

        const title = req.body.title;
        const author = req.body.creator;
        const releaseYear = parseInt(req.body.year);
        const description = req.body.description;

        const validationError = validateBookData(title, author, releaseYear, description);
        if (validationError)
            return res.status(400).send(validationError);

        const isEdit = req.params.id !== undefined;
        const bookData = { title, author, releaseYear, description };

        // Upload image
        if (req.file)
            bookData.imageUrl = '/uploads/' + req.file.filename;

        // If there was an ID we edit, otherwise we create a new book
        if (isEdit)
            updateExistingBook(req, res, next, bookData);
        else
            createNewBook(res, next, bookData);
    };
}

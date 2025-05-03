/**
 * Saves a new book to the database or updates an existing one.
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    const BookModel = objRepo.BookModel;

    return (req, res, next) => {
        // Check if we're adding a new book or editing an existing one
        const isEdit = req.params.id !== undefined;

        // For add form, only process if itemType is 'book'
        if (!isEdit && req.body.itemType !== 'book')
            return next();

        // Extract data from request body
        const title = req.body.title;
        const author = req.body.creator; // In the form, it's called 'producer' for both books and movies
        const releaseYear = parseInt(req.body.year);
        const description = req.body.description;

        // Validate required fields
        if (!title || !author || !releaseYear || !description)
            return res.status(400).send('⚠️ All fields are required.');

        // Validate release year
        if (isNaN(releaseYear) || releaseYear < 1800 || releaseYear > new Date().getFullYear())
            return res.status(400).send('⚠️ Invalid release year.');

        if (isEdit) {
            BookModel.findByIdAndUpdate(
                req.params.id,
                {title, author, releaseYear, description},
                {new: true}
            )
                .then(updatedBook => {
                    if (!updatedBook)
                        return res.status(404).send('⚠️ Book not found.');

                    console.log('✅ Book updated successfully:', updatedBook.title);
                    res.redirect('/books');
                })
                .catch(err => {
                    console.error('Error updating book:', err);
                    next(err);
                });
        } else {
            // Create new book
            const newBook = new BookModel({
                title,
                author,
                releaseYear,
                description
            });

            newBook.save()
                .then(savedBook => {
                    console.log('✅ Book saved successfully:', savedBook.title);
                    res.redirect('/books');
                })
                .catch(err => {
                    console.error('Error saving book:', err);
                    next(err);
                });
        }
    };
};

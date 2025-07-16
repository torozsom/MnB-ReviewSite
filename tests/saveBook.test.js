const saveBookMiddleware = require('../middlewares/saveBook');


const mockBookModel = {
    findByIdAndUpdate: jest.fn(),
    prototype: {
        save: jest.fn()
    }
};


function MockBookModel(data) {
    this.title = data.title;
    this.author = data.author;
    this.releaseYear = data.releaseYear;
    this.description = data.description;
    this.image = data.image;
    this.save = mockBookModel.prototype.save;
}


MockBookModel.findByIdAndUpdate = mockBookModel.findByIdAndUpdate;

const objRepo = {BookModel: MockBookModel};


beforeEach(() => {
    jest.clearAllMocks();
    mockBookModel.findByIdAndUpdate.mockReset();
    mockBookModel.prototype.save.mockReset();
});


describe('saveBook middleware', () => {

    describe('validateBookData function', () => {
        const middleware = saveBookMiddleware(objRepo);

        test('should return error when fields are missing', () => {
            const req = {
                params: {},
                body: {
                    itemType: 'book',
                    title: 'Test Book',
                    creator: 'Test Author',
                    year: '2020'
                    // description is missing
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            const next = jest.fn();

            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.stringContaining('required'));
        });


        test('should return error when release year is invalid', () => {

            const req = {
                params: {},
                body: {
                    itemType: 'book',
                    title: 'Test Book',
                    creator: 'Test Author',
                    year: '1700', // Invalid year (too early)
                    description: 'Test description'
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
            const next = jest.fn();

            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Invalid release year'));
        });


        test('should pass validation with valid data', () => {
            const req = {
                params: {},
                body: {
                    itemType: 'book',
                    title: 'Test Book',
                    creator: 'Test Author',
                    year: '2020',
                    description: 'Test description'
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                redirect: jest.fn()
            };

            const next = jest.fn();

            mockBookModel.prototype.save.mockResolvedValue({title: 'Test Book'});
            middleware(req, res, next);

            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
        });
    });


    describe('processImageData function', () => {
        const middleware = saveBookMiddleware(objRepo);

        test('should process image data when file is present', () => {
            const req = {
                params: {},
                body: {
                    itemType: 'book',
                    title: 'Test Book',
                    creator: 'Test Author',
                    year: '2020',
                    description: 'Test description'
                },
                file: {
                    buffer: Buffer.from('test image'),
                    mimetype: 'image/jpeg'
                }
            };

            const res = {redirect: jest.fn()};
            const next = jest.fn();

            mockBookModel.prototype.save.mockResolvedValue({
                title: 'Test Book'
            });

            middleware(req, res, next);

            expect(mockBookModel.prototype.save).toHaveBeenCalled();
            const saveCall = mockBookModel.prototype.save.mock.instances[0];
            expect(saveCall).toBeDefined();
        });


        test('should not process image data when file is not present', () => {
            const req = {
                params: {},
                body: {
                    itemType: 'book',
                    title: 'Test Book',
                    creator: 'Test Author',
                    year: '2020',
                    description: 'Test description'
                }
                // No file property
            };

            const res = {
                redirect: jest.fn()
            };

            const next = jest.fn();

            mockBookModel.prototype.save.mockResolvedValue({title: 'Test Book'});
            middleware(req, res, next);

            // Verify that the save method was called without image data
            expect(mockBookModel.prototype.save).toHaveBeenCalled();
        });
    });


    describe('createNewBook function', () => {
        const middleware = saveBookMiddleware(objRepo);

        test('should create a new book and redirect', () => {
            const req = {
                params: {},
                body: {
                    itemType: 'book',
                    title: 'Test Book',
                    creator: 'Test Author',
                    year: '2020',
                    description: 'Test description'
                }
            };

            const res = {redirect: jest.fn()};
            const next = jest.fn();

            mockBookModel.prototype.save.mockImplementation(function () {
                return Promise.resolve({
                    title: this.title
                });
            });

            middleware(req, res, next);

            return new Promise(process.nextTick).then(() => {
                expect(mockBookModel.prototype.save).toHaveBeenCalled();
                expect(res.redirect).toHaveBeenCalledWith('/books');
            });
        });


        test('should handle errors when creating a book', () => {
            const req = {
                params: {},
                body: {
                    itemType: 'book',
                    title: 'Test Book',
                    creator: 'Test Author',
                    year: '2020',
                    description: 'Test description'
                }
            };

            const res = {};
            const next = jest.fn();

            const error = new Error('Database error');
            mockBookModel.prototype.save.mockImplementation(() => {
                return Promise.reject(error);
            });

            middleware(req, res, next);

            return new Promise(process.nextTick).then(() => {
                expect(mockBookModel.prototype.save).toHaveBeenCalled();
                expect(next).toHaveBeenCalledWith(error);
            });
        });
    });


    describe('updateExistingBook function', () => {
        const middleware = saveBookMiddleware(objRepo);

        test('should update an existing book and redirect', () => {
            const req = {
                params: {
                    id: '123456789012'
                },
                body: {
                    itemType: 'book',
                    title: 'Updated Book',
                    creator: 'Updated Author',
                    year: '2021',
                    description: 'Updated description'
                }
            };

            const res = {redirect: jest.fn()};
            const next = jest.fn();

            MockBookModel.findByIdAndUpdate.mockImplementation(() => {
                return Promise.resolve({
                    title: 'Updated Book'
                });
            });

            middleware(req, res, next);

            return new Promise(process.nextTick).then(() => {
                expect(MockBookModel.findByIdAndUpdate).toHaveBeenCalledWith(
                    '123456789012',
                    expect.objectContaining({
                        title: 'Updated Book',
                        author: 'Updated Author',
                        releaseYear: 2021,
                        description: 'Updated description'
                    }),
                    {new: true}
                );
                expect(res.redirect).toHaveBeenCalledWith('/books');
            });
        });


        test('should handle book not found error', () => {
            const req = {
                params: {
                    id: 'nonexistent'
                },
                body: {
                    itemType: 'book',
                    title: 'Updated Book',
                    creator: 'Updated Author',
                    year: '2021',
                    description: 'Updated description'
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            const next = jest.fn();

            MockBookModel.findByIdAndUpdate.mockImplementation(() => {
                return Promise.resolve(null);
            });

            middleware(req, res, next);

            return new Promise(process.nextTick).then(() => {
                expect(MockBookModel.findByIdAndUpdate).toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Book not found'));
            });
        });


        test('should handle errors when updating a book', () => {
            const req = {
                params: {
                    id: '123456789012'
                },
                body: {
                    itemType: 'book',
                    title: 'Updated Book',
                    creator: 'Updated Author',
                    year: '2021',
                    description: 'Updated description'
                }
            };

            const res = {};
            const next = jest.fn();
            const error = new Error('Database error');
            MockBookModel.findByIdAndUpdate.mockImplementation(() => {
                return Promise.reject(error);
            });

            middleware(req, res, next);

            return new Promise(process.nextTick).then(() => {
                expect(MockBookModel.findByIdAndUpdate).toHaveBeenCalled();
                expect(next).toHaveBeenCalledWith(error);
            });
        });


        test('should update a book with a new image', () => {
            const req = {
                params: {
                    id: '123456789012'
                },
                body: {
                    itemType: 'book',
                    title: 'Updated Book with Image',
                    creator: 'Updated Author',
                    year: '2021',
                    description: 'Updated description'
                },
                file: {
                    buffer: Buffer.from('test image'),
                    mimetype: 'image/jpeg'
                }
            };
            const res = {redirect: jest.fn()};
            const next = jest.fn();

            MockBookModel.findByIdAndUpdate.mockImplementation(() => {
                return Promise.resolve({
                    title: 'Updated Book with Image'
                });
            });

            middleware(req, res, next);

            return new Promise(process.nextTick).then(() => {
                expect(MockBookModel.findByIdAndUpdate).toHaveBeenCalledWith(
                    '123456789012',
                    expect.objectContaining({
                        title: 'Updated Book with Image',
                        author: 'Updated Author',
                        releaseYear: 2021,
                        description: 'Updated description',
                        image: expect.objectContaining({
                            data: expect.any(Buffer),
                            contentType: 'image/jpeg'
                        })
                    }),
                    {new: true}
                );
                expect(res.redirect).toHaveBeenCalledWith('/books');
            });
        });
    });


    test('should skip processing for non-book items', () => {
        const middleware = saveBookMiddleware(objRepo);
        const req = {
            params: {},
            body: {
                itemType: 'movie' // Not a book
            }
        };

        const res = {};
        const next = jest.fn();

        middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(mockBookModel.prototype.save).not.toHaveBeenCalled();
        expect(mockBookModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

});

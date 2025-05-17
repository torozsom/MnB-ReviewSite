const deleteItemMiddleware = require('../middlewares/deleteItem');


const mockBookModel = {findByIdAndDelete: jest.fn()};
const mockMovieModel = {findByIdAndDelete: jest.fn()};
const mockCommentModel = {deleteMany: jest.fn()};


const objRepo = {
    BookModel: mockBookModel,
    MovieModel: mockMovieModel,
    CommentModel: mockCommentModel
};


beforeEach(() => {
    jest.clearAllMocks();
    mockBookModel.findByIdAndDelete.mockReset();
    mockMovieModel.findByIdAndDelete.mockReset();
    mockCommentModel.deleteMany.mockReset();
});


describe('deleteItem middleware', () => {

    describe('validateItemId function', () => {
        const middleware = deleteItemMiddleware(objRepo);

        test('should return error when item ID is missing', () => {
            const req = {
                params: {} // No ID provided
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            const next = jest.fn();

            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(expect.stringContaining('ID is required'));
        });


        test('should pass validation with valid item ID', () => {
            const req = {
                params: {
                    id: '123456789012'
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                redirect: jest.fn()
            };

            const next = jest.fn();

            mockBookModel.findByIdAndDelete.mockResolvedValue({
                title: 'Test Book',
                _id: '123456789012'
            });

            mockCommentModel.deleteMany.mockResolvedValue({deletedCount: 2});

            middleware(req, res, next);

            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
        });
    });


    describe('deleteBook function', () => {
        const middleware = deleteItemMiddleware(objRepo);

        test('should delete a book and its comments successfully', async () => {
            const req = {
                params: {
                    id: '123456789012'
                }
            };

            const res = {
                redirect: jest.fn()
            };

            const next = jest.fn();

            mockBookModel.findByIdAndDelete.mockResolvedValue({
                title: 'Test Book',
                _id: '123456789012'
            });

            mockCommentModel.deleteMany.mockResolvedValue({
                deletedCount: 2
            });

            middleware(req, res, next);

            await new Promise(process.nextTick);

            expect(mockBookModel.findByIdAndDelete).toHaveBeenCalledWith('123456789012');
            expect(mockCommentModel.deleteMany).toHaveBeenCalledWith({
                _assignedTo: '123456789012',
                onModel: 'Book'
            });
            expect(res.redirect).toHaveBeenCalledWith('/');
        });


        test('should handle book not found and try to delete as movie', async () => {
            const req = {
                params: {
                    id: '123456789012'
                }
            };

            const res = {
                redirect: jest.fn(),
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            const next = jest.fn();

            mockBookModel.findByIdAndDelete.mockResolvedValue(null);

            mockMovieModel.findByIdAndDelete.mockResolvedValue({
                title: 'Test Movie',
                _id: '123456789012'
            });

            mockCommentModel.deleteMany.mockResolvedValue({
                deletedCount: 3
            });

            middleware(req, res, next);

            await new Promise(process.nextTick);

            expect(mockBookModel.findByIdAndDelete).toHaveBeenCalledWith('123456789012');
            expect(mockMovieModel.findByIdAndDelete).toHaveBeenCalledWith('123456789012');
            expect(mockCommentModel.deleteMany).toHaveBeenCalledWith({
                _assignedTo: '123456789012',
                onModel: 'Movie'
            });
            expect(res.redirect).toHaveBeenCalledWith('/');
        });


        test('should handle error when deleting a book', async () => {
            const req = {
                params: {
                    id: '123456789012'
                }
            };

            const res = {};
            const next = jest.fn();
            const error = new Error('Database error');

            mockBookModel.findByIdAndDelete.mockRejectedValue(error);

            middleware(req, res, next);

            await new Promise(process.nextTick);

            expect(mockBookModel.findByIdAndDelete).toHaveBeenCalledWith('123456789012');
            expect(next).toHaveBeenCalledWith(error);
        });
    });


    describe('deleteMovie function', () => {
        const middleware = deleteItemMiddleware(objRepo);

        test('should handle error when deleting a movie', async () => {
            const req = {
                params: {
                    id: '123456789012'
                }
            };

            const res = {};
            const next = jest.fn();
            const error = new Error('Database error');

            mockBookModel.findByIdAndDelete.mockResolvedValue(null);

            mockMovieModel.findByIdAndDelete.mockRejectedValue(error);

            middleware(req, res, next);

            await new Promise(process.nextTick);

            expect(mockBookModel.findByIdAndDelete).toHaveBeenCalledWith('123456789012');
            expect(mockMovieModel.findByIdAndDelete).toHaveBeenCalledWith('123456789012');
            expect(next).toHaveBeenCalledWith(error);
        });


        test('should handle item not found (neither book nor movie)', async () => {
            const req = {
                params: {
                    id: '123456789012'
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            const next = jest.fn();

            mockBookModel.findByIdAndDelete.mockResolvedValue(null);

            mockMovieModel.findByIdAndDelete.mockResolvedValue(null);

            middleware(req, res, next);

            await new Promise(process.nextTick);

            expect(mockBookModel.findByIdAndDelete).toHaveBeenCalledWith('123456789012');
            expect(mockMovieModel.findByIdAndDelete).toHaveBeenCalledWith('123456789012');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Item not found'));
        });
    });


    describe('deleteComments function', () => {
        const middleware = deleteItemMiddleware(objRepo);

        test('should handle error when deleting comments', async () => {
            const req = {
                params: {
                    id: '123456789012'
                }
            };

            const res = {
                redirect: jest.fn()
            };

            const next = jest.fn();
            const error = new Error('Database error');

            mockBookModel.findByIdAndDelete.mockResolvedValue({
                title: 'Test Book',
                _id: '123456789012'
            });

            mockCommentModel.deleteMany.mockRejectedValue(error);

            middleware(req, res, next);

            await new Promise(process.nextTick);

            expect(mockBookModel.findByIdAndDelete).toHaveBeenCalledWith('123456789012');
            expect(mockCommentModel.deleteMany).toHaveBeenCalledWith({
                _assignedTo: '123456789012',
                onModel: 'Book'
            });

            expect(res.redirect).toHaveBeenCalledWith('/');
        });
    });

});
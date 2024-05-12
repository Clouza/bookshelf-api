import BookshelfController from './controller/BookshelfController.js';

/**
 * Daftar routes Bookshelf API
 * 
 * POST /books
 * GET /books
 * 
 * GET /books/{bookId}
 * PUT /books/{bookId}
 * DELETE /books/{bookId}
 */
const routes = [
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            const bookshelfController = new BookshelfController(request, h);
            return bookshelfController.status(200).content({
                message: 'Velkommen! Bookshelf API'
            }).send();
        }
    },
    {
        method: 'POST',
        path: '/books',
        handler: (request, h) => new BookshelfController(request, h).addNewBook()
    },
    {
        method: 'GET',
        path: '/books',
        handler: (request, h) => new BookshelfController(request, h).getBooks()
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: (request, h) => new BookshelfController(request, h).getBook()
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: (request, h) => new BookshelfController(request, h).updateBook()
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: (request, h) => new BookshelfController(request, h).deleteBook()
    },
    {
        method: '*',
        path: '/{any*}',
        handler: () => {
            return 'Route not found.';
        }
    }
];

export default routes;
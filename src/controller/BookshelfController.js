import { nanoid } from 'nanoid';

import HttpController from './HttpController.js';
import bookshelf from '../model/Bookshelf.js';
import HttpRequestError from '../exception/HttpRequestError.js';

class BookshelfController extends HttpController {
    constructor(request, h) {
        super(request, h);
        this.request = request;
        this.h = h;

        this.httpCodeError = 500;
    }

    addNewBook() {
        try {
            const { name, year, author, summary, publisher, pageCount, readPage, reading } = this.request.payload;

            if (name == undefined) {
                this.httpCodeError = 400;
                throw new HttpRequestError('Gagal menambahkan buku. Mohon isi nama buku');
            }

            if (readPage > pageCount) {
                this.httpCodeError = 400;
                throw new HttpRequestError('Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount');
            }

            const id = nanoid(16);
            const finished = readPage == pageCount;
            const insertedAt = new Date().toISOString();
            const updatedAt = insertedAt;
            const book = {
                id,
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                finished,
                reading,
                insertedAt,
                updatedAt
            };

            bookshelf.push(book);
            const save = bookshelf.filter((book) => book.id === id).length > 0;

            if (!save) {
                this.httpCodeError = 400;
                throw new HttpRequestError('Gagal menambahkan buku. Buku sudah ada');
            }

            const data = {
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id
                }
            };

            return this.send(data, 201);
        } catch (err) {
            return new HttpRequestError(err.message, this.httpCodeError).httpResponse(this.h);
        }
    }

    getBooks() {
        const { name, finished, reading  } = this.request.query;
        let books;

        if (name != undefined) {
            books = bookshelf.filter(book => book.name.toLowerCase().includes(name.toLowerCase()));
        }

        if (finished != undefined && finished == 1) {
            books = bookshelf.filter(book => book.finished);
        }

        if (finished != undefined && finished == 0) {
            books = bookshelf.filter(book => !book.finished);
        }

        if (reading != undefined && reading == 1) {
            books = bookshelf.filter(book => book.reading);
        }

        if (reading != undefined && reading == 0) {
            books = bookshelf.filter(book => !book.reading);
        }

        if (name != undefined || finished != undefined || reading != undefined) {
            books = books.map(book => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }));
        } else {
            books = bookshelf.map(book => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }));
        }

        return this.send({
            status: 'success',
            data: {
                books
            }
        });
    }

    getBook() {
        try {
            const { bookId } = this.request.params;
            const book = bookshelf.filter((book) => book.id === bookId)[0];

            if (book == undefined) {
                this.httpCodeError = 404;
                throw new HttpRequestError('Buku tidak ditemukan');
            }

            const data = {
                status: 'success',
                data: {
                    book
                }
            };

            return this.send(data);
        } catch (err) {
            return new HttpRequestError(err.message, this.httpCodeError).httpResponse(this.h);
        }
    }

    updateBook() {
        try {
            const { bookId } = this.request.params;
            const { name, year, author, summary, publisher, pageCount, readPage, reading } = this.request.payload;

            if (name == undefined) {
                this.httpCodeError = 400;
                throw new HttpRequestError('Gagal memperbarui buku. Mohon isi nama buku');
            }

            if (readPage > pageCount) {
                this.httpCodeError = 400;
                throw new HttpRequestError('Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount');
            }

            const index = bookshelf.findIndex((book) => book.id === bookId);
            if (index != -1) {
                bookshelf[index].updatedAt = new Date().toISOString();
                bookshelf[index] = {
                    ...bookshelf[index],
                    name,
                    year,
                    author,
                    summary,
                    publisher,
                    pageCount,
                    readPage,
                    reading
                };
            } else {
                this.httpCodeError = 404;
                throw new HttpRequestError('Gagal memperbarui buku. Id tidak ditemukan');
            }
        } catch (err) {
            return new HttpRequestError(err.message, this.httpCodeError).httpResponse(this.h);
        }

        return this.send({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        });
    }

    deleteBook() {
        try {
            const { bookId } = this.request.params;
            const index = bookshelf.findIndex((book) => book.id === bookId);

            if (index == undefined) {
                this.httpCodeError = 404;
                throw new HttpRequestError('Gagal memperbarui buku. Id tidak ditemukan');
            }

            if (index !== -1) {
                bookshelf.splice(index, 1);
                const data = this.h.response({
                    status: 'success',
                    message: 'Buku berhasil dihapus'
                }).code(200);

                return this.send(data);
            } else {
                this.httpCodeError = 404;
                throw new HttpRequestError('Buku gagal dihapus. Id tidak ditemukan');
            }
        } catch (err) {
            return new HttpRequestError(err.message, this.httpCodeError).httpResponse(this.h);
        }
    }
}

export default BookshelfController;
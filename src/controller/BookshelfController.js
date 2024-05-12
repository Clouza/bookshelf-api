import { nanoid } from 'nanoid';

import HttpController from './HttpController.js';
import bookshelf from '../model/Bookshelf.js';
import HttpRequestError from '../exception/HttpRequestError.js';

class BookshelfController extends HttpController {
    constructor(request, h) {
        super(request, h);
        this.request = request;
        this.h = h;
    }

    addBook() {
        try {
            const { name, year, author, summary, publisher, pageCount, readPage, reading } = this.request.payload;

            if (name == undefined) {
                throw new HttpRequestError('Gagal menambahkan buku. Mohon isi nama buku', 400);
            }

            if (readPage > pageCount) {
                throw new HttpRequestError('Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount', 400);
            }

            const id = nanoid(16);
            const finished = false;
            const insertedAt = new Date().toISOString();
            const updateAt = insertedAt;
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
                updateAt
            };

            bookshelf.push(book);
            const save = bookshelf.filter((book) => book.id === id).length > 0;

            if (!save) {
                throw new HttpRequestError('Gagal menambahkan buku. Buku sudah ada', 400);
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
            return new HttpRequestError(err).httpResponse(this.h);
        }
    }

    getBooks() {
        return this.send({
            status: 'success',
            data: {
                books: bookshelf
            }
        });
    }

    getBook() {
        try {
            const { bookId } = this.request.params;
            const book = bookshelf.filter((book) => book.id === bookId)[0];

            if (book == undefined) {
                throw new HttpRequestError('Buku tidak ditemukan', 404);
            }

            const data = {
                status: 'success',
                data: {
                    book
                }
            };

            return this.send(data);
        } catch (err) {
            return new HttpRequestError(err).httpResponse(this.h);
        }
    }

    updateBook() {
        try {
            const { bookId } = this.request.params;
            const { name, year, author, summary, publisher, pageCount, readPage, reading } = this.request.payload;

            if (name == undefined) {
                throw new HttpRequestError('Gagal memperbarui buku. Mohon isi nama buku', 400);
            }

            if (readPage > pageCount) {
                throw new HttpRequestError('Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount', 400);
            }

            if (bookId == undefined) {
                throw new HttpRequestError('Gagal memperbarui buku. Id tidak ditemukan', 404);
            }

            const updatedAt = new Date().toISOString();
            const index = books.findIndex((book) => book.id === id);

            if (index !== -1) {
                books[index] = {
                    ...books[index],
                    name,
                    year,
                    author,
                    summary,
                    publisher,
                    pageCount,
                    readPage,
                    reading,
                    updatedAt
                };
            } else {
                throw new HttpRequestError('Gagal memperbarui buku. Id tidak ditemukan', 404);
            }

            this.send({
                status: 'success',
                message: 'Buku berhasil diperbarui'
            }).code(200);
        } catch (err) {
            return new HttpRequestError(err).httpResponse(this.h);
        }
    }

    deleteBook() {
        try {
            const { bookId } = this.request.params;
            const index = books.findIndex((book) => book.id === id);

            if (bookId == undefined) {
                throw new HttpRequestError('Gagal memperbarui buku. Id tidak ditemukan', 404);
            }

            if (index !== -1) {
                books.splice(index, 1);
                const data = h.response({
                    status: 'success',
                    message: 'Buku berhasil dihapus'
                }).code(200);

                return this.send(data);
            }

        } catch (err) {
            return new HttpRequestError(err).httpResponse(this.h);
        }
    }
}

export default BookshelfController;
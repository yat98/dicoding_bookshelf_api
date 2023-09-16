/* eslint-disable max-len */
import {nanoid} from 'nanoid';
import books from '../models/book.js';

const index = (req, h) => {
  const {name, reading, finished} = req.query;
  let newBooks = books;

  if (name !== undefined) {
    newBooks = newBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    newBooks = newBooks.filter((book) => book.reading === (reading === '1'));
  }

  if (finished !== undefined) {
    newBooks = newBooks.filter((book) => book.finished === (finished === '1'));
  }

  return h.response({
    status: 'success',
    data: {
      books: newBooks.map((book) => {
        const {id, name, publisher} = book;
        return {id, name, publisher};
      }),
    },
  }).code(200);
};

const show = (req, h) => {
  const {id} = req.params;
  const book = books.filter((book) => book.id === id)[0];

  if (book !== undefined) {
    return h.response({
      status: 'success',
      data: {
        book,
      },
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
};

const store = (req, h) => {
  const id = nanoid(16);
  const {
    name, year, author, summary,
    publisher, pageCount, readPage, reading,
  } = req.payload;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  books.push({
    id, name, year, author,
    summary, publisher, pageCount, readPage,
    finished, reading, insertedAt, updatedAt,
  });

  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  }).code(201);
};

const update = (req, h) => {
  const {id} = req.params;
  const {
    name, year, author, summary,
    publisher, pageCount, readPage, reading,
  } = req.payload;
  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;
  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex !== -1) {
    books[bookIndex] = {
      ...books[bookIndex],
      name, year, author, summary, publisher,
      pageCount, readPage, finished, reading, updatedAt,
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};

const destroy = (req, h) => {
  const {id} = req.params;
  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

export default {
  index,
  show,
  store,
  update,
  destroy,
};

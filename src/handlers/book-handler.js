import {nanoid} from 'nanoid';
import books from '../models/book.js';

const store = (req, h) => {
  const id = nanoid(16);
  const {
    name, year, author, summary,
    publisher, pageCount, readPage, reading,
  } = req.params;
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

export default {
  store,
};
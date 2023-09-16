/* eslint-disable max-len */
import {nanoid} from 'nanoid';
import server from '../src/app/server.js';
import books from '../src/models/book.js';

const payload = {
  name: 'Buku A',
  year: 2010,
  author: 'John Doe',
  summary: 'Lorem ipsum dolor sit amet',
  publisher: 'Dicoding Indonesia',
  pageCount: 100,
  readPage: 25,
  reading: false,
};

const payloadUpdate = {
  name: 'Buku B',
  year: 2011,
  author: 'James Doe',
  summary: 'Ipsum dolor sit lorem',
  publisher: 'Dicoding ID',
  pageCount: 120,
  readPage: 35,
  reading: true,
};

const addBook = () => {
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = payload.pageCount === payload.readPage;
  books.push({
    ...payload,
    id,
    finished,
    insertedAt,
    updatedAt,
  });
};

const removeAllBook = () => {
  while (books.length > 0) {
    books.pop();
  }
};

describe('Books feature: ', () => {
  let request;

  beforeAll(async () => {
    request = await server.init();
  });

  afterAll(async () => {
    await request.stop();
  });

  describe('POST /books', () => {
    it('should success add book', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/books',
        payload,
      });

      expect(response.statusCode).toBe(201);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.data).toBeDefined();
      expect(response.result.data.bookId).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('Buku berhasil ditambahkan');
    });

    it('should success add book when finished reading', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/books',
        payload: {
          name: 'Book A',
          year: 2010,
          author: 'John Doe',
          summary: 'Lorem ipsum dolor sit amet',
          publisher: 'Dicoding Indonesia',
          pageCount: 100,
          readPage: 100,
          reading: false,
        },
      });

      expect(response.statusCode).toBe(201);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.data).toBeDefined();
      expect(response.result.data.bookId).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('Buku berhasil ditambahkan');
    });

    it('should reject add book when name is empty', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/books',
        payload: {
          year: 2010,
          author: 'John Doe',
          summary: 'Lorem ipsum dolor sit amet',
          publisher: 'Dicoding Indonesia',
          pageCount: 100,
          readPage: 25,
          reading: false,
        },
      });

      expect(response.statusCode).toBe(400);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('Gagal menambahkan buku. Mohon isi nama buku');
    });

    it('should reject add book when readPage greater than pageCount', async () => {
      const response = await request.inject({
        method: 'POST',
        url: '/books',
        payload: {
          name: 'Book A',
          year: 2010,
          author: 'John Doe',
          summary: 'Lorem ipsum dolor sit amet',
          publisher: 'Dicoding Indonesia',
          pageCount: 100,
          readPage: 101,
          reading: false,
        },
      });

      expect(response.statusCode).toBe(400);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount');
    });
  });

  describe('GET /books', () => {
    it('should success get list books', async () => {
      const response = await request.inject({
        method: 'GET',
        url: '/books',
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.result.status).toBeDefined();
      expect(response.result.data).toBeDefined();
      expect(response.result.data.books).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.books[0]).toHaveProperty('id');
      expect(response.result.data.books[0]).toHaveProperty('name');
      expect(response.result.data.books[0]).toHaveProperty('publisher');
      expect(response.result.data.books[0].name).toBe(payload.name);
      expect(response.result.data.books[0].publisher).toBe(payload.publisher);
    });

    it('should success get empty list books', async () => {
      removeAllBook();
      const response = await request.inject({
        method: 'GET',
        url: '/books',
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.result.status).toBeDefined();
      expect(response.result.data).toBeDefined();
      expect(response.result.data.books).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.books).toEqual([]);
    });
  });

  describe('GET /books/{id}', () => {
    it('should success get detail book', async () => {
      addBook();
      console.log(books);
      const response = await request.inject({
        method: 'GET',
        url: `/books/${books[0].id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.result.status).toBeDefined();
      expect(response.result.data).toBeDefined();
      expect(response.result.data.book).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.data.book.name).toBe(payload.name);
      expect(response.result.data.book.year).toBe(payload.year);
      expect(response.result.data.book.author).toBe(payload.author);
      expect(response.result.data.book.summary).toBe(payload.summary);
      expect(response.result.data.book.publisher).toBe(payload.publisher);
      expect(response.result.data.book.pageCount).toBe(payload.pageCount);
      expect(response.result.data.book.readPage).toBe(payload.readPage);
      expect(response.result.data.book.reading).toBe(payload.reading);
    });

    it('should return 404 when book not exists', async () => {
      removeAllBook();
      const response = await request.inject({
        method: 'GET',
        url: '/books/invalidid',
      });

      expect(response.statusCode).toBe(404);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('Buku tidak ditemukan');
    });
  });

  describe('PUT /books', () => {
    it('should success update book', async () => {
      addBook();
      const response = await request.inject({
        method: 'PUT',
        url: `/books/${books[0].id}`,
        payload: payloadUpdate,
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('success');
      expect(response.result.message).toBe('Buku berhasil diperbarui');
    });

    it('should return 404 when book is not exists', async () => {
      const response = await request.inject({
        method: 'PUT',
        url: '/books/invalidid',
        payload: payloadUpdate,
      });

      expect(response.statusCode).toBe(404);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('Gagal memperbarui buku. Id tidak ditemukan');
    });

    it('should reject update book when name is empty', async () => {
      const response = await request.inject({
        method: 'PUT',
        url: `/books/${books[0].id}`,
        payload: {
          year: 2010,
          author: 'John Doe',
          summary: 'Lorem ipsum dolor sit amet',
          publisher: 'Dicoding Indonesia',
          pageCount: 100,
          readPage: 25,
          reading: false,
        },
      });

      expect(response.statusCode).toBe(400);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('Gagal memperbarui buku. Mohon isi nama buku');
    });

    it('should reject update book when readPage greater than pageCount', async () => {
      const response = await request.inject({
        method: 'PUT',
        url: `/books/${books[0].id}`,
        payload: {
          name: 'Book A',
          year: 2010,
          author: 'John Doe',
          summary: 'Lorem ipsum dolor sit amet',
          publisher: 'Dicoding Indonesia',
          pageCount: 100,
          readPage: 101,
          reading: false,
        },
      });

      expect(response.statusCode).toBe(400);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.result.status).toBeDefined();
      expect(response.result.message).toBeDefined();
      expect(response.result.status).toBe('fail');
      expect(response.result.message).toBe('Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount');
    });
  });
});

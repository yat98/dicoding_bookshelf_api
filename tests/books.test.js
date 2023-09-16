/* eslint-disable max-len */
import server from '../src/app/server.js';
import books from '../src/models/book.js';

const removeAllBook = () => {
  while (books.length > 0) {
    books.pop();
  }
};

describe('Books feature: ', () => {
  let request;
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
});

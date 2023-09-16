/* eslint-disable max-len */
import bookHandler from '../handlers/book-handler.js';
import {storeBookValidation, updateBookValidation} from '../validations/book-validation.js';

const bookRoutes = [
  {
    method: 'POST',
    path: '/books',
    handler: bookHandler.store,
    options: {
      validate: storeBookValidation,
    },
  },
  {
    method: 'GET',
    path: '/books',
    handler: bookHandler.index,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: bookHandler.show,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: bookHandler.update,
    options: {
      validate: updateBookValidation,
    },
  },
];

export default bookRoutes;

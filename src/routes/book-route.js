import bookHandler from '../handlers/book-handler.js';
import {storeBookValidation} from '../validations/book-validation.js';

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
];

export default bookRoutes;

/* c8 ignore next */
import 'dotenv/config';
import Hapi from '@hapi/hapi';
import bookRoutes from '../routes/book-route.js';

const host = process.env.HOST;
const port = process.env.PORT;

const server = Hapi.server({
  host,
  port,
  routes: {
    cors: {
      origin: [
        '*',
      ],
    },
  },
});

server.route([
  ...bookRoutes,
]);

/* c8 ignore next 9 */
const init = async () => {
  await server.initialize();
  return server;
};

const start = async () => {
  await server.start();
  console.info(`Server start listen on ${server.info.uri}`);
};

export default {
  init,
  start,
};


import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';

dotenv.config();
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


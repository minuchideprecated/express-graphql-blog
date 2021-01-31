import { createServer, runServer } from './app';

const run = () => {
  const { app } = createServer();

  runServer(app);
};

run();

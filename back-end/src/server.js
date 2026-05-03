import app from './app.js';
import { PORT } from './config/env.js';

const port = PORT || 3000;

const server = app.listen(port, () => {
  console.log(`server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${port}/health`);
});

// shutdown handlers
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION — shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION — shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

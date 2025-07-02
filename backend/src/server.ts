import http from 'http';
import https from 'https';
import fs from 'fs';
import app from './app';
import { env } from './config/env';
import logger from './config/logger';
import { connectDB, disconnectDB } from './config/db';

function createHttpServer() {
  const { SSL_KEY_PATH, SSL_CERT_PATH } = env;

  if (
    SSL_KEY_PATH &&
    SSL_CERT_PATH &&
    fs.existsSync(SSL_KEY_PATH) &&
    fs.existsSync(SSL_CERT_PATH)
  ) {
    const key  = fs.readFileSync(SSL_KEY_PATH);
    const cert = fs.readFileSync(SSL_CERT_PATH);
    logger.info('🔒  Starting HTTPS server');
    return https.createServer({ key, cert }, app);
  } else if (SSL_KEY_PATH || SSL_CERT_PATH) {
    logger.warn(
      'SSL_KEY_PATH or SSL_CERT_PATH set but files not found; falling back to HTTP'
    );
  }

  logger.info('🌐  Starting plain HTTP server');
  return http.createServer(app);
}

const server = createHttpServer();

async function start() {
  try {
    await connectDB();
    logger.info('✅  Database connected');

    server.listen(env.PORT, () => {
      logger.info(`🚀  API ready at http://localhost:${env.PORT} (${env.NODE_ENV})`);
    });
  } catch (err) {
    logger.error(err, '❌  Failed to start server');
    process.exit(1);
  }
}


function shutdown(code = 0) {
  logger.info('🛑  Shutting down server…');

  server.close(async () => {
    logger.info('HTTP server closed');
    try {
      await disconnectDB();
      logger.info('✅  Database disconnected');
    } catch (err) {
      logger.error(err, 'Error during database disconnect');
    } finally {
      process.exit(code);
    }
  });
}


process.on('SIGINT',  () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));            // e.g. Docker, Kubernetes
process.on('uncaughtException', (err) => {
  logger.error(err, '❌  Uncaught Exception');
  shutdown(1);
});
process.on('unhandledRejection', (reason) => {
  logger.error(reason, '❌  Unhandled Rejection');

});

start();

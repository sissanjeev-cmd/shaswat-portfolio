import { createApp } from './app';
import { logger } from './lib/logger';

const PORT = process.env.PORT ?? 3001;
const app = createApp();

app.listen(PORT, () => {
  logger.info({ port: PORT }, 'API server started');
});

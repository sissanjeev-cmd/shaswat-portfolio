import type { IncomingMessage, ServerResponse } from 'http';

let appPromise: Promise<(req: IncomingMessage, res: ServerResponse) => void>;

function getApp() {
  if (!appPromise) {
    appPromise = Promise.resolve().then(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { createApp } = require('../src/app');
      return createApp();
    });
  }
  return appPromise;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const app = await getApp();
    app(req, res);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Initialization failed', detail: message }));
  }
}

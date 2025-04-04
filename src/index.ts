import { Hono } from 'hono'
import { ImageResponse } from 'workers-og';

const app = new Hono();

app.get('/', (c) => {
  return invalidImageResponse();
});

app.get('/color', (c) => {
  const rgb = c.req.queries('rgb');
  if (!rgb) return invalidImageResponse();
  const html = `<div style="display: flex; height: 100vh; width: 100vw; background: #${rgb[0]};"></div>`;
  return new ImageResponse(html, {width: 24, height: 24});
});

const invalidImageResponse = (): ImageResponse => {
  const html = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; width: 100vw; font-family: sans-serif; background: #000000">
      <div style="display: flex; font-size: 256px; margin: 0; font-weight: 700; color: #FFFFFF">?</div>
    </div>
 `;
  return new ImageResponse(html, {width: 64, height: 64});
}

export default app;

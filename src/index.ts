import { Hono } from 'hono'
import { ImageResponse } from 'workers-og';

const app = new Hono();

app.get('/', (c) => {
  return invalidImageResponse();
});

const invalidImageResponse = (): ImageResponse => {
  const html = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; width: 100vw; font-family: sans-serif; background: #000000">
      <div style="display: flex; font-size: 256px; margin: 0; font-weight: 700; color: #FFFFFF">?</div>
    </div>
 `;
  return new ImageResponse(html, {width: 320, height: 320});
}

export default app;

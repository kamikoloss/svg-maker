import { Hono } from 'hono'
import { ImageResponse } from 'workers-og';

const app = new Hono();

const rootDivStyle = `
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  font-family: sans-serif;
`;

app.get('/', (c) => {
  return invalidImageResponse();
});

app.get('/color', (c) => {
  const rgb = c.req.queries('rgb');
  if (!rgb) return invalidImageResponse();
  const html = `<div style="display: flex; height: 100vh; width: 100vw; background: #${rgb[0]};"></div>`;
  return new ImageResponse(html, {width: 24, height: 24});
});

app.get('/until', (c) => {
  const date = c.req.queries('date');
  if (!date) return invalidImageResponse();
  const dayCount = Math.floor((Date.parse(date[0]) - Date.now()) / (1000 * 60 * 60 * 24));
  const html = /*html*/`
    <div style="${rootDivStyle} background: #000000; color: #FFFFFF;">
      <div style="display: flex; flex-direction: column; align-items: center; gap: -16px;">
        <p style="font-size: 128px;">${dayCount}</p>
        <p style="font-size: 32px;">days until</p>
        <p style="font-size: 32px;">${date}</p>
      </div>
    </div>
  `;
  return new ImageResponse(html, {width: 320, height: 320});
});

const invalidImageResponse = (): ImageResponse => {
  const html = /*html*/`
    <div style="${rootDivStyle} background: #000000; color: #FFFFFF;">
      <p style="font-size: 32px;">?</p>
    </div>
  `;
  return new ImageResponse(html, {width: 64, height: 64});
}

export default app;

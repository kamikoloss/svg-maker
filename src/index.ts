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

app.get('/color', (c) => {
  const rgb = c.req.queries('rgb');
  if (!rgb) return invalidImageResponse();
  const html = /*html*/`
    <div style="display: flex; height: 100vh; width: 100vw; background: #${rgb[0]};"></div>
  `;
  return new ImageResponse(html, {width: 24, height: 24});
});

app.get('/date', (c) => {
  const until = c.req.queries('until');
  const since = c.req.queries('since');
  if (!until && !since) return invalidImageResponse();
  let date = until?.[0] || since?.[0];
  let dayCount = 0;
  let dayWord = '';
  if (until) {
    dayCount = Math.floor((Date.parse(until[0]) - Date.now()) / (1000 * 60 * 60 * 24));
    dayWord = 'until';
  } else if (since) {
    dayCount = Math.floor((Date.now() - Date.parse(since[0])) / (1000 * 60 * 60 * 24));
    dayWord = 'since';
  } else {
    return invalidImageResponse();
  }
  const html = /*html*/`
    <div style="${rootDivStyle} background: #000000; color: #FFFFFF;">
      <div style="display: flex; flex-direction: column; align-items: center; gap: -16px;">
        <p style="font-size: 128px;">${dayCount}</p>
        <p style="font-size: 32px;">days ${dayWord}</p>
        <p style="font-size: 32px;">${date}</p>
      </div>
    </div>
  `;
  return new ImageResponse(html, {width: 320, height: 320});
});

app.get('/random', (c) => {
  const randomMax = 100;
  const random = Math.floor(Math.random() * randomMax) + 1;
  const html = /*html*/`
    <div style="${rootDivStyle} background: #000000; color: #FFFFFF;">
      <div style="display: flex; flex-direction: column; align-items: center; gap: -16px;">
        <p style="font-size: 32px;">1d${randomMax}=</p>
        <p style="font-size: 128px;">${random}</p>
      </div>
    </div>
  `;
  return new ImageResponse(html, {width: 320, height: 320});
});

app.get('/dlsite', async (c) => {
  const id = c.req.queries('id');
  if (!id) return invalidImageResponse();
  const url = `https://www.dlsite.com/maniax/product/info/ajax?product_id=${id[0]}&cdn_cache_min=1`;
  const json = await fetch(url).then(res => res.text());
  const { dl_count, wishlist_count, work_image } = JSON.parse(json)[id[0]];
  const html = /*html*/`
    <div style="${rootDivStyle} align-items: flex-end; justify-content: flex-start; color: #FFFFFF;">
      <img src="https:${work_image}" style="width: 100%; height: 100%; object-fit: cover;">
      <div style="position: absolute; display: flex; width: 100%; height: 100%; background-image: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.9));"></div>
      <div style="position: absolute; display: flex; flex-direction: column; align-items: flex-start; gap: -24px;">
        <p style="font-size: 32px;">DL:</p>
        <p style="font-size: 64px;">${dl_count}</p>
        <p style="font-size: 32px;">WL:</p>
        <p style="font-size: 64px;">${wishlist_count}</p>
      </div>
    </div>
  `;
  return new ImageResponse(html, {width: 320, height: 320});
});

// fallback
app.get('*', (c) => invalidImageResponse());

const invalidImageResponse = (): ImageResponse => {
  const html = /*html*/`
    <div style="${rootDivStyle} background: #000000; color: #FFFFFF;">
      <p style="font-size: 32px;">?</p>
    </div>
  `;
  return new ImageResponse(html, {width: 64, height: 64});
}

export default app;

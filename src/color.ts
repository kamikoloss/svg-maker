import { Context } from 'hono';
import { ImageResponse } from 'workers-og';
import { getInvalidImageResponse } from './util';

export async function getColorImageResponse(c: Context): Promise<ImageResponse> {
  const rgb = c.req.queries('rgb');
  if (!rgb) return getInvalidImageResponse();

  const html = /*html*/`
    <div style="display: flex; width: 100vw; height: 100vh; background: #${rgb[0]};"></div>
  `;
  //console.log(html);

  return new ImageResponse(html, {
    format: 'svg',
    width: 24,
    height: 24,
  });
}

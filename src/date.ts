import { Context } from 'hono';
import { ImageResponse } from 'workers-og';
import { getFont, getInvalidImageResponse, rootDivDefaultStyle } from './util';

export async function getDateImageResponse(c: Context): Promise<ImageResponse> {
  const date = c.req.queries('date');
  if (!date) return getInvalidImageResponse();

  const dayCount = Math.abs(Math.ceil((Date.parse(date[0]) - Date.now()) / (1000 * 60 * 60 * 24)));
  const dayWord = Date.now() < Date.parse(date[0]) ? 'until' : 'since';
  const dayFontSizePx = (dayCount <= -1000 || 10000 <= dayCount) ? 96 : 128;
  const html = /*html*/`
    <div style="${rootDivDefaultStyle} background: #000000; color: #FFFFFF; line-height: 1em;">
      <div style="display: flex; flex-direction: column; align-items: center;">
        <p style="margin: 0; font-size: ${dayFontSizePx}px;">${dayCount}</p>
        <p style="margin: 0; font-size: 32px;">days ${dayWord}</p>
        <p style="margin: 0; font-size: 32px;">${date[0]}</p>
      </div>
    </div>
  `;
  //console.log(html);

  return new ImageResponse(html, {
    format: 'svg',
    width: 320,
    height: 320,
    headers: { 'Cache-Control': `max-age=${3600 * 6}` },
    fonts: [await getFont('JetBrains Mono')]
  });
}

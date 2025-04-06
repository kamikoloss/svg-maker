import { Context } from 'hono';
import { ImageResponse } from 'workers-og';
import { getFont, rootDivDefaultStyle } from './util';

export async function getRandomImageResponse(c: Context): Promise<ImageResponse> {
  const randomMax = 100;
  const random = Math.floor(Math.random() * randomMax) + 1;

  const html = /*html*/`
    <div style="${rootDivDefaultStyle} background: #000000; color: #FFFFFF; line-height: 1em;">
      <div style="display: flex; flex-direction: column; align-items: center;">
        <p style="margin: 0; font-size: 32px;">1d${randomMax}=</p>
        <p style="margin: 0; font-size: 128px;">${random}</p>
      </div>
    </div>
  `;
  //console.log(html);

  return new ImageResponse(html, {
    format: 'svg',
    width: 320,
    height: 320,
    headers: { 'Cache-Control': `max-age=${0}` },
    fonts: [await getFont('JetBrains Mono')]
  });
}

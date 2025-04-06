import { Context } from 'hono';
import { ImageResponse } from 'workers-og';
import { getFont, getInvalidImageResponse, rootDivDefaultStyle } from './util';

export async function getDlsiteImageResponse(c: Context): Promise<ImageResponse> {
  const id = c.req.queries('id');
  if (!id) return getInvalidImageResponse();

  const url = `https://www.dlsite.com/maniax/product/info/ajax?product_id=${id[0]}&cdn_cache_min=1`;
  const json = await fetch(url).then(res => res.text());
  const { dl_count, wishlist_count, work_image } = JSON.parse(json)[id[0]];

  const html = /*html*/`
    <div style="${rootDivDefaultStyle} align-items: flex-end; justify-content: flex-start; color: #FFFFFF; line-height: 0.9em;">
      <img src="https:${work_image}" style="width: 100%; height: 100%; object-fit: cover;">
      <div style="position: absolute; display: flex; width: 100%; height: 100%; background-image: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.9));"></div>
      <div style="position: absolute; display: flex; flex-direction: column; align-items: flex-start;">
        <p style="margin: 0; font-size: 32px;">DL:</p>
        <p style="margin: 0; font-size: 64px;">${dl_count}</p>
        <p style="margin: 0; font-size: 32px;">WL:</p>
        <p style="margin: 0; font-size: 64px;">${wishlist_count}</p>
      </div>
    </div>
  `;
  //console.log(html);

  return new ImageResponse(html, {
    format: 'png',
    width: 320,
    height: 320,
    headers: { 'Cache-Control': `max-age=${3600 * 6}` },
    fonts: [await getFont('JetBrains Mono')]
  });
}

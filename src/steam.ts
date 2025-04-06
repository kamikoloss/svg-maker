import { Context } from 'hono';
import { ImageResponse } from 'workers-og';
import { getFont, getInvalidImageResponse, rootDivDefaultStyle } from './util';

export async function getSteamImageResponse(c: Context): Promise<ImageResponse> {
  const id = c.req.queries('id');
  if (!id) return getInvalidImageResponse();

  const appUrl = `https://store.steampowered.com/api/appdetails?l=en&appids=${id[0]}`;
  const appJson = await fetch(appUrl).then(res => res.text());
  const { header_image } = JSON.parse(appJson)[id[0]].data;
  const reviewUrl = `https://store.steampowered.com/appreviews/${id[0]}?json=1&language=all`;
  const reviewJson = await fetch(reviewUrl).then(res => res.text());
  const { query_summary } = JSON.parse(reviewJson);

  const html = /*html*/`
    <div style="${rootDivDefaultStyle} align-items: flex-end; justify-content: flex-start; color: #FFFFFF; line-height: 0.9em;">
      <img src="${header_image}" style="width: 100%; height: 100%; object-fit: cover;">
      <div style="position: absolute; display: flex; width: 100%; height: 100%; background-image: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.9));"></div>
      <div style="position: absolute; display: flex; flex-direction: column; align-items: flex-start;">
        <p style="margin: 0; font-size: 32px;">RV:</p>
        <p style="margin: 0; font-size: 64px;">${query_summary.total_reviews}</p>
        <p style="margin: 0; font-size: 16px;">${query_summary.total_positive}-${query_summary.total_negative}</p>
        <p style="margin: 0; font-size: 16px;">${query_summary.review_score_desc}</p>
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

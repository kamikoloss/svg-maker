import { ImageResponse, loadGoogleFont } from 'workers-og';

export function getInvalidImageResponse(): ImageResponse {
  const html = /*html*/`
    <div style="${rootDivDefaultStyle} background: #000000; color: #FFFFFF;">
      <p style="font-size: 32px;">?</p>
    </div>
  `;
  return new ImageResponse(html, { format: 'svg', width: 64, height: 64 });
}

export async function getFont(fontName: string): Promise<Object> {
  return {
    name: fontName,
    data: await loadGoogleFont({ family: fontName }),
  };
}

export const rootDivDefaultStyle = `
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  font-family: sans-serif;
`;

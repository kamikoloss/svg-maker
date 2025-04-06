import { Hono } from 'hono';
import { getColorImageResponse } from './color';
import { getDateImageResponse } from './date';
import { getDlsiteImageResponse } from './dlsite';
import { getRandomImageResponse } from './random';
import { getSteamImageResponse } from './steam';
import { getInvalidImageResponse } from './util';

const app = new Hono();

app.get('/color', (c) => getColorImageResponse(c));
app.get('/date', (c) => getDateImageResponse(c));
app.get('/dlsite', (c) => getDlsiteImageResponse(c));
app.get('/random', (c) => getRandomImageResponse(c));
app.get('/steam', (c) => getSteamImageResponse(c));
app.get('*', (c) => getInvalidImageResponse());

export default app;

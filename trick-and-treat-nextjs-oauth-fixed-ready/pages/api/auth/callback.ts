import type { NextApiRequest, NextApiResponse } from 'next';
import { oauth2Client } from '../../../lib/google-oauth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const code = String(req.query.code || '');
    const oauth = oauth2Client();
    const { tokens } = await oauth.getToken(code);
    const refresh = tokens.refresh_token;
    if (!refresh) {
      return res.status(400).send('No refresh token returned. Try again with prompt=consent.');
    }
    res.status(200).send(`
      <h1>Copy this REFRESH TOKEN</h1>
      <p>Add it in Vercel as <code>GOOGLE_REFRESH_TOKEN</code> (Project → Settings → Environment Variables).</p>
      <pre style="white-space:pre-wrap;border:1px solid #ccc;padding:12px;border-radius:8px">${refresh}</pre>
    `);
  } catch (e:any) {
    res.status(400).send(e.message || 'Auth error');
  }
}

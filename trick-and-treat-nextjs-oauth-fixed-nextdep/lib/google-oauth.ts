import { google } from 'googleapis';

export function oauth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID as string;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
  const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  const redirectUri = `${base}/api/auth/callback`;
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function calendarClient() {
  const oauth = oauth2Client();
  const refresh = process.env.GOOGLE_REFRESH_TOKEN as string;
  if (!refresh) throw new Error('Missing GOOGLE_REFRESH_TOKEN');
  oauth.setCredentials({ refresh_token: refresh });
  return google.calendar({ version: 'v3', auth: oauth });
}

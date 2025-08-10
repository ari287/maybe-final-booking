import type { NextApiRequest, NextApiResponse } from 'next';
import { oauth2Client } from '../../../lib/google-oauth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const oauth = oauth2Client();
  const scopes = [
    'https://www.googleapis.com/auth/calendar.events',
    'openid',
    'email',
    'profile',
  ];
  const url = oauth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  });
  res.redirect(url);
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { calendarClient } from '../../lib/google-oauth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { name, email, phone, dog, notes, service, startISO, durationMin } = req.body || {};
    if (!name || !email || !startISO) return res.status(400).json({ error: 'Missing required fields' });

    const cal = calendarClient();
    const calId = process.env.GOOGLE_CALENDAR_ID!;
    const tz = process.env.BOOKING_TIMEZONE || 'Australia/Melbourne';
    const start = new Date(startISO);
    const end = new Date(start.getTime() + (Number(durationMin || 60) * 60000));

    const fb = await cal.freebusy.query({ requestBody: { timeMin: start.toISOString(), timeMax: end.toISOString(), items: [{ id: calId }] } });
    const busy = fb.data.calendars?.[calId]?.busy || [];
    if (busy.length) return res.status(409).json({ error: 'That slot was just taken. Please choose another.' });

    const summary = `${service || 'Dog Training'} — ${name}`;
    const description = `Client: ${name}
Email: ${email}
Phone: ${phone || '-'}
Dog: ${dog || '-'}
Notes: ${notes || '-'}`;

    const ev = await cal.events.insert({
      calendarId: calId,
      requestBody: {
        summary, description,
        start: { dateTime: start.toISOString(), timeZone: tz },
        end:   { dateTime: end.toISOString(),   timeZone: tz },
        attendees: [{ email }],
        reminders: { useDefault: true }
      },
      sendUpdates: 'all'
    });

    res.status(200).json({ ok: true, eventId: ev.data.id });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Server error' });
  }
}

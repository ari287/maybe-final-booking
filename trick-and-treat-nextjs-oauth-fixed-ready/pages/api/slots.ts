import type { NextApiRequest, NextApiResponse } from 'next';
import { calendarClient } from '../../lib/google-oauth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dateStr = String(req.query.date || '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return res.status(400).json({ error: 'Invalid date' });

    const tz = process.env.BOOKING_TIMEZONE || 'Australia/Melbourne';
    const slotMin = Number(process.env.BOOKING_SLOT_MIN || 60);
    const buffer = Number(process.env.BOOKING_BUFFER_MIN || 10);
    const calId = process.env.GOOGLE_CALENDAR_ID!;

    const dayStart = new Date(`${dateStr}T00:00:00`);
    const start = new Date(dayStart); start.setHours(9,0,0,0);
    const end   = new Date(dayStart); end.setHours(18,0,0,0);

    const cal = calendarClient();
    const fb = await cal.freebusy.query({
      requestBody: { timeMin: start.toISOString(), timeMax: end.toISOString(), timeZone: tz, items: [{ id: calId }] }
    });
    const busy = fb.data.calendars?.[calId]?.busy || [];

    const slots: { startISO: string; label: string }[] = [];
    for (let t = new Date(start); t < end; t = new Date(t.getTime() + slotMin*60000)) {
      const s = new Date(t);
      const e = new Date(t.getTime() + slotMin*60000);
      const sBuf = new Date(s.getTime() - buffer*60000);
      const eBuf = new Date(e.getTime() + buffer*60000);
      const overlaps = busy.some((b: any) => !(eBuf <= new Date(b.start) || sBuf >= new Date(b.end)));
      if (!overlaps) {
        const label = s.toLocaleString('en-AU', { timeZone: tz, weekday: 'short', hour: 'numeric', minute: '2-digit', day: 'numeric', month: 'short' });
        slots.push({ startISO: s.toISOString(), label });
      }
    }
    res.status(200).json({ slots });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Server error' });
  }
}

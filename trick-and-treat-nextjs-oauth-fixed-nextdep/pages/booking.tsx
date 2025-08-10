import Head from 'next/head';
import { useEffect, useState } from 'react';

type Slot = { startISO: string; label: string };

export default function Booking(){
  const [date, setDate] = useState<string>('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [duration, setDuration] = useState(60);

  useEffect(() => {
    const d = new Date(); d.setDate(d.getDate()+1);
    setDate(d.toISOString().slice(0,10));
  }, []);

  useEffect(() => {
    if (!date) return;
    setLoading(true); setStatus('');
    fetch(`/api/slots?date=${date}`)
      .then(r => r.json())
      .then(j => setSlots(j.slots || []))
      .catch(() => setStatus('Could not load slots'))
      .finally(() => setLoading(false));
  }, [date]);

  function handleServiceChange(e: any){
    const txt = e.target.value as string;
    setDuration(txt.includes('Walk & Train') ? 45 : 60);
  }

  async function book(){
    setStatus('Booking…');
    const body = {
      service: (document.getElementById('service') as HTMLSelectElement).value,
      startISO: (document.getElementById('slot') as HTMLSelectElement).value,
      durationMin: duration,
      name:  (document.getElementById('name') as HTMLInputElement).value.trim(),
      email: (document.getElementById('email') as HTMLInputElement).value.trim(),
      phone: (document.getElementById('phone') as HTMLInputElement).value.trim(),
      dog:   (document.getElementById('dog') as HTMLInputElement).value.trim(),
      notes: (document.getElementById('notes') as HTMLTextAreaElement).value.trim(),
    };
    if (!body.name || !body.email || !body.startISO){ setStatus('Please enter your name, email, and choose a time.'); return; }
    const r = await fetch('/api/book', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    const j = await r.json();
    setStatus(j.ok ? 'Booked! Check your email for the invite.' : (j.error || 'Could not book, try another slot.'));
  }

  return (
    <>
      <Head>
        <title>Book · Trick & Treat Training</title>
        <link rel="stylesheet" href="/assets/css/styles.css"/>
      </Head>
      <main className="container prose" style={{paddingTop: 24}}>
        <h1>Book a session</h1>
        <div className="form-grid">
          <label>Date <input id="date" type="date" value={date} onChange={e=>setDate(e.target.value)}/></label>
          <label>Time slot <select id="slot">{loading ? <option>Loading…</option> : slots.map(s=> <option key={s.startISO} value={s.startISO}>{s.label}</option>)}</select></label>
          <label className="full">Service
            <select id="service" onChange={handleServiceChange}>
              <option value="Private Session (60m)">$200 — Private Session (60m)</option>
              <option value="5-Session Package (5×60m)">$900 — 5-Session Package</option>
              <option value="Walk & Train (45m)">$80 — Walk & Train</option>
            </select>
          </label>
          <label className="full">Your name <input id="name" required/></label>
          <label>Email <input id="email" type="email" required/></label>
          <label>Mobile <input id="phone" type="tel"/></label>
          <label className="full">Your dog (name, breed, age) <input id="dog"/></label>
          <label className="full">Notes <textarea id="notes" rows={6}></textarea></label>
        </div>
        <button className="btn btn-primary" onClick={book}>Book now</button>
        <span className="hint" style={{marginLeft:12}}>{status}</span>
      </main>
    </>
  );
}

(async()=>{
  const base = process.env.BASE_URL || 'http://localhost:3003';
  const urls = ['/', '/studio', '/admin/feedback'];
  for (const u of urls) {
    try {
      const r = await fetch(base + u);
      console.log(u, r.status);
    } catch (e) {
      console.error(u, 'ERR', e.message);
    }
  }

  const post = async (path, body) => {
    try {
      const r = await fetch(base + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      const text = await r.text().catch(() => '<no body>');
      console.log(path, r.status, text.slice(0, 300));
      return r;
    } catch (e) {
      console.error(path, 'ERR', e.message);
    }
  };

  await post('/api/contact', { name: 'Test', email: 'test@example.com', phone: '1234567890', message: 'hello' });
  await post('/api/booking', { clientName: 'Test', email: 'test@example.com', phone: '1234567890', serviceType: 'video' });
  await post('/api/newsletter', { email: 'test@example.com' });

})().catch(e=>{console.error(e);process.exit(1);});

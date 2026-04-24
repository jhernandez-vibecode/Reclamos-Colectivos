export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const { pin } = await req.json();
  const VALID = Netlify.env.get('ACCESS_PIN') || 'VTM805';
  if (pin === VALID) {
    const token = btoa(VALID + ':reclamos');
    return Response.json({ ok: true, token });
  }
  return Response.json({ ok: false, msg: 'PIN incorrecto' }, { status: 401 });
};
export const config = { path: '/api/auth' };

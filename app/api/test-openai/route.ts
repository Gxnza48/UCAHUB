export const runtime = 'nodejs';

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return Response.json({ ok: false, error: 'OPENAI_API_KEY no encontrada en process.env' });
  }

  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(10000),
    });
    
    const text = await res.text();
    
    if (res.ok) {
      return Response.json({ ok: true, status: res.status, message: 'Conexión a OpenAI exitosa ✅' });
    } else {
      return Response.json({ ok: false, status: res.status, body: text.slice(0, 300) });
    }
  } catch (err: any) {
    return Response.json({ ok: false, error: err.message, code: err.cause?.code });
  }
}

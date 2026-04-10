export const runtime = 'nodejs';
export const maxDuration = 30;

const PDF_CHAR_LIMIT = 8000;

async function extractPdfText(fileUrl: string): Promise<string> {
  try {
    // pdf-parse causes Next.js build errors (DOMMatrix polyfill). 
    // We use a free reader API (jina.ai) to extract the text from the public PDF URL.
    const readerUrl = `https://r.jina.ai/${fileUrl}`;
    const res = await fetch(readerUrl, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return '';
    const text = await res.text();
    console.log("------------------ JINA AI RESPONSE -----------------");
    console.log("Status:", res.status);
    console.log("Jina Text Preview:", text.slice(0, 400));
    console.log("-----------------------------------------------------");
    const cleanText = text.replace(/\[.*?\]\(.*?\)/g, '').trim(); // Remove markdown links
    return cleanText.length > PDF_CHAR_LIMIT ? cleanText.slice(0, PDF_CHAR_LIMIT) + '\n[... contenido truncado ...]' : cleanText;
  } catch (e) {
    console.warn('PDF extraction failed:', e);
    return '';
  }
}

async function callOpenAI(body: object, apiKey: string): Promise<Response> {
  return fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(12000),
  });
}

export async function POST(req: Request) {
  try {
    const { messages, fileContext, fileUrl } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'OPENAI_API_KEY no configurada.' }, { status: 500 });
    }

    // Extract PDF content if URL is provided
    let pdfContent = '';
    if (fileUrl) {
      pdfContent = await extractPdfText(fileUrl);
    }

    const systemPrompt = `Eres un asistente de estudio virtual integrado en UCAHUB.
El usuario está viendo un recurso académico con el siguiente contexto:
Título: ${fileContext?.title || 'Desconocido'}
Materia: ${fileContext?.subject || 'Desconocida'}
Carrera: ${fileContext?.career || 'Desconocida'}
Descripción: ${fileContext?.description || 'Sin descripción'}
${pdfContent ? `\n## Contenido del Documento\n${pdfContent}\n` : ''}
Tu objetivo es ayudar al usuario a entender este material basándote PRINCIPALMENTE en el contenido del documento provisto. Responde con precisión, sé claro y conciso (tono académico pero amigable). Si la pregunta no tiene respuesta en el documento, indícalo honestamente.`;

    const chatMessages = (messages as { role: string; content: string }[]).filter(
      (m) => m.content && m.role
    );

    const requestBody = {
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }, ...chatMessages],
      max_tokens: 700,
      temperature: 0.4,
    };

    let response: Response;
    try {
      response = await callOpenAI(requestBody, apiKey);
    } catch (firstErr: any) {
      console.warn('Chat route: first attempt failed, retrying...', firstErr.message);
      await new Promise((r) => setTimeout(r, 1000));
      response = await callOpenAI(requestBody, apiKey);
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg = (errData as any)?.error?.message || `OpenAI HTTP ${response.status}`;
      console.error('OpenAI API error:', msg);
      return Response.json({ error: msg }, { status: 500 });
    }

    const data = await response.json() as any;
    const content = data.choices?.[0]?.message?.content || '';
    return Response.json({ content });
  } catch (error: any) {
    console.error('Error in chat route:', error);
    return Response.json({ error: error.message || 'Error desconocido' }, { status: 500 });
  }
}

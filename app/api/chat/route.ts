export const runtime = 'nodejs';
export const maxDuration = 30;

const PDF_CHAR_LIMIT = 8000;

async function extractPdfText(fileUrl: string): Promise<string> {
  try {
    if (!fileUrl) return '';
    
    // Encode the URL carefully to handle spaces and special characters
    const encodedUrl = encodeURIComponent(fileUrl);
    const readerUrl = `https://r.jina.ai/${fileUrl}`; // Jina usually works better with the raw URL if it's already encoded, but let's be safe.
    // Actually, Jina documentation says: https://r.jina.ai/https://your-url.com
    // If we encode the whole thing, it might fail. If we don't, spaces might fail.
    
    // We'll use the raw fileUrl but ensure it's a valid URL string
    const targetUrl = fileUrl.trim();
    const finalReaderUrl = `https://r.jina.ai/${targetUrl}`;
    
    console.log("--- UCABOT Extraction Attempt ---");
    console.log("Target PDF:", targetUrl);
    
    const res = await fetch(finalReaderUrl, { 
      signal: AbortSignal.timeout(15000), // Increased from 10s to 15s
      headers: {
        'Accept': 'text/plain',
        'X-No-Cache': 'true'
      }
    });

    if (!res.ok) {
      console.warn(`Jina Reader failed with status: ${res.status}`);
      return '';
    }

    const text = await res.text();
    console.log("Jina Text Preview:", text.slice(0, 200));
    
    // Clean markdown and excessive noise
    const cleanText = text
      .replace(/\[.*?\]\(.*?\)/g, '') // Remove markdown links
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove markdown images
      .trim();
      
    if (cleanText.length < 50 && text.includes('error')) {
      console.warn('Jina returned potential error page');
      return '';
    }

    return cleanText.length > PDF_CHAR_LIMIT 
      ? cleanText.slice(0, PDF_CHAR_LIMIT) + '\n[... contenido truncado por longitud ...]' 
      : cleanText;
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

    const systemPrompt = `Eres UCABOT, un asistente de estudio virtual integrado en UCAHUB.
El usuario está viendo un recurso académico con el siguiente contexto:
Título: ${fileContext?.title || 'Desconocido'}
Materia: ${fileContext?.subject || 'Desconocida'}
Carrera: ${fileContext?.career || 'Desconocida'}
Descripción: ${fileContext?.description || 'Sin descripción'}

${pdfContent 
  ? `## Contenido Extraído del PDF\n${pdfContent}\n` 
  : `IMPORTANTE: No se pudo extraer el contenido profundo del PDF en este momento. Solo tienes acceso al resumen metadata de arriba.`}

INSTRUCCIONES DE COMPORTAMIENTO:
1. Tu objetivo es ayudar al usuario a entender este material basándote PRINCIPALMENTE en el contenido provisto.
2. Responde con precisión, sé claro y conciso (tono académico pero amigable). 
3. ${pdfContent 
     ? 'Utiliza los datos del PDF para responder preguntas específicas.' 
     : 'Dado que no tienes el contenido completo del PDF, responde basándote en el Título, Materia y Descripción. Si te preguntan algo muy específico del interior del documento que no sabes, indícalo amablemente diciendo que solo tienes acceso al resumen por ahora.'}
4. Si la pregunta no tiene relación con el ámbito académico o el documento, redirige suavemente la conversación al estudio.`;

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

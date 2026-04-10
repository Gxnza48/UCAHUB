import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const driveUrl = searchParams.get('url');

  if (!driveUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const res = await fetch(driveUrl, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const html = await res.text();
    
    // Scrape the <title> tag
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    let title = titleMatch && titleMatch[1] ? titleMatch[1] : 'Carpeta de Estudio';

    // Clean up " - Google Drive" and common careers
    title = title.replace(/\s*-\s*Google Drive/i, '');
    
    const careersToRemove = [
      'Abogacía',
      'Abogacia',
      'Contador Público',
      'Contador Publico',
      'Administración de Empresas',
      'Administracion de Empresas',
      'Marketing',
      'Recursos Humanos',
      'Ingeniería Industrial',
      'Ingenieria Industrial',
      'Ingeniería Química',
      'Ingenieria Quimica',
      'Comunicación Periodística',
      'Comunicacion Periodistica',
      'Ciencia de Datos'
    ];

    careersToRemove.forEach((career) => {
      // Create a regex to match the career name case-insensitively, possibly with leading/trailing spaces or separators like "-", "|"
      const regex = new RegExp(`[\\s\\-\\|]*${career}[\\s\\-\\|]*`, 'ig');
      title = title.replace(regex, ' ').trim();
    });

    // Make sure it doesn't end up empty
    if (!title) title = 'Carpeta de Documentos';

    return NextResponse.json({ title });
  } catch (error: any) {
    console.error('Error scraping Drive title:', error);
    // Fallback name if fetching fails
    return NextResponse.json({ title: 'Carpeta de Estudio' });
  }
}

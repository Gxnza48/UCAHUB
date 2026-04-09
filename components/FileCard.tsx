import Link from 'next/link';
import { User, FileText, Download } from 'lucide-react';
import { PdfPreview } from '@/components/PdfPreview';

export default function FileCard({ file }: { file: any }) {
  const typeLabel = file.type || 'Documento';

  // Fallback images depending on type for variation
  const typeImages: Record<string, string> = {
    'Resumen': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjmbpS_No1_GWl19KeJze1DlFo4XClT1T5wxdooI0-HjW04z2G3EXsJe-Ct9YsrGBQvl-fh_45XTmd--fQqi24CEzBJQUGJqrTH8sGg1r6W26a5MdQvz5urEL5Kw0Tin1PVNmZ1eKAGI5fdIq94G2Xf8-9f2nQk_B6-kzkDYwlaoWWx0qpCz2YDRq68EpQZxTAFVL4dZDNEqQUWvT5tEHJ9BAjH4KjB2DDgwwqxhuUqCl6CQyRaCzxd_ym50cck7nZ7fYyXLCG0RCb',
    'Examen Anterior': 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_rqtrr3Af-Dcu89iE8hs1fCdVE2MrCKcQUhL8Qt2O_VvNHfJlNI0A9FG0JKEroAetWlv8GtrM0G3x5bHQFHrm_avgRklvY-2Et0YLK_0dNO2Y0plDssksJ2Sj61gRfR0c1owfXyYOJSgKGj9EXPSgA2yw2QZ-3aqhRVB9Emifd9Zr1NfOU8iFkLG50jLTyAuvAckHpp2CF7abpBtfzZUR_NKI-7oo6_2uUq7MBvWC9AAC76My5FwNkezuwy6CRth73toRr1lqJ586',
    'Guía de TPs': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqcv9pti33K0pR0NoI1IoJunqJkCCU0xUMMLUKxxv9skud0k5SrOfNIXz8dhgOwCP2-zwjoCIbySSQ3nzMocgkFjPzCQleLQVs6VyGugWibmNVZpIzGxuM5_VKNFHgEISBn22i8a1NJi1x8Csix4HqEAmdNwom715rNIvB-1ETb_DHKO2A4_xBHUfCBKy4h9pPgRb4JkincweTFfOlHhgiC3jO3EXbmFEBVac9hDxm_pChyJpeaTpUJHX2TrbJJtw7-L6sTDEWeRVG'
  };
  
  const coverImage = typeImages[typeLabel] || 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6fQwtUpMw-167JXrh1yz6EiiAM54rd6rG5IsDgCKKr8kxepsMFeXhyAPgkBzetqsBZhK5QW_iG6EUOTeq-8AyDEHV71e2gcM2iUipIzCUtnozlCyRGyzJT-PBRK8A59IPcwO-pzdtFmg8X-DDnnqHHIT2TA7CybfYbzvRgTnTtaxxiNYqybd9C7dN9mabDUS1AVjVSYVq4bNXitgB01206slp_I0BWPliGUbdFjhZ-Y6tuVm4e2-hSpqOH1VdoQKDAuPqoEi_8Ve-';

  return (
    <div className="card-premium group flex flex-col h-full !p-2">
      <Link href={`/file/${file.id}`} className="block relative h-52 w-full overflow-hidden rounded-xl mb-4 shrink-0 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50">
        
        <div className="w-full h-full pointer-events-none transition-transform duration-700 group-hover:scale-110 origin-center drop-shadow-md">
          {file.file_url ? (
             <PdfPreview fileUrl={file.file_url} />
          ) : (
             <img className="w-full h-full object-cover" src={coverImage} alt={file.title} />
          )}
        </div>
        
        <div className="absolute inset-0 z-10 bg-transparent"></div>

        <div className="absolute top-3 right-3 z-20 liquid-glass text-primary dark:text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider border-primary/20">
            {typeLabel}
        </div>
      </Link>
      <div className="px-4 pb-4 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-cta text-[11px] font-black font-headline uppercase tracking-widest block line-clamp-1">{file.subject || 'General'}</span>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{file.career}</span>
        </div>
        <Link href={`/file/${file.id}`} className="block flex-grow">
          <h3 className="text-xl font-bold text-text dark:text-white mb-4 leading-tight line-clamp-2 group-hover:text-primary transition-colors font-headline">{file.title}</h3>
        </Link>
        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 font-medium mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
              {file.users?.username?.charAt(0).toUpperCase() || 'E'}
            </div>
            <span className="truncate max-w-[100px] text-xs font-bold text-slate-600 dark:text-slate-300">{file.users?.username || 'Estudiante'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Download className="w-3.5 h-3.5" />
            <span className="text-[11px] font-black">{file.download_count || 0}</span>
          </div>
          <div className="ml-auto text-[10px] font-bold uppercase tracking-tighter text-slate-400 dark:text-slate-500">{new Date(file.created_at).toLocaleDateString('es-AR', { month: 'short', day: 'numeric' })}</div>
        </div>
      </div>
    </div>
  )
}

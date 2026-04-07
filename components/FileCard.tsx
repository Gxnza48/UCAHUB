import Link from 'next/link';
import { User } from 'lucide-react';

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
    <div className="group bg-white dark:bg-slate-800/80 rounded-2xl p-2 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary-container/10 dark:hover:shadow-blue-900/20 hover:-translate-y-1 flex flex-col h-full ring-1 ring-slate-200 dark:ring-slate-700/50">
      <Link href={`/file/${file.id}`} className="block relative h-48 w-full overflow-hidden rounded-xl mb-4 shrink-0 bg-slate-100 dark:bg-slate-900">
        <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={coverImage} alt={file.title} />
        <div className="absolute top-4 right-4 bg-primary-container/90 dark:bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm border border-white/10">
            {typeLabel}
        </div>
      </Link>
      <div className="px-4 pb-4 flex-grow flex flex-col">
        <span className="text-primary-container dark:text-blue-400 text-[10px] font-bold font-headline uppercase tracking-widest mb-2 block line-clamp-1">{file.subject || 'General'}</span>
        <Link href={`/file/${file.id}`} className="block flex-grow">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 leading-snug line-clamp-2 group-hover:text-primary-container dark:group-hover:text-blue-400 transition-colors">{file.title}</h3>
        </Link>
        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 font-medium mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-slate-400" />
            <span className="truncate max-w-[120px]">{file.users?.username || 'Estudiante'}</span>
          </div>
          <div className="ml-auto text-[11px] font-semibold text-slate-400 dark:text-slate-500">{new Date(file.created_at).toLocaleDateString('es-AR', { month: 'short', day: 'numeric' })}</div>
        </div>
      </div>
    </div>
  )
}

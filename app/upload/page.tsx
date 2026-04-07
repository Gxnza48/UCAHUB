import UploadForm from '@/components/UploadForm';

export default function UploadPage() {
  return (
    <div className="py-24 px-6 max-w-6xl mx-auto min-h-screen">
      <header className="mb-12 text-center md:text-left">
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">Compartí tu Conocimiento</h1>
        <p className="text-secondary max-w-2xl text-lg">Ayudá a la comunidad académica subiendo tus apuntes, resúmenes o exámenes. Tu aporte hace la diferencia.</p>
      </header>

      <UploadForm />
    </div>
  );
}

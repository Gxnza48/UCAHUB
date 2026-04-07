import React from 'react';
import AuthForm from '@/components/AuthForm';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function AuthPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/hub');
  }

  return (
    <div className="flex-grow flex items-center justify-center p-6 relative overflow-hidden py-24">
      {/* Background Elements for Academia Fluida Aesthetic */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary-container/10 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm relative z-10">
        
        {/* Left Side: Visual Narrative (Split Layout) */}
        <div className="hidden lg:block relative overflow-hidden group">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkVMxrxWCd4ga8DyDksw9O3MW9hpiaV38BWRScZ8lfrnjjQOWjAhcOClMI3A6jp73OPKzlMBhdTUriUwLcjj-Zza9SJeWxYzLsuuN-gosOXn2N2wK5-5seRxoGA-CTamqcRx7EkcZdrK4vikIwQQoDjBi4Kmmfqn6dn276nrg0aZZVghHOsIHWqcpQUEG9f1hUrb9JlolgGrvrJCHC8MLYoDvIGEHcSb_dE_OwqzAl-WRxx5lTjwYwKpagdgd_OzgeQ8FdZeCl5vHm" 
            alt="Campus Universitario Moderno" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 p-12 flex flex-col justify-end text-white">
            <h1 className="font-headline text-5xl font-extrabold leading-tight mb-4">La Academia<br/>en tu bolsillo.</h1>
            <p className="text-white/80 text-lg max-w-md font-body leading-relaxed">
              Accede a tus cursos, conecta con tu comunidad y fluye con el ritmo de tu aprendizaje digital en UCAHUB.
            </p>
            <div className="mt-8 flex gap-4">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm font-medium">#EduTech</div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm font-medium">#UCAExperience</div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10">
              <h2 className="font-headline text-3xl font-bold text-primary mb-2">Bienvenido</h2>
              <p className="text-on-surface-variant font-body">Tu camino académico continúa aquí.</p>
            </div>
            
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
}

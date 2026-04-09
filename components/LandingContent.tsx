'use client'

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CloudUpload, Search, Download, FileText, File, ArrowRight, Star, Shield, Zap } from 'lucide-react';
import DotGrid from '@/components/DotGrid';
import Particles from '@/components/Particles';

gsap.registerPlugin(ScrollTrigger);

export default function LandingContent({ user }: { user: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Refresh ScrollTrigger when images load or after a short delay
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.from('.hero-content > *', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power4.out',
      });

      // Section Reveals
      const sections = gsap.utils.toArray('.reveal-section');
      sections.forEach((section: any) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
        });
      });

      // Staggered Cards
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power1.out',
      });

      // Text Gradient Pulse
      gsap.to('.text-gradient', {
        backgroundPosition: '200% center',
        duration: 8,
        repeat: -1,
        ease: 'none',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="overflow-x-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(79,70,229,0.08)_0%,_transparent_50%)]"></div>
          <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-cta/5 rounded-full blur-[100px]"></div>
          
          <Particles count={60} color="#4F46E5" opacity={0.4} />
          
          <div className="hidden dark:block opacity-30">
            <DotGrid
              dotSize={2}
              gap={30}
              baseColor="#4F46E5"
              activeColor="#F59E0B"
              proximity={120}
            />
          </div>
        </div>

        <div className="max-w-6xl mx-auto text-center z-10 hero-content mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-white/5 shadow-xl">
             <span className="w-2 h-2 rounded-full bg-cta animate-ping"></span>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
               Nueva Era Académica UCA
             </span>
          </div>
          
          <h1 className="font-headline text-7xl md:text-[10rem] font-black text-text dark:text-white tracking-tight leading-[0.85] mb-8">
            Domina el <br/>
            <span className="text-gradient">Futuro</span>
          </h1>
          
          <p className="font-body text-lg md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed">
            La plataforma inteligente de intercambio académico donde el conocimiento de hoy construye las carreras del mañana.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href={user ? "/hub" : "/auth"} className="btn-premium bg-primary text-white text-lg px-12 py-5 shadow-2xl shadow-primary/30 group">
              <span className="relative z-10 flex items-center gap-2">
                {user ? "Empezar a Explorar" : "Unirme a la Red"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link href="#discover" className="btn-premium liquid-glass text-slate-700 dark:text-white text-lg px-10 py-5 group">
              Ver Ecosistema
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats Reveal */}
      <section className="reveal-section py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: 'Recursos', val: '25k+', icon: <FileText className="w-5 h-5" /> },
              { label: 'Estudiantes', val: '8k+', icon: <Shield className="w-5 h-5" /> },
              { label: 'Descargas', val: '150k+', icon: <Zap className="w-5 h-5" /> },
              { label: 'Puntuación', val: '4.9/5', icon: <Star className="w-5 h-5" /> },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="w-12 h-12 mx-auto mb-4 liquid-glass rounded-xl flex items-center justify-center text-primary border-primary/10 group-hover:scale-110 group-hover:rotate-6 transition-all">
                  {stat.icon}
                </div>
                <div className="text-3xl font-headline font-black text-text dark:text-white mb-1">{stat.val}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Storytelling */}
      <section id="discover" className="py-32 px-6 relative bg-background">
        <div className="max-w-7xl mx-auto min-h-screen">
          <div className="reveal-section flex flex-col items-center text-center mb-24 relative">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 blur-[100px] pointer-events-none rounded-full"></div>
            <h2 className="font-headline text-5xl md:text-[5.5rem] font-black text-text dark:text-white mb-8 tracking-tighter leading-[0.9] relative z-10">
              Diseñado para la <br/> <span className="text-primary italic font-light">Excelencia.</span>
            </h2>
            <p className="max-w-2xl text-slate-500 text-lg md:text-xl font-body">
              Hemos reinventado el intercambio de apuntes. No es solo un repositorio, es un centro de inteligencia colectiva.
            </p>
          </div>

          <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card card-premium md:col-span-2 group">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                  <div className="inline-block p-3 bg-primary/10 rounded-2xl text-primary mb-6">
                    <CloudUpload className="w-6 h-6" />
                  </div>
                  <h3 className="font-headline text-3xl font-bold mb-4">Carga Inteligente</h3>
                  <p className="text-slate-500 text-lg leading-relaxed">
                    Sube tus documentos en segundos. Nuestro sistema organiza automáticamente tus archivos por carrera y materia para que otros los encuentren fácilmente.
                  </p>
                </div>
                <div className="hidden md:block w-1/3 aspect-square relative">
                   <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl group-hover:bg-primary/30 transition-all"></div>
                   <div className="relative w-full h-full liquid-glass rounded-3xl flex items-center justify-center">
                      <CloudUpload className="w-20 h-20 text-primary opacity-40 group-hover:scale-110 transition-transform" />
                   </div>
                </div>
              </div>
            </div>

            <div className="feature-card card-premium bg-slate-950 text-white border-transparent">
               <div className="p-2">
                  <div className="inline-block p-3 bg-white/10 rounded-2xl text-cta mb-6">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-headline text-3xl font-bold mb-4 text-white">Filtros de Precisión</h3>
                  <p className="text-slate-400 text-lg font-body leading-relaxed">
                    Localiza el examen del año pasado o los apuntes de ese profesor específico con nuestra búsqueda semántica avanzada.
                  </p>
               </div>
            </div>

            <div className="feature-card card-premium group">
               <div className="inline-block p-3 bg-cta/10 rounded-2xl text-cta mb-6">
                  <Star className="w-6 h-6" />
               </div>
               <h3 className="font-headline text-2xl font-bold mb-4">Sistema de Logros</h3>
               <p className="text-slate-500 font-body">
                  Gana reputación por cada aporte que realices. Conviértete en un referente académico en el Hall de la Fama.
               </p>
            </div>

            <div className="feature-card card-premium md:col-span-2 overflow-hidden relative group">
               <div className="flex items-center justify-between">
                  <div className="max-w-md relative z-10">
                    <div className="inline-block p-3 bg-secondary/10 rounded-2xl text-secondary mb-6">
                      <Download className="w-6 h-6" />
                    </div>
                    <h3 className="font-headline text-3xl font-bold mb-4">Acceso Instantáneo</h3>
                    <p className="text-slate-500 text-lg font-body">
                       Previsualiza cualquier PDF directamente en el navegador con nuestra tecnología de renderizado fluido optimizada para móviles.
                    </p>
                  </div>
                  <div className="absolute right-[-10%] bottom-[-20%] w-[300px] h-[300px] liquid-glass rounded-full border-primary/10 group-hover:scale-110 transition-transform"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Storytelling Continuity / CTA */}
      <section className="reveal-section py-40 px-6 relative bg-gradient-to-b from-transparent to-primary/[0.03]">
        <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-cta mx-auto mb-12 rounded-full"></div>
            <h2 className="font-headline text-5xl md:text-7xl font-bold mb-10 tracking-tight">¿Listo para escribir <br/> <span className="text-cta">tu propia historia?</span></h2>
            <p className="text-xl text-slate-500 mb-16 font-body italic">
              "La red de colaboración más grande de la UCA te espera. Comienza a compartir y eleva tu potencial académico."
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
               <Link href={user ? "/hub" : "/auth"} className="btn-premium bg-primary text-white px-16 py-6 text-xl shadow-2xl shadow-primary/40 hover:-translate-y-2">
                 Empezar Ahora
               </Link>
               <span className="text-slate-400 font-black uppercase text-xs tracking-widest">o explora el Hall de la Fama</span>
            </div>
        </div>
      </section>
    </div>
  );
}

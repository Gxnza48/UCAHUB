'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import Link from 'next/link';

export function NotificationsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      type: 'success',
      title: '¡Bienvenido a UCAHUB!',
      message: 'Tu cuenta ha sido creada exitosamente. Empieza a compartir recursos hoy mismo.',
      time: 'Hace un momento',
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Nueva funcionalidad',
      message: 'Ahora puedes editar tu nombre de usuario en tu perfil.',
      time: 'Hace 2 horas',
      icon: <Info className="w-5 h-5 text-blue-500" />,
      read: false
    }
  ];

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0); // Mark as read when opening
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={handleOpen}
        className="relative text-slate-500 dark:text-slate-400 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all active:scale-95 duration-200" 
        title="Notificaciones"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
            <h3 className="font-bold text-slate-900 dark:text-white">Notificaciones</h3>
            <span className="text-xs font-semibold text-primary-container dark:text-blue-400 bg-primary-container/10 dark:bg-blue-500/10 px-2 py-1 rounded-full">
              {notifications.length} Nuevas
            </span>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="flex flex-col">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-4 items-start group cursor-pointer relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container dark:bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="mt-1 shrink-0 p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                      {notif.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">{notif.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug">{notif.message}</p>
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-2 block">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                  <Bell className="w-8 h-8 opacity-50" />
                </div>
                <p className="text-slate-500 font-medium">No tienes notificaciones nuevas.</p>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link href="/profile" className="text-primary-container dark:text-blue-400 text-sm font-bold hover:underline">
              Ver todas las alertas
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

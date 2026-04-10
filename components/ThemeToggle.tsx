'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{width: '60px', height: '32px', borderRadius: '34px', backgroundColor: 'var(--slate-200, #e2e8f0)'}} className="animate-pulse"></div>;
  }

  const isDark = theme === 'dark';

  return (
    <>
      <div className="custom-switch-wrapper">
        <label className="theme-switch" title="Cambiar tema">
          <input 
            type="checkbox" 
            checked={isDark}
            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
          />
          <div className="switch-bg"></div>
          <div className="slider"></div>
        </label>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-switch-wrapper .theme-switch {
          display: inline-block;
          position: relative;
          width: 60px;
          height: 32px;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .custom-switch-wrapper input {
          opacity: 0;
          width: 0;
          height: 0;
          position: absolute;
        }

        .custom-switch-wrapper .switch-bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #85C1E9; /* Day blue */
          border-radius: 34px;
          transition: background-color 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
          box-shadow: inset 0 2px 6px rgba(0,0,0,0.15);
          overflow: hidden;
        }

        .custom-switch-wrapper input:checked + .switch-bg {
          background-color: #1B2631; /* Night dark */
        }

        .custom-switch-wrapper .slider {
          position: absolute;
          top: 4px;
          left: 4px;
          width: 24px;
          height: 24px;
          background-color: #F4D03F; /* Sun yellow */
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2), 0 0 10px rgba(244, 208, 63, 0.4);
          transition: all 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
          z-index: 2;
        }

        /* Crescent Moon via inset shadow */
        .custom-switch-wrapper input:checked ~ .slider {
          transform: translateX(28px);
          background-color: transparent; 
          box-shadow: inset -6px -4px 0 0 #F8F9F9, 0 2px 5px rgba(0,0,0,0.3);
        }
        
        /* Sun glow pulse */
        .custom-switch-wrapper input:not(:checked) ~ .slider {
          animation: sunPulse 3s infinite alternate;
        }

        @keyframes sunPulse {
          0% { box-shadow: 0 0 8px rgba(244, 208, 63, 0.4); }
          100% { box-shadow: 0 0 16px rgba(244, 208, 63, 0.7); }
        }
      `}} />
    </>
  )
}

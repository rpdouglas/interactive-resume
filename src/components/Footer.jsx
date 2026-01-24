import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

const Footer = () => {
  const version = import.meta.env.PACKAGE_VERSION || 'v0.0.0';
  const { user, login } = useAuth();

  return (
    <footer className="py-8 bg-slate-950 border-t border-slate-900 text-center mt-20 print:hidden">
      <p className="text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Ryan Douglas. 
      </p>
      
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="text-[10px] font-mono text-slate-700 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500/50"></span>
          <span>System Version: v{version}</span>
        </div>

        {/* 🔐 Discreet Admin Entry Point */}
        {!user ? (
          <button 
            onClick={login}
            className="mt-2 text-slate-800 hover:text-slate-600 transition-colors"
            title="Admin Login"
          >
            <Lock size={12} />
          </button>
        ) : (
          <a 
            href="/admin" 
            className="mt-2 text-xs font-bold text-blue-500 hover:underline"
          >
            Go to Dashboard
          </a>
        )}
      </div>
    </footer>
  );
};

export default Footer;

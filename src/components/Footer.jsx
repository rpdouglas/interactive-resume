import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

const Footer = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-slate-950 border-t border-slate-900 text-center mt-20 print:hidden">
      <p className="text-slate-500 text-sm">
        &copy; {currentYear} Ryan Douglas.
      </p>
      
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="text-[10px] font-mono text-slate-700 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500/50"></span>
          <span>System Version: v3.0.0</span>
        </div>

        {/* 🔓 Dev Mode Link: Always visible or visible if user is null/dev-user */}
        <Link 
          to="/admin" 
          className="mt-2 text-xs font-bold text-blue-500 hover:underline"
        >
          [Go to Dashboard]
        </Link>
      </div>
    </footer>
  );
};

export default Footer;

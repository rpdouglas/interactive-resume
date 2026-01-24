import React, { useState, useEffect } from 'react';
import { Menu, X, Linkedin, Github, Mail, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logUserInteraction } from '../hooks/useAnalytics';

const Header = ({ onBookClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBooking = () => {
    setMobileMenuOpen(false);
    logUserInteraction('booking_open');
    onBookClick();
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 py-3 shadow-lg' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <a href="#" onClick={(e) => handleNavClick(e, '#dashboard')} className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-mono text-white">RD</span>
            <span className="text-xl font-bold text-white opacity-90 group-hover:opacity-100 transition-opacity">Ryan Douglas</span>
          </a>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#experience" onClick={(e) => handleNavClick(e, '#experience')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Experience</a>
            
            <div className="h-4 w-px bg-slate-700 mx-2" />

            <button 
              onClick={handleBooking}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center gap-2 print:hidden"
            >
              <MessageSquare size={14} />
              Let's Talk
            </button>

            <div className="flex items-center gap-3 ml-2">
              <a href="https://linkedin.com/in/ryandouglas" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors"><Linkedin size={18} /></a>
              <a href="mailto:rpdouglas@gmail.com" className="text-slate-400 hover:text-emerald-400 transition-colors"><Mail size={18} /></a>
            </div>
          </nav>

          <button className="md:hidden text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-slate-900/98 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-6 text-center">
              <a href="#experience" onClick={(e) => handleNavClick(e, '#experience')} className="text-2xl font-bold text-slate-200">Experience</a>
              <button 
                onClick={handleBooking}
                className="mx-auto w-full max-w-xs py-4 bg-blue-600 text-white rounded-xl font-bold text-xl"
              >
                Book a Consultation
              </button>
              <div className="flex justify-center gap-8 mt-8">
                 <a href="https://linkedin.com/in/ryandouglas" className="text-slate-400"><Linkedin size={28} /></a>
                 <a href="mailto:rpdouglas@gmail.com" className="text-slate-400"><Mail size={28} /></a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

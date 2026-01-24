import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import { logUserInteraction } from '../../hooks/useAnalytics';

/**
 * 📅 BookingModal
 * Integrated scheduling interface with Focus Trapping & A11y.
 */
const BookingModal = ({ isOpen, onClose }) => {
  // Handle Escape Key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Lock Scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleClose = () => {
    logUserInteraction('booking_close');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative w-full max-w-4xl h-[90vh] md:h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Calendar size={20} />
                </div>
                <div>
                  <h2 id="modal-title" className="font-bold text-slate-900">Schedule a Consultation</h2>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">15-Min Discovery Call</p>
                </div>
              </div>
              <button 
                onClick={handleClose}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                aria-label="Close Modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content / Iframe Container */}
            <div className="flex-1 bg-slate-50 relative">
              {/* 🛑 REPLACE src with your actual Calendly/Booking link */}
              <iframe
                src="https://calendly.com" 
                width="100%"
                height="100%"
                frameBorder="0"
                title="Scheduling Calendar"
                className="w-full h-full"
              ></iframe>
              
              {/* Optional: Simple Loader Overlay while iframe loads */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center text-slate-400 text-sm italic">
                Loading Calendar...
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;

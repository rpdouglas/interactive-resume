import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

/**
 * 🧜‍♂️ Mermaid.js Wrapper
 * Renders text-based diagrams as SVGs.
 * Handles the React lifecycle to prevent duplicate rendering.
 */
const Mermaid = ({ chart }) => {
  const ref = useRef(null);

  useEffect(() => {
    // Initialize with Slate/Blue theme
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      securityLevel: 'loose',
      themeVariables: {
        primaryColor: '#3b82f6',
        primaryTextColor: '#fff',
        primaryBorderColor: '#2563eb',
        lineColor: '#64748b',
        secondaryColor: '#1e293b',
        tertiaryColor: '#0f172a'
      }
    });

    if (ref.current) {
      // Clear previous content
      ref.current.innerHTML = '';
      
      // Unique ID for this render to avoid collision in long lists
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      
      mermaid.render(id, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      });
    }
  }, [chart]);

  return (
    <div className="w-full bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 overflow-x-auto">
      <div ref={ref} className="flex justify-center" />
    </div>
  );
};

export default Mermaid;

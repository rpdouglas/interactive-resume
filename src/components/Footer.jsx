import React from 'react';

const Footer = () => {
  // Access the variable we defined in vite.config.js
  // The '||' provides a fallback for local dev if the env var isn't ready
  const version = import.meta.env.PACKAGE_VERSION || 'v0.0.0';

  return (
    <footer className="py-8 bg-slate-950 border-t border-slate-900 text-center mt-20">
      <p className="text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Ryan Douglas. All rights reserved.
      </p>
      <div className="mt-2 text-xs font-mono text-slate-700 flex justify-center items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500/50"></span>
        <span>System Version: v{version}</span>
      </div>
    </footer>
  );
};

export default Footer;

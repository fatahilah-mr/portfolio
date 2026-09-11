import React, { useEffect } from 'react';
import { Toaster, toast } from 'sonner';

export default function AdminToaster() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.toast = toast;
    }
  }, []);

  return (
    <Toaster 
      position="top-right" 
      richColors 
      theme="light" 
      closeButton
      duration={3500}
      toastOptions={{
        style: {
          fontFamily: 'inherit',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          color: '#0f172a',
          borderRadius: '10px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)'
        }
      }}
    />
  );
}

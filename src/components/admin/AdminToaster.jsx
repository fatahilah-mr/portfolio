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
      theme="dark" 
      closeButton
      duration={3500}
      toastOptions={{
        style: {
          fontFamily: 'inherit',
          background: 'rgba(18, 20, 28, 0.96)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(16px)',
          color: '#f8fafc',
          borderRadius: '12px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)'
        }
      }}
    />
  );
}

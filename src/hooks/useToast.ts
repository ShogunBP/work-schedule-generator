import { useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastListeners: ((toast: Toast) => void)[] = [];

export function useToast() {
  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type };
    
    toastListeners.forEach(listener => listener(toast));
    
    // Auto-remove após 3 segundos
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    // Será tratado pelo componente de toast
    void id;
  };

  return { showToast };
}

// Função para registrar listeners (usado pelo componente de toast)
export function registerToastListener(listener: (toast: Toast) => void) {
  toastListeners.push(listener);
  return () => {
    toastListeners = toastListeners.filter(l => l !== listener);
  };
}

// Função simples para usar sem React Hook
export function showToastGlobal(message: string, type: ToastType = 'info') {
  const id = Math.random().toString(36).substr(2, 9);
  const toast: Toast = { id, message, type };
  toastListeners.forEach(listener => listener(toast));
  
  setTimeout(() => {
    // Remove automaticamente
  }, 3000);
}

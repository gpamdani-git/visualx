import { create } from 'zustand';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = { ...toast, id };
    
    set((state) => ({
      toasts: [...state.toasts.slice(-3), newToast] // keep max 4 toasts
    }));

    const duration = toast.duration ?? 2600;
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }));
    }, duration);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  }
}));

// Convenience helper
export const showToast = (title: string, description?: string, type: ToastItem['type'] = 'success') => {
  useToastStore.getState().addToast({ title, description, type });
};

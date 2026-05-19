import { toast as sonnerToast } from 'sonner';

type ToastOptions = {
  duration?: number;
  description?: string;
};

export const showSuccess = (message: string, options?: ToastOptions) => {
  sonnerToast.success(message, {
    duration: options?.duration || 3000,
    description: options?.description,
  });
};

export const showError = (message: string, options?: ToastOptions) => {
  sonnerToast.error(message, {
    duration: options?.duration || 4000,
    description: options?.description,
  });
};

export const showInfo = (message: string, options?: ToastOptions) => {
  sonnerToast.info(message, {
    duration: options?.duration || 3000,
    description: options?.description,
  });
};

export const showLoading = (message: string) => {
  return sonnerToast.loading(message);
};

export const dismissToast = (toastId: string | number) => {
  sonnerToast.dismiss(toastId);
};

export const dismissAllToasts = () => {
  sonnerToast.dismiss();
};

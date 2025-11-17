import { toast as sonner } from "sonner";

export const useSonner = () => {
  const success = (message: string, options?: object) => {
    sonner.success(message, {
      duration: 3000,
      ...options,
    });
  };

  const error = (
    message: string,
    options?: {
      description?: string;
      closeButton?: boolean;
      duration?: number;
    }
  ) => {
    sonner.error(message, {
      description: options?.description,
      closeButton: options?.closeButton ?? true,
      duration: options?.duration ?? 15000,
      ...options,
    });
  };

  const info = (message: string, options?: object) => {
    sonner.info(message, {
      duration: 3000,
      ...options,
    });
  };

  const warning = (message: string, options?: object) => {
    sonner.warning(message, {
      duration: 3000,
      ...options,
    });
  };

  return {
    sonner: {
      success,
      error,
      info,
      warning,
    },
  };
};

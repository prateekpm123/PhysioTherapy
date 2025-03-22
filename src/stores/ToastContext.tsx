// src/contexts/ToastContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import Toast, { ToastColors } from '../components/Toast';

interface ToastContextProps {
  showToast: (message: string,  duration?: number, color?: ToastColors) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toastMessage, setToastMessage] = useState('');
  const [toastDuration, setToastDuration] = useState(3000);
  const [toastColor, setToastColor] = useState(ToastColors.BLUE);
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = (message: string, duration = 3000, color = ToastColors.BLUE) => {
    setToastMessage(message);
    setToastColor(color);
    setToastDuration(duration);
    setIsToastVisible(true);
  };

  const hideToast = () => {
    setIsToastVisible(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {isToastVisible && <Toast message={toastMessage} color={toastColor} duration={toastDuration}  onClose={hideToast} />}
    </ToastContext.Provider>
  );
};

export const DefaultToastTiming = 4000;

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
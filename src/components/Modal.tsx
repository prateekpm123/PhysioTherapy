import React, { ReactNode } from "react";

interface ModalProps {
  pIsOpen: boolean;
  children: ReactNode;
  title: string,
  setIsModelOpen: React.Dispatch<React.SetStateAction<boolean>>;  
}

const Modal: React.FC<ModalProps> = ({ title, pIsOpen, setIsModelOpen, children }) => {
  const onClose = () => {
    setIsModelOpen(false);
  };
  if (!pIsOpen) return null;

  return (
    <div className="fixed h-full w-full inset-0 z-50 top-0 right-0 overflow-y-auto bg-slate-600">
      <div
        className="bg-slate-600 rounded-lg p-6 shadow-lg w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;

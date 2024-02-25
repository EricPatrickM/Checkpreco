import React, { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg">
        {children}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 m-3 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default Modal;

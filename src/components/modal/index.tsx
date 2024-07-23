import React, { useEffect } from 'react';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import '../../css/style.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  mt?: string;
}

const GlobalModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  mt,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center overflow-auto bg-slate-900 py-10 bg-opacity-50 modal"
      onClick={onClose}
    >
      <div
        className={`bg-white animate-[animate_0.2s_ease-in-out] dark:text-gray-400 dark:bg-[#30303d] z-999 relative rounded-lg shadow-lg ${mt}`}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="float-right pt-3 pr-3">
          <IoMdCloseCircleOutline
            size={30}
            className="dark:text-white text-black"
          />
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default GlobalModal;

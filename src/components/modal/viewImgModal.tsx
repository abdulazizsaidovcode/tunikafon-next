import React, { useEffect } from 'react';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import '../../css/style.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    mt?: string;
}

const viewImgModal: React.FC<ModalProps> = ({
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
            className="fixed inset-0 z-[10000] flex items-center justify-center overflow-auto bg-slate-900 bg-black/70 modal"
            onClick={onClose} 
        >
            <div
                className={`bg-transparent  animate-[animate_0.2s_ease-in-out] z-999 relative rounded-lg shadow-lg ${mt}`}
                style={{ maxHeight: '90vh', overflow: 'hidden', padding: 0 }} // Remove padding and overflow
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                {/* Ensure the image stretches within the modal */}
                <div className="flex items-center justify-center">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default viewImgModal;

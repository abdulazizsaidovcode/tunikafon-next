import React, { useState } from 'react';
import GlobalModal from '../modal';
import { FaSpinner } from 'react-icons/fa'; // Optional: A spinner icon for loading
import ViewImgModal from '../modal/viewImgModal';

interface ImagePreviewProps {
    imageUrl: string;
    altText: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, altText }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modalLoading, setModalLoading] = useState(true); // Loading state for modal image

    const openModal = () => {
        setIsOpen(true);
        setModalLoading(true); // Reset modal loading state when opening
    };
    const closeModal = () => setIsOpen(false);

    const handleImageLoad = () => {
        setLoading(false);
    };

    const handleModalImageLoad = () => {
        setModalLoading(false);
    };

    const handleImageError = () => {
        setLoading(false);
        setModalLoading(false);
        // Optionally, handle image load error
    };

    return (
        <>
            <div className="relative">
                {loading && (
                    <div className="absolute inset-0 flex justify-start items-center">
                        <FaSpinner className="animate-spin text-gray-500" size={24} />
                    </div>
                )}
                <img
                    src={imageUrl}
                    alt={altText}
                    onClick={openModal}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    className={`cursor-pointer w-15 h-15 rounded-full object-cover ${loading ? 'invisible' : 'visible'}`}
                />
            </div>
            <ViewImgModal
                isOpen={isOpen}
                onClose={closeModal}
                contentLabel="Image Preview"
                className="flex justify-center items-center w-full h-full"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <div className=" rounded-lg">
                    <div className="relative">
                        {modalLoading && (
                            <div className="absolute inset-0 flex justify-center items-center">
                                <FaSpinner className="animate-spin text-gray-500" size={200} />
                            </div>
                        )}
                        <img
                            src={imageUrl}
                            alt={altText}
                            onLoad={handleModalImageLoad}
                            onError={handleImageError}
                            className={`max-w-[100vw] max-h-[800px] ${modalLoading ? 'invisible' : 'visible'}`}
                        />
                    </div>
                </div>
            </ViewImgModal>
        </>
    );
};

export default ImagePreview;

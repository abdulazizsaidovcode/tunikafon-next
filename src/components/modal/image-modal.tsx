import { useEffect } from 'react';
import { IoMdCloseCircleOutline } from 'react-icons/io';
// import { LazyLoadImage } from 'react-lazy-load-image-component';

const ImageModal = ({ imgID, isOpen, onClose }: { imgID: string | number, isOpen: boolean, onClose: () => void, }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        else window.removeEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-opacity-50 bg-black-2">
            <div className="flex h-screen items-center justify-center">
                <img
                    alt={`category img`}
                    // src={imgID ? `${api_videos_files}${imgID}` : images}
                    className={`w-[80%] h-[80%] object-contain`}
                    // width="80%"
                    // height="80%"
                    // effect="blur"
                />
                <button onClick={onClose} className="absolute top-10 right-16 pt-3 pr-3">
                    <IoMdCloseCircleOutline size={30} className="dark:text-white text-black" />
                </button>
            </div>
        </div>
    );
};

export default ImageModal;

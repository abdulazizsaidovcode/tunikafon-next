import GlobalModal from '.';

interface ModalType {
  isModal: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  isLoading: boolean;
}

const DeleteModal = ({ isModal, onClose, onConfirm, isLoading }: ModalType) => {
  return (
    <GlobalModal
      isOpen={isModal}
      onClose={onClose}
      children={
        <div>
          <h1 className="text-lg my-3">
            Are you sure you want to delete the data?
          </h1>
          <div className="w-full flex justify-between">
            <button
              onClick={onClose}
              className="rounded-lg px-3 py-2 bg-graydark"
            >
              Close
            </button>
            <button
              disabled={isLoading}
              onClick={onConfirm}
              className="rounded-lg px-3 py-2 bg-red-500"
            >
              {isLoading ? 'Loading...' : 'Delete'}
            </button>
          </div>
        </div>
      }
    />
  );
};

export default DeleteModal;

import GlobalModal from '.';

interface ModalType {
  isModal: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

const deleteModal = ({ isModal, onClose, onConfirm }: ModalType) => {
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
              onClick={onConfirm}
              className="rounded-lg px-3 py-2 bg-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      }
    />
  );
};

export default deleteModal;

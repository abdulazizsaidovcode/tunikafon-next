import { Button } from '@material-tailwind/react';
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
          <div className="w-full flex justify-between gap-5">
            <Button onClick={onClose} className="bg-graydark">
              Close
            </Button>
            <Button disabled={isLoading} onClick={onConfirm} color="red">
              {isLoading ? 'Loading...' : 'Delete'}
            </Button>
          </div>
        </div>
      }
    />
  );
};

export default DeleteModal;

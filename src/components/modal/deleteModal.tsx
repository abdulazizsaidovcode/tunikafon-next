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
          <h1 className="text-lg my-10 mx-5">
          Haqiqatan ham maʼlumotlarni oʻchirib tashlamoqchimisiz?
          </h1>
          <div className="w-full flex justify-between gap-5">
            <Button onClick={onClose} className="bg-graydark">
              Yopish
            </Button>
            <Button disabled={isLoading} onClick={onConfirm} color="red">
              {isLoading ? 'Loading...' : 'Uchirish'}
            </Button>
          </div>
        </div>
      }
    />
  );
};

export default DeleteModal;

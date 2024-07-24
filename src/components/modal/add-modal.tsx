import GlobalModal from '.';

interface ModalType {
  isModal: boolean;
  name?: string;
  onClose: () => void;
  onConfirm?: () => void;
}

const AddModal = ({ isModal, onClose, onConfirm, name }: ModalType) => {
  return (
    <GlobalModal
      isOpen={isModal}
      onClose={onClose}
      children  ={
        <div>
          <div>
            <div>
              <label className="text-lg font-medium my-2" htmlFor="photo">
                Choice photo
              </label>
              <input className="mt-2" id="photo" type="file" />
            </div>
            <div className="mt-5">
              <label className="text-lg font-medium" htmlFor="photo">
                Enter your {name ? name : 'Name'}
              </label>
              <input
                className="w-full outline-none bg-transparent border py-2 px-3 rounded-lg my-3"
                type="text"
              />
            </div>
          </div>
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
export default AddModal;

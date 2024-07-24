import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Table from '../components/Tables/Table';
import AddModal from '../components/modal/add-modal';
import useGet from '../hooks/get';
import DeleteModal from '../components/modal/deleteModal';
import useDelete from '../hooks/delete';
import { toast } from 'sonner';

const DetailCategory = () => {
  const [toggle, setToggle] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const { data, get, isLoading } = useGet();
  const [deleteId, setDeleteId] = useState<number>();
  const { data: editData, remove } = useDelete();

  const toggleModal = () => setToggle(!toggle);
  const deleteToggleModal = () => setDeleteModal(!deleteModal);

  const handleDelete = () => {
    remove('/detail-category', deleteId);
    get('/detail-category/list');
    deleteToggleModal();
    toast.success('Succsesfuly deleted');
  };

  useEffect(() => {
    get('/detail-category/list');
  }, [editData, deleteModal]);

  return (
    <>
      <Breadcrumb pageName="Detail Category" />

      <button
        onClick={toggleModal}
        className="rounded-lg shadow my-5 bg-gary-600 dark:bg-boxdark px-5 py-2"
      >
        Add
      </button>
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <Table
          deleteModal={deleteToggleModal}
          data={data && data.object}
          isLoading={isLoading}
          setDeleteId={setDeleteId}
        />
      </div>
      <AddModal isModal={toggle} onClose={toggleModal} />
      <DeleteModal
        isModal={deleteModal}
        onClose={deleteToggleModal}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default DetailCategory;

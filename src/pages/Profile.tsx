import { HtmlHTMLAttributes, useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Table from '../components/Tables/Table';
import AddModal from '../components/modal/add-modal';
import useGet from '../hooks/get';
import DeleteModal from '../components/modal/deleteModal';
import useDelete from '../hooks/delete';
import { toast } from 'sonner';
import GlobalModal from '../components/modal';
import Input from '../components/inputs/input';
import usePost from '../hooks/post';

const DetailCategory = () => {
  // custom hooks
  const { data, get, isLoading } = useGet();
  const { data: editData, remove } = useDelete();
  const { data: postData, isLoading: postIsLoading, post } = usePost();
  //
  const [toggle, setToggle] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number>();
  const [file, setFile] = useState<any>();
  const [val, setVal] = useState({
    name: '',
    attachmentId: 0,
  });
  const [editModal, setEditModal] = useState(false);

  const toggleModal = () => setToggle(!toggle);
  const deleteToggleModal = () => setDeleteModal(!deleteModal);
  const editToggleModal = () => setEditModal(!editModal);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      post('/attachment/upload', formData);
      console.log(postData);
    } catch (error) {
      toast.error('Error');
    }
  };

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
          updataModal={editToggleModal}
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
      <GlobalModal
        isOpen={editModal}
        onClose={editToggleModal}
        children={
          <div>
            <Input type="file" onChange={handleImageChange} />
            <Input
              label="Name"
              value={val.name}
              onChange={(e) => setVal({ ...val, name: e.target.value })}
            />
          </div>
        }
      />
    </>
  );
};

export default DetailCategory;

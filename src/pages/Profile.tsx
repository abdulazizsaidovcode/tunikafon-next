import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Table from '../components/Tables/Table';
import useGet from '../hooks/get';
import DeleteModal from '../components/modal/deleteModal';
import useDelete from '../hooks/delete';
import { toast } from 'sonner';
import GlobalModal from '../components/modal';
import Input from '../components/inputs/input';
import usePut from '../hooks/put';
import usePost from '../hooks/post';
import axios from '../service/api';

const DetailCategory = () => {
  // custom hooks
  const { data, get, isLoading } = useGet();
  const { data: removeData, remove } = useDelete();
  const { isLoading: putIsLoading, put } = usePut();
  const { post, isLoading: postIsLoading } = usePost();

  const [toggle, setToggle] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number>();
  const [update, setUpdate] = useState<any>();
  const [file, setFile] = useState<any>();
  const [val, setVal] = useState<string>('');
  const [name, setName] = useState<string>();
  const [editModal, setEditModal] = useState(false);

  const toggleModal = () => setToggle(!toggle);
  const deleteToggleModal = () => setDeleteModal(!deleteModal);
  const editToggleModal = () => setEditModal(!editModal);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const addDetailCategory = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (!name?.length || !formData.has('file')) {
        throw new Error('All feads reqired');
      }

      const { data } = await axios.post(`/attachment/upload`, formData);

      if (data.body) {
        await post(`/detail-category`, {
          name: name,
          attachmentId: data.body,
        });
      }
      get('/detail-category/list');
      toggleModal();
      toast.success('Succsesfully added');
    } catch (error) {
      toast.error('Error');
    } finally {
      setName('');
      setFile(null);
    }
  };

  const handleEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (val?.length === 0 || !formData.has('file')) throw new Error();
      else if (update) {
        if (!formData.has('file')) {
          await put(`/attachment`, update.attachmentId, formData);
        }

        await put(`/detail-category`, update.id, {
          name: val,
          attachmentId: update.attachmentId,
        });

        editToggleModal();
        await get('/detail-category/list');
        toast.success('Successfully updated');
      }
    } catch (error) {
      toast.error('Error');
      console.log(error);
    } finally {
      setVal('');
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await remove(`/detail-category`, deleteId);
      get('/detail-category/list');
      deleteToggleModal();
      toast.success('Successfully deleted');
    }
  };

  useEffect(() => {
    get('/detail-category/list');
  }, [removeData, deleteModal, editModal, toggle]);

  return (
    <>
      <Breadcrumb pageName="Detail Category" />

      <button
        onClick={toggleModal}
        className="rounded-lg shadow my-5 bg-gray-600 dark:bg-boxdark px-5 py-2"
      >
        Add
      </button>
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <Table
          setUpdate={setUpdate}
          updataModal={editToggleModal}
          deleteModal={deleteToggleModal}
          data={data?.object}
          isLoading={isLoading}
          setDeleteId={setDeleteId}
        />
      </div>
      <DeleteModal
        isModal={deleteModal}
        onClose={deleteToggleModal}
        onConfirm={handleDelete}
      />
      <GlobalModal isOpen={editModal} onClose={editToggleModal}>
        <div>
          <Input label="Image" type="file" onChange={handleImageChange} />
          <div>
            <label className="block mb-2">Name</label>
            <input
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="mb-4 w-full py-2 px-4 border rounded outline-none bg-transparent"
            />
          </div>
          <div className="flex justify-between">
            <button
              onClick={editToggleModal}
              className="rounded-lg px-4 py-2 bg-graydark text-white"
            >
              Close
            </button>
            <button
              disabled={putIsLoading}
              onClick={handleEdit}
              className="rounded-lg px-4 py-2 bg-green-500 text-white"
            >
              {postIsLoading ? 'Loading...' : 'Edit'}
            </button>
          </div>
        </div>
      </GlobalModal>
      <GlobalModal
        isOpen={toggle}
        onClose={toggleModal}
        children={
          <div>
            <div>
              <div>
                <label className="text-lg font-medium my-2" htmlFor="photo">
                  Choice photo
                </label>
                <input
                  onChange={handleImageChange}
                  className="mt-2"
                  id="photo"
                  type="file"
                />
              </div>
              <div className="mt-5">
                <label className="text-lg font-medium" htmlFor="photo">
                  Enter your Name
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  className="w-full outline-none bg-transparent border py-2 px-3 rounded-lg my-3"
                  type="text"
                />
              </div>
            </div>
            <div className="w-full flex justify-between">
              <button
                onClick={toggleModal}
                className="rounded-lg px-3 py-2 bg-graydark"
              >
                Close
              </button>
              <button
                disabled={postIsLoading}
                onClick={addDetailCategory}
                className="rounded-lg px-3 py-2 bg-green-500 text-white"
              >
                {postIsLoading ? 'Loading...' : 'Save'}
              </button>
            </div>
          </div>
        }
      />
    </>
  );
};

export default DetailCategory;

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
import ReactPaginate from 'react-paginate';
import { Button } from '@material-tailwind/react';

const DetailCategory = () => {
  const { data, get, isLoading } = useGet();
  const { remove, isLoading: deleteIsLoading } = useDelete();
  const { isLoading: putIsLoading, put, error } = usePut();
  const { post, isLoading: postIsLoading } = usePost();
  const [imgUploadLoading, setImgUploadLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number>();
  const [update, setUpdate] = useState<any>();
  const [file, setFile] = useState<any>(null);
  const [val, setVal] = useState<string>('');
  const [name, setName] = useState<string>();
  const [editModal, setEditModal] = useState(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

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

      if (!name?.trim() || !file) {
        throw new Error('All fields required');
      }

      setImgUploadLoading(true);

      const { data } = await axios.post('/attachment/upload', formData);
      if (data.body) {
        await post('/detail-category', {
          name: name,
          attachmentId: data.body,
        });
      }

      await get('/detail-category/list', page);
      toggleModal();
      setImgUploadLoading(false);
      setName('');
      setFile(null);
      toast.success('Successfully added');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const validateInput = (value: string) => {
    const invalidChars = /[<>"?><|\/*]/;
    if (!value.trim() || invalidChars.test(value)) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setName(newValue);
    validateInput(newValue);
  };

  const handleEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (!val?.trim().length) {
        throw new Error('All fields required');
      }

      if (update) {
        if (file) await put(`/attachment`, update.attachmentId, formData);
        else {
          await put(`/detail-category`, update.id, {
            name: val.trim(),
            attachmentId: update.attachmentId,
          });
          if (error) throw new Error();

          editToggleModal();
          get('/detail-category/list', page);
          setVal('');
          setFile(null);
          toast.success('Successfully updated');
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await remove(`/detail-category/`, deleteId);
      await get('/detail-category/list', page);
      deleteToggleModal();
      toast.success('Successfully deleted');
    }
  };

  const handlePageClick = (page: any) => {
    setPage(page.selected);
  };

  useEffect(() => {
    get('/detail-category/list', page);
  }, [page]);

  useEffect(() => {
    if (update) {
      setVal(update.name);
    }
  }, [update, editModal]);

  return (
    <>
      <Breadcrumb pageName="Detail Category" />
      <Button
        onClick={toggleModal}
        className="bg-gray-600 dark:bg-boxdark my-5"
      >
        Add
      </Button>
      <div>
        <Table
          setUpdate={setUpdate}
          updataModal={editToggleModal}
          deleteModal={deleteToggleModal}
          data={data?.object}
          isLoading={isLoading}
          setDeleteId={setDeleteId}
        />
      </div>
      {!isLoading && data && data.object ? (
        <ReactPaginate
          className="flex gap-3 navigation mt-5"
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={data && data.totalPage}
          previousLabel="<"
          renderOnZeroPageCount={null}
          forcePage={page}
        />
      ) : null}
      <DeleteModal
        isModal={deleteModal}
        onClose={deleteToggleModal}
        onConfirm={handleDelete}
        isLoading={deleteIsLoading}
      />
      <GlobalModal
        isOpen={toggle}
        onClose={toggleModal}
        children={
          <div>
            <div>
              <Input label="Image" onChange={handleImageChange} type="file" />
              <div className="mt-5">
                <Input
                  label="Enter your Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value), handleNameChange;
                  }}
                />
              </div>
            </div>
            <div className="w-full flex justify-end gap-5">
              <Button onClick={toggleModal} color="red">
                Close
              </Button>
              <Button
                disabled={imgUploadLoading || postIsLoading}
                onClick={addDetailCategory}
                color="green"
              >
                {imgUploadLoading || postIsLoading ? 'Loading...' : 'Add'}
              </Button>
            </div>
          </div>
        }
      />
      <GlobalModal isOpen={editModal} onClose={editToggleModal}>
        <div>
          <Input label="Image" type="file" onChange={handleImageChange} />
          <div>
            <label className="block mb-2">Name</label>
            <input
              value={val}
              type="text"
              onChange={(e) => {
                setVal(e.target.value), handleNameChange;
              }}
              className="mb-4 w-full py-2 px-4 border rounded outline-none bg-transparent"
            />
          </div>
          <div className="flex justify-end gap-5">
            <Button color="red" onClick={editToggleModal}>
              Close
            </Button>
            <Button color="green" disabled={putIsLoading} onClick={handleEdit}>
              {putIsLoading ? 'Loading...' : 'Edit'}
            </Button>
          </div>
        </div>
      </GlobalModal>
    </>
  );
};

export default DetailCategory;

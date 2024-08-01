import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import useGet from '../hooks/get';
import GlobalModal from '../components/modal';
import Input from '../components/inputs/input';
import { FaRegEdit, FaRegFolderOpen } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import usePost from '../hooks/post';
import { toast } from 'sonner';
import DeleteModal from '../components/modal/deleteModal';
import useDelete from '../hooks/delete';
import usePut from '../hooks/put';
import axios from '../service/api';
import ReactPaginate from 'react-paginate';

const Employees = () => {
  const { post, isLoading: postIsloading, error } = usePost();
  const { data, isLoading, get } = useGet();
  const { remove, isLoading: deleteIsLoading } = useDelete();
  const { put, isLoading: putIsLoading, error: putError } = usePut();

  const [toggle, setToggle] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [editModal, setEditModal] = useState(false);
  const [edit, setEdit] = useState<any>();
  const [file, setFile] = useState<any>();
  const [all, setAll] = useState({
    fullName: '',
    phoneNumber: '',
    password: '',
  });

  const toggleModal = () => setToggle(!toggle);
  const editToggleModal = () => setEditModal(!editModal);
  const deleteToggleModal = () => setDeleteModal(!deleteModal);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDelete = async () => {
    try {
      await remove('/user', deleteId);
      deleteToggleModal();
      get('/user/employees');
      toast.success('Succesfuly deleted');
    } catch (error) {
      toast.error('Error');
    }
  };

  const handleClick = async () => {
    try {
      if (
        !all.fullName.trim().length ||
        !all.phoneNumber.trim().length ||
        !all.password.trim().length
      )
        throw new Error();
      else {
        await post('/auth/register', all);

        if (error) throw new Error();
        else {
          toast.success('Succesfuly aded');
          toggleModal();
          get('/user/employees');
        }
      }
    } catch (error) {
      toast.error('Error');
    } finally {
      setAll({
        fullName: '',
        phoneNumber: '',
        password: '',
      });
    }
  };

  const handleEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (
        !all.fullName.trim().length ||
        !all.phoneNumber.trim().length ||
        !all.password.trim().length ||
        !formData.has('file')
      )
        throw new Error();

      const { data } = await axios.post(`/attachment/upload`, formData);

      await put('/auth/edit/by/admin', edit.id, {
        ...all,
        attachmentId: data.body,
      });

      if (putError) throw new Error();
      else {
        toast.success('Succesfuly updated');
        editToggleModal();
        get('/user/employees');
      }
    } catch (error) {
      toast.error('Error');
    } finally {
      setAll({
        fullName: '',
        phoneNumber: '',
        password: '',
      });
    }
  };

  const handlePageClick = (page: any) => {
    get('/user/employees', page.selected);
  };

  useEffect(() => {
    get('/user/employees');
  }, []);

  useEffect(() => {
    if (edit) {
      setAll({
        fullName: edit.fullName,
        phoneNumber: edit.phoneNumber,
        password: '',
      });
    }
  }, [edit, editModal]);

  return (
    <>
      <div className="mx-auto">
        <Breadcrumb pageName="Employees" />

        <button
          onClick={toggleModal}
          className="rounded-lg shadow my-5 bg-gary-600 dark:bg-boxdark px-5 py-2"
        >
          Add
        </button>
        <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
            <table className="lg:w-[1145px] md:w-[992px] w-[700px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Phone number
                  </th>
                  <th colSpan={2} scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr className="px-6 py-4">
                    <div className="w-10 h-10 animate-spin rounded-full border-4 border-black dark:border-white border-dotted" />
                  </tr>
                )}
                {data && data.object.length
                  ? data.object.map((item: any, i: number) => (
                      <tr
                        key={item.id}
                        className="bg-gray-600 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {i + 1}
                        </th>
                        <td className="px-6 py-4">{item.fullName}</td>
                        <td className="px-6 py-4">{item.phoneNumber}</td>
                        <td className="px-6">
                          <button
                            onClick={() => {
                              editToggleModal();
                              setEdit(item);
                            }}
                          >
                            <FaRegEdit size={25} className="text-green-500" />
                          </button>
                          <button
                            onClick={() => {
                              deleteToggleModal();
                              setDeleteId(item.id);
                            }}
                            className="ml-5"
                          >
                            <RiDeleteBinLine
                              size={25}
                              className="text-red-500"
                            />
                          </button>
                        </td>
                      </tr>
                    ))
                  : !isLoading && (
                      <tr className="bg-gray-600 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-6">
                          <FaRegFolderOpen size={50} />
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>
          </div>
        </div>
        <ReactPaginate
          className="flex gap-3 navigation mt-5"
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={data && data.totalPage}
          previousLabel="<"
          renderOnZeroPageCount={null}
        />
      </div>
      <GlobalModal
        isOpen={toggle}
        onClose={toggleModal}
        children={
          <div className="w-96">
            <div>
              <Input
                label="Full name"
                onChange={(e) => setAll({ ...all, fullName: e.target.value })}
                value={all.fullName}
              />
              <Input
                label="PhoneNumber"
                onChange={(e) =>
                  setAll({ ...all, phoneNumber: e.target.value })
                }
                value={all.phoneNumber}
              />
              <Input
                label="Password"
                type="password"
                onChange={(e) => setAll({ ...all, password: e.target.value })}
              />
            </div>
            <div className="w-full flex justify-between">
              <button
                onClick={toggleModal}
                className="rounded-lg px-3 py-2 bg-graydark"
              >
                Close
              </button>
              <button
                disabled={postIsloading}
                onClick={handleClick}
                className="rounded-lg px-3 py-2 bg-green-500 text-white"
              >
                {postIsloading ? 'Loading...' : 'Save'}
              </button>
            </div>
          </div>
        }
      />
      <GlobalModal
        isOpen={editModal}
        onClose={editToggleModal}
        children={
          <div className="w-96">
            <div>
              <Input onChange={handleImageChange} label="Image" type="file" />
              <Input
                label="Full name"
                onChange={(e) => setAll({ ...all, fullName: e.target.value })}
                value={all.fullName}
              />
              <Input
                label="PhoneNumber"
                onChange={(e) =>
                  setAll({ ...all, phoneNumber: e.target.value })
                }
                value={all.phoneNumber}
              />
              <Input
                label="Password"
                type="password"
                onChange={(e) => setAll({ ...all, password: e.target.value })}
              />
            </div>
            <div className="w-full flex justify-between">
              <button
                onClick={editToggleModal}
                className="rounded-lg px-3 py-2 bg-graydark"
              >
                Close
              </button>
              <button
                disabled={putIsLoading}
                onClick={handleEdit}
                className="rounded-lg px-3 py-2 bg-green-500 text-white"
              >
                {postIsloading ? 'Loading...' : 'Edit'}
              </button>
            </div>
          </div>
        }
      />
      <DeleteModal
        isModal={deleteModal}
        onClose={deleteToggleModal}
        onConfirm={handleDelete}
        isLoading={deleteIsLoading}
      />
    </>
  );
};

export default Employees;

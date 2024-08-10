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

interface Type {
  fullName: string;
  phoneNumber: any;
  password: string;
}

const Employees = () => {
  const { post, isLoading: postIsloading } = usePost();
  const { data, isLoading, get } = useGet();
  const { remove, isLoading: deleteIsLoading } = useDelete();
  const { put, isLoading: putIsLoading, error: putError } = usePut();

  const [toggle, setToggle] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [editModal, setEditModal] = useState(false);
  const [edit, setEdit] = useState<any>();
  const [file, setFile] = useState<any>();
  const [page, setPage] = useState<number>(0);
  const [imageUpdateLoading, setImageUpdateLoading] = useState(false);
  const [all, setAll] = useState<Type>({
    fullName: '',
    phoneNumber: null,
    password: '',
  });

  const toggleModal = () => {
    setToggle(!toggle);
    setAll({
      fullName: '',
      phoneNumber: null,
      password: '',
    });
  };
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
      get('/user/employees', page);
      toast.success('Succesfuly deleted');
    } catch (error) {
      toast.error('Error');
    }
  };

  const handleClick = async () => {
    try {
      if (
        !all.fullName.trim().length ||
        !all.phoneNumber.length ||
        !all.password.trim().length
      )
        throw new Error('All fields required');

      if (all.phoneNumber.length !== 12) {
        throw new Error('The length of the number should be 13 characters.');
      }

      if (!all.phoneNumber.startsWith(+998)) {
        throw new Error('The number must start with +998.');
      }

      const raqamQismi = all.phoneNumber.slice(1);
      if (!/^\d+$/.test(raqamQismi)) {
        throw new Error(
          'The number must consist of numbers only (except for the + sign at the beginning).',
        );
      }

      await post('/auth/register', {
        ...all,
        phoneNumber: `+${all.phoneNumber}`,
      });

      toast.success('Succesfuly aded');
      toggleModal();
      get('/user/employees', page);

      setAll({
        fullName: '',
        phoneNumber: null,
        password: '',
      });
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (!all.fullName.trim().length || !all.password.trim().length || !file)
        throw new Error('All fields required');

      if (all.phoneNumber.toString().length !== 12) {
        throw new Error('The length of the number should be 13 characters.');
      }

      setImageUpdateLoading(true);
      const { data } = await axios.post(`/attachment/upload`, formData);

      if (data.body) {
        await put('/auth/edit/by/admin', edit.id, {
          ...all,
          phoneNumber: `+${all.phoneNumber}`, 
          attachmentId: data.body,
        });
      }

      if (putError) throw new Error();
      else {
        toast.success('Successfully updated');

        get('/user/employees', page);
      }
      setAll({
        fullName: '',
        phoneNumber: null,
        password: '',
      });
      setFile(null);
      editToggleModal();
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setImageUpdateLoading(false);
    }
  };
  const handlePageClick = (page: any) => {
    setPage(page.selected);
  };

  useEffect(() => {
    get('/user/employees', page);
  }, [page]);

  useEffect(() => {
    if (edit) {
      setAll({
        fullName: edit.fullName,
        phoneNumber: +edit.phoneNumber,
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
        {isLoading ? (
          <div className="w-full flex justify-center">
            <div
              className="inline-block h-20 w-20 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        ) : (
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
                  {data && data.object.length
                    ? data.object.map((item: any, i: number) => (
                        <tr
                          key={item.id}
                          className="bg-gray-600 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <th
                            scope="row"
                            className="px-6 py-5 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {i + 1}
                          </th>
                          <td className="px-6 py-5">{item.fullName}</td>
                          <td className="px-6 py-5">{item.phoneNumber}</td>
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
        )}

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
                type="number"
                onChange={(e) => {
                  setAll({ ...all, phoneNumber: e.target.value });
                }}
                value={all.phoneNumber}
              />
              <Input
                label="Password"
                type="password"
                onChange={(e) => setAll({ ...all, password: e.target.value })}
                value={all.password}
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
                type="number"
                onChange={(e) =>
                  setAll({ ...all, phoneNumber: e.target.value })
                }
                value={all.phoneNumber}
              />
              <Input
                label="Password"
                type="password"
                onChange={(e) => setAll({ ...all, password: e.target.value })}
                value={all.password}
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
                disabled={putIsLoading || imageUpdateLoading}
                onClick={handleEdit}
                className="rounded-lg px-3 py-2 bg-green-500 text-white"
              >
                {putIsLoading || imageUpdateLoading ? 'Loading...' : 'Edit'}
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
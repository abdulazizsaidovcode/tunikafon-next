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

const Employees = () => {
  const { post, isLoading: postIsloading, error } = usePost();
  const { data, isLoading, get } = useGet();
  const { remove, isLoading: deleteIsLoading } = useDelete();
  const [toggle, setToggle] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [add, setAdd] = useState({
    fullName: '',
    phoneNumber: '',
    password: '',
  });

  const toggleModal = () => setToggle(!toggle);
  const deleteToggleModal = () => setDeleteModal(!deleteModal);

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
        !add.fullName.length ||
        !add.phoneNumber.length ||
        !add.password.length
      )
        throw new Error();
      else {
        await post('/auth/register', add);

        if (error) throw new Error();
        else {
          toast.success('Succesfuly added');
          toggleModal();
          get('/user/employees');
        }
      }
    } catch (error) {
      toast.error('Error');
    }
  };

  useEffect(() => {
    get('/user/employees');
  }, []);

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
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                    <div className="w-10 h-10 animate-spin rounded-full border-4 border-white border-dotted" />
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
                          //  onClick={() => handleEdit(item)}
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
      </div>
      <GlobalModal
        isOpen={toggle}
        onClose={toggleModal}
        children={
          <div className="w-96">
            <div>
              <Input
                label="Full name"
                onChange={(e) => setAdd({ ...add, fullName: e.target.value })}
              />
              <Input
                label="PhoneNumber"
                onChange={(e) =>
                  setAdd({ ...add, phoneNumber: e.target.value })
                }
              />
              <Input
                label="Password"
                type="password"
                onChange={(e) => setAdd({ ...add, password: e.target.value })}
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

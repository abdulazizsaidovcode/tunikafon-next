import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import AddModal from '../components/modal/add-modal';
import { FaRegEdit, FaRegFolderOpen } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import axios from '../service/api';
import { attechment } from '../service/urls';
import EditModal from '../components/modal/CatygoryEditmodal';
import DeleteModal from '../components/modal/deleteModal'; // Ensure you import the delete modal
import useGet from '../hooks/get';
import { toast } from 'sonner';

interface Item {
  id: number;
  attachmentId: string | number;
  name: string;
}

const Category = () => {
  const [toggle, setToggle] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const { data, get, isLoading, error } = useGet();

  const toggleModal = () => setToggle(!toggle);

  const handleEditClick = (item: Item) => {
    setSelectedItem(item);
    setEditModal(true);
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    setSelectedItem(null);
  };

  const handleDeleteClick = (item: Item) => {
    setSelectedItem(item);
    setDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
    setSelectedItem(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedItem) {
      try {
        await axios.delete(`/category/${selectedItem.id}`);
        get('/category/list');
        toast.success('Category deleted')
      } catch (e) {
        toast.error('Failed to delete item:');
      }
      handleCloseDeleteModal();
    }
  };

  useEffect(() => {
    get('/category/list');
  }, []);

  return (
    <>
      <Breadcrumb pageName="Category" />

      <button
        onClick={toggleModal}
        className="rounded-lg shadow my-5 bg-gray-600 dark:bg-boxdark px-5 py-2"
      >
        Add
      </button>

      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"></div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                #
              </th>
              <th scope="col" className="px-6 py-3">
                Photo
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th colSpan={2} scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <div>Loading...</div>}
            {data && data.object.length ? (
              data.object.map((item: Item, i: number) => (
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
                  <td className="px-6 py-4">
                    <img
                      src={attechment + item.attachmentId}
                      alt="Img not found"
                      className="w-20 h-20 rounded-full bg-cover object-cover"
                    />
                  </td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 align-middle">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="cursor-pointer"
                    >
                      <FaRegEdit size={25} className="text-green-500 mr-2" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="cursor-pointer"
                    >
                      <RiDeleteBinLine size={25} className="text-red-500" />
                    </button>
                  </td>
                  <td className="px-6"></td>
                </tr>
              ))
            ) : (
              ''
            )}
          </tbody>
        </table>
      </div>

      <AddModal 
        isModal={toggle} 
        onClose={toggleModal}
      />
      {editModal && selectedItem && (
        <EditModal
          getting={() => get('/category/list')}
          isModal={editModal}
          onClose={handleCloseEditModal}
          item={selectedItem}
        />
      )}
      {deleteModal && selectedItem && (
        <DeleteModal
          isModal={deleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          item={selectedItem}
        />
      )}
    </>
  );
};

export default Category;

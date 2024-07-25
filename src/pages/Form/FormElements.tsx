import { FaRegEdit, FaRegFolderOpen } from 'react-icons/fa';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import useGet from '../../hooks/get';
import { attechment } from '../../service/urls';
import EditModal from '../../components/modal/DetailEditModal';
import DeleteModal from '../../components/modal/deleteModal';
import useDelete from '../../hooks/delete';
import { toast } from 'sonner';
import Input from '../../components/inputs/input';
import GlobalModal from '../../components/modal';

const Detail = () => {
  const { data, error, isLoading, get } = useGet();
  const { remove, isLoading: deleteIsloading } = useDelete();
  const [editModal, setEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [addModal, setAddModal] = useState(false); // State for add modal

  useEffect(() => {
    get('/detail', 0);
  }, [editModal, addModal]); // Fetch data when modals close

  const handleCloseEditModal = () => setEditModal(false);
  const deleteToggleModal = () => setDeleteModal(!deleteModal);
  const addToggleModal = () => setAddModal(!addModal); 

  const handleDelete = async () => {
    try {
      await remove('/detail', deleteId);
      toast.success('Successfully deleted');
      deleteToggleModal();
      get('/detail');
    } catch (error) {
      toast.error('Error');
    }
  };

  const openEditModal = (item: any) => {
    setSelectedItem(item);
    setEditModal(true);
  };

  return (
    <>
      <Breadcrumb pageName="Detail" />

      <div className="w-full flex justify-between items-center">
        <button 
          className="rounded-lg my-5 shadow bg-gray-600 dark:bg-boxdark px-5 py-2"
          onClick={addToggleModal} // Open add modal
        >
          Add
        </button>
        <input
          className="bg-transparent border rounded-lg outline-none px-3 py-2"
          type="text"
          placeholder="Search"
        />
      </div>
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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
                <th scope="col" className="px-6 py-3">
                  Detail Category
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Measure
                </th>
                <th colSpan={2} scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data && data.object.length ? (
                data.object.map((item: any, i: number) => (
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
                        className="w-15 h-15 rounded-full object-cover"
                        src={`${attechment}${item.attachmentId}`}
                        alt=""
                      />
                    </td>
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">{item.detailCategoryId}</td>
                    <td className="px-6 py-4">{item.description}</td>
                    <td className="px-6 py-4">{item.price}</td>
                    <td className="px-6 py-4">{item.measure}</td>
                    <td className="px-6">
                      <button onClick={() => openEditModal(item)}>
                        <FaRegEdit size={25} className="text-green-500" />
                      </button>
                      <button
                        onClick={() => {
                          deleteToggleModal();
                          setDeleteId(item.id);
                        }}
                        className="ml-3"
                      >
                        <RiDeleteBinLine size={25} className="text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
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
      {selectedItem && (
        <EditModal
          getting={() => get('/category/list')}
          isModal={editModal}
          onClose={handleCloseEditModal}
          item={selectedItem}
        />
      )}
      <DeleteModal
        isModal={deleteModal}
        onClose={deleteToggleModal}
        isLoading={deleteIsloading}
        onConfirm={handleDelete}
      />
      <GlobalModal isOpen={addModal} onClose={addToggleModal}>
        <div className="p-4">
          <h2 className="text-xl mb-4">Add Detail</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <label className="block mb-2">Name</label>
          <input
            type="text"
            name="name"
            className="w-full p-2 mb-4 border rounded"
          />
          <label className="block mb-2">Detail Category ID</label>
          <input
            type="number"
            name="detailCategoryId"
            className="w-full p-2 mb-4 border rounded"
          />
          <label className="block mb-2">Measure Value</label>
          <input
            type="number"
            name="measureValue"
            className="w-full p-2 mb-4 border rounded"
          />
          <label className="block mb-2">Measure</label>
          <input
            type="text"
            name="measure"
            className="w-full p-2 mb-4 border rounded"
          />
          <label className="block mb-2">Price</label>
          <input
            type="number"
            name="price"
            className="w-full p-2 mb-4 border rounded"
          />
          <label className="block mb-2">Description</label>
          <input
            type="text"
            name="description"
            className="w-full p-2 mb-4 border rounded"
          />
          <Input label="Image" type="file" />
          <div className="flex justify-end">
            <button
              className="mr-4 px-4 py-2 bg-gray-500 text-white rounded"
              onClick={addToggleModal} // Close modal on cancel
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {isLoading ? 'Loading...' : 'Save'}
            </button>
          </div>
        </div>
      </GlobalModal>
    </>
  );
};

export default Detail;

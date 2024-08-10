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
import axios from '../../service/api';
import usePost from '../../hooks/post';
import '../../css/style.css';
import ReactPaginate from 'react-paginate';

const Detail = () => {
  const { data, error, isLoading, get } = useGet();
  const { remove, isLoading: deleteIsloading } = useDelete();
  const { post, isLoading: postIsLoading } = usePost();
  const [editModal, setEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [addModal, setAddModal] = useState(false);
  const [detailCategory, setDetailCategory] = useState<any[]>();
  const [file, setFile] = useState<any>();
  const [isValid, setIsValid] = useState<boolean>(false);
  const [name, setName] = useState<string>('');

  const [addData, setAddData] = useState<any>({
    name: '',
    attachmentId: 0,
    detailCategoryId: 0,
    measureValue: 0,
    measure: '',
    price: 0,
    description: '',
  });

  const [searchQuery, setSearchQuery] = useState('');

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
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
  const handleClick = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (
        !formData.has('file') ||
        !addData.name ||
        !addData.detailCategoryId ||
        !addData.measureValue ||
        !addData.measure ||
        !addData.price ||
        !addData.description
      ) {
        throw new Error('All fields required');
      }

      const { data } = await axios.post(`/attachment/upload`, formData);

      await post('/detail', {
        ...addData,
        detailCategoryId: +addData.detailCategoryId,
        measureValue: +addData.measureValue,
        attachmentId: data.body,
      });

      get('/detail');
      toast.success('Succesfuly created');
      addToggleModal();
    } catch (error) {
      toast.error('Error');
    }
  };

  const handlePageClick = (page: any) => {
    get('/detail', page.selected);
  };

  const openEditModal = (item: any) => {
    setSelectedItem(item);
    setEditModal(true);
  };

  useEffect(() => {
    get('/detail');
  }, [editModal, addModal]);

  useEffect(() => {
    async function getDetailCategory() {
      const { data } = await axios.get('/detail-category/list');
      setDetailCategory(data.body.object);
    }

    getDetailCategory();
  }, []);
  const handleSearch = (event: any) => {
    setSearchQuery(event.target.value);
  };
  const filteredData = data?.object
    ?.filter((item: any) =>
      item.name
        .trimStart()
        .toLowerCase()
        .includes(searchQuery.trimStart().toLowerCase()),
    )
    .sort((a: any, b: any) => {
      const aName = a.name.trimStart().toLowerCase();
      const bName = b.name.trimStart().toLowerCase();
      const searchLower = searchQuery.trimStart().toLowerCase();

      const aIndex = aName.indexOf(searchLower);
      const bIndex = bName.indexOf(searchLower);

      if (aIndex === 0 && bIndex !== 0) return -1;
      else if (bIndex === 0 && aIndex !== 0) return 1;
      else return aIndex - bIndex;
    });

  return (
    <>
      <Breadcrumb pageName="Detail" />

      <div className="w-full flex justify-between items-center">
        <button
          className="rounded-lg my-5 shadow bg-gray-600 dark:bg-boxdark px-5 py-2"
          onClick={addToggleModal}
        >
          Add
        </button>
        <input
          className="bg-transparent border rounded-lg outline-none px-3 py-2"
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
          <table className="lg:w-[1145px] w-[992px]  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
              {filteredData && filteredData.length ? (
                filteredData.map((item: any, i: number) => (
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
                    </td>
                    <td className="px-6">
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
      <EditModal
        getting={() => get('/category/list')}
        isModal={editModal}
        onClose={handleCloseEditModal}
        item={selectedItem}
      />
      <DeleteModal
        isModal={deleteModal}
        onClose={deleteToggleModal}
        isLoading={deleteIsloading}
        onConfirm={handleDelete}
      />
      <GlobalModal isOpen={addModal} onClose={addToggleModal}>
        <div className="p-4">
          <h2 className="text-xl mb-4">Add Detail</h2>
          <label className="block mb-2">Name</label>
          <input
            type="text"
            name="name"
            onChange={(e) => {
              setAddData({ ...addData, name: e.target.value }),
                handleNameChange;
            }}
            value={addData.name}
            className="w-full p-2 mb-4 border rounded"
          />
          <label className="block mb-2">Detail Category ID</label>
          <select
            className="w-full rounded px-1 py-2 outline-none"
            onChange={(e) =>
              setAddData({ ...addData, detailCategoryId: e.target.value })
            }
            value={addData.detailCategoryId}
          >
            <option selected>Select Category</option>
            {detailCategory &&
              detailCategory.map((item) => (
                <option value={item.id}>{item.name}</option>
              ))}
          </select>
          <label className="block mb-2">Measure Value</label>
          <input
            type="number"
            name="measureValue"
            onChange={(e) =>
              setAddData({ ...addData, measureValue: e.target.value })
            }
            value={addData.measureValue}
            className="w-full p-2 mb-4 border rounded"
          />
          <select
            className="w-full rounded px-1 py-2"
            onChange={(e) =>
              setAddData({ ...addData, measure: e.target.value })
            }
            value={addData.measure}
          >
            <option value="KG">Kg</option>
            <option value="METER">Metr</option>
            <option value="SM">Sm</option>
            <option value="PIECE">Piece</option>
          </select>
          <label className="block mb-2">Price</label>
          <input
            type="number"
            name="price"
            onChange={(e) => setAddData({ ...addData, price: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
          />
          <label className="block mb-2">Description</label>
          <input
            type="text"
            name="description"
            onChange={(e) => {
              setAddData({ ...addData, description: e.target.value }),
                handleNameChange;
            }}
            className="w-full p-2 mb-4 border rounded"
          />
          <Input onChange={handleImageChange} label="Image" type="file" />
          <div className="flex justify-end">
            <button
              className="mr-4 px-4 py-2 bg-gray-500 text-white rounded"
              onClick={addToggleModal}
            >
              Cancel
            </button>
            <button
              disabled={postIsLoading}
              onClick={handleClick}
              className={'rounded-lg px-3 py-2 bg-green-500 text-white'}
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

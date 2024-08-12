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
import GlobalModal from '../../components/modal';
import axios from '../../service/api';
import usePost from '../../hooks/post';
import '../../css/style.css';
import ReactPaginate from 'react-paginate';
import DetailAddModal from '../../components/modal/DetailAddModal';

const Detail = () => {
  const { data, error, isLoading, get } = useGet();
  const { remove, isLoading: deleteIsloading } = useDelete();
  // const { post, isLoading: postIsLoading } = usePost();
  const [editModal, setEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [addModal, setAddModal] = useState(false);
  const [detailCategory, setDetailCategory] = useState<any[]>();
  // const [file, setFile] = useState<any>();
  // const [isValid, setIsValid] = useState<boolean>(false);
  // const [name, setName] = useState<string>('');



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
            <thead className="text-xs    text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6  py-3">
                  #
                </th>
                <th scope="col" className="px-6 min-w-[120px]  py-3">
                  Photo
                </th> 
                <th scope="col" className="px-6   py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Width
                </th>
                <th scope="col" className="px-6 py-3">
                  Height
                </th>
                <th scope="col" className="px-6 min-w-[170px] py-3">
                  Large Diagonal
                </th>
                <th scope="col" className="px-6 min-w-[170px]  py-3">
                  Small Diagonal
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
                    <td className="px-6 py-4">{item.width}</td>
                    <td className="px-6 py-4">{item.height}</td>
                    <td className="px-6 py-4">{item.largeDiagonal}</td>
                    <td className="px-6 py-4">{item.smallDiagonal}</td>
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
        <DetailAddModal />
      </GlobalModal>
    </>
  );
};

export default Detail;

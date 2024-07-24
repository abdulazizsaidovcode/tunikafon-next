import { useState } from 'react';
import { FaRegEdit, FaRegFolderOpen } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import GlobalModal from '../modal';
import { attechment } from '../../service/urls';

interface DataType {
  id: number;
  name: string;
  attachmentId: number;
}
interface TableType {
  data: DataType[];
  name?: string;
  updataModal?: () => void;
  deleteModal?: () => void;
  isLoading: boolean;
  setDeleteId: (val: number) => void;
}

const Table = ({
  data,
  name,
  isLoading,
  updataModal,
  deleteModal,
  setDeleteId,
}: TableType) => {
  // const [editModal, setEditModal] = useState(false);

  const handleDelete = (id: number) => {
    deleteModal();
    setDeleteId(id);
  };

  return (
    <>
      <div>
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
                  {name ? name : 'Name'}
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
              {data && data.length
                ? data.map((item, i) => (
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
                          className="w-20 h-20 rounded-full object-cover"
                          src={attechment + item.attachmentId}
                          alt=""
                        />
                      </td>
                      <td className="px-6 py-4">{item.name}</td>
                      <td className="px-6">
                        <button onClick={updataModal}>
                          <FaRegEdit size={25} className="text-green-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="ml-5"
                        >
                          <RiDeleteBinLine size={25} className="text-red-500" />
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
      {/* <GlobalModal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        children={
          <div>
            <div>
              <label className="text-lg font-medium my-2" htmlFor="photo">
                Choice photo
              </label>
              <input className="mt-2" id="photo" type="file" />
            </div>
            <div className="mt-5">
              <label className="text-lg font-medium" htmlFor="photo">
                Enter your name
              </label>
              <input
                className="w-full outline-none bg-transparent border py-2 px-3 rounded-lg my-3"
                type="text"
              />
            </div>
            <div className="w-full flex justify-between">
              <button
                onClick={() => setEditModal(false)}
                className="rounded-lg px-3 py-2 bg-graydark"
              >
                Close
              </button>
              <button className="rounded-lg px-3 py-2 bg-green-500 text-white">
                Edit
              </button>
            </div>
          </div>
        }
      /> */}
    </>
  );
};

export default Table;

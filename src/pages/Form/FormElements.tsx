import { FaRegEdit, FaRegFolderOpen } from 'react-icons/fa';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useState } from 'react';

const Detail = () => {
  const [data, setData] = useState([]);
  return (
    <>
      <Breadcrumb pageName="Detail" />

      <div className="w-full flex justify-between items-center">
        <button className="rounded-lg my-5 shadow bg-gary-600 dark:bg-boxdark px-5 py-2">
          Add
        </button>
        <input
          className="bg-transparent border rounded-lg outline-none px-3 py-2"
          type="text"
          placeholder="Search"
        />
      </div>
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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
                {data.length ? (
                  data.map((item) => (
                    <tr className="bg-gray-600 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {item.id}
                      </th>
                      <td className="px-6 py-4">{item.attechment}</td>
                      <td className="px-6 py-4">{item.name}</td>
                      <td className="px-6">
                        <div
                          // onClick={() => setEditModal(!editModal)}
                          className="cursor-pointer"
                        >
                          <FaRegEdit size={25} className="text-green-500" />
                        </div>
                      </td>
                      <td className="px-6">
                        <div className="cursor-pointer">
                          <RiDeleteBinLine size={25} className="text-red-500" />
                        </div>
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
      </div>
    </>
  );
};

export default Detail;

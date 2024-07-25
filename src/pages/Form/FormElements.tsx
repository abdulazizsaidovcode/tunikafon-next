import { FaRegEdit, FaRegFolderOpen } from 'react-icons/fa';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import useGet from '../../hooks/get';
import { attechment } from '../../service/urls';

const Detail = () => {
  const { data, error, isLoading, get } = useGet();
  useEffect(() => {
    get('/detail');
  }, []);
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
                {data && data.object.length ? (
                  data.object.map((item: any, i: number) => (
                    <tr className="bg-gray-600 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {i + 1}
                      </th>
                      <td className="px-6 py-4">
                        <img
                          className="w-15 h-15 rounded-full object-cover"
                          src={attechment + item.attachmentId}
                          alt=""
                        />
                      </td>
                      <td className="px-6 py-4">{item.name}</td>
                      <td className="px-6 py-4">{item.detailCategoryId}</td>
                      <td className="px-6 py-4">{item.description}</td>
                      <td className="px-6 py-4">{item.price}</td>
                      <td className="px-6 py-4">{item.measure}</td>
                      <td className="px-6 ">
                        <button>
                          <FaRegEdit size={25} className="text-green-500" />
                        </button>
                        <button className="ml-3">
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
      </div>
    </>
  );
};

export default Detail;

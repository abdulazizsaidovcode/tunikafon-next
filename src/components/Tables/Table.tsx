import { FaRegEdit, FaRegFolderOpen } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import { attechment } from '../../service/urls';
import ImagePreview from '../imgView/Imgview';

interface DataType {
  id: number;
  name: string;
  attachmentId: number;
}
interface TableType {
  data: DataType[];
  name?: string;
  updataModal: () => void;
  deleteModal: () => void;
  isLoading: boolean;
  setDeleteId: (val: number) => void;
  setUpdate: (val: number) => void;
  page?: number
}

const Table = ({
  data,
  name,
  isLoading,
  updataModal,
  deleteModal,
  setDeleteId,
  setUpdate,
  page = 0
}: TableType) => {
  const handleDelete = (id: number) => {
    deleteModal();
    setDeleteId(id);
  };

  const handleEdit = (data: any) => {
    updataModal();
    setUpdate(data);
  };

  return (
    <>
      {isLoading ? (
        <div className="w-full flex justify-center">
          <div
            className="inline-block h-20 w-20 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading....
            </span>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default ">
          <div className="w-full max-w-full rounded-sm border border-stroke bg-white ">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
              {/* lg:w-[1145px] w-[992px]  bunaqa qlib width berilmaydida......... */}
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      #
                    </th>
                    <th scope="col" className="px-6 min-w-[130px] py-3">
                      Rasm
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {name ? name : 'Nomi'}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Harakat
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.length
                    ? data.map((item: any, i: any) => (
                      <tr
                        key={item.id}
                        className="bg-gray-600 border-b  hover:bg-gray-50 "
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                        >
                          {(page && page * 10) + i + 1}
                        </th>
                        <td className="px-6 py-4">
                          <ImagePreview
                            imageUrl={`${attechment}${item.attachmentId}`}
                            altText={item.name}
                          />
                        </td>
                        <td className="px-6 py-4">{item.name}</td>
                        <td className="px-6 flex pt-10">
                          <button onClick={() => handleEdit(item)}>
                            <FaRegEdit size={25} className="text-green-500" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
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
                      <tr className="bg-gray-600 border-b   hover:bg-gray-50 ">
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
      )}
    </>
  );
};

export default Table;

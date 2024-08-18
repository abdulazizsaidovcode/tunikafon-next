import { useEffect, useState } from 'react';
import { FaEye, FaRegFolderOpen } from 'react-icons/fa';
import { attechment } from '../../service/urls';
import { FaArrowDownLong } from 'react-icons/fa6';
import useGet from '../../hooks/get';
import GlobalModal from '../modal';
import ReactPaginate from 'react-paginate';
import { Order } from '../../types/Order';
import usePut from '../../hooks/put';
import FilterForm from './filterTable';
import { dashboardStore } from '../../helpers/dashboard';
import { fetchFilteredData } from '../../helpers/apiFunctions/filter';
import { toast } from 'sonner';
export default function TableOrderAll() {
  const { get, isLoading } = useGet();
  const { page, setPage, setData, data, employeeName,
    ORDER_STATUS,
    address,
    date } = dashboardStore();
  const { get: getOne, data: dateOne } = useGet();
  const [toggle, setToggle] = useState(false);
  const { put } = usePut();

  const formatNumberWithSpaces = (number: number | null) => {
    return number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  useEffect(() => {
    if (employeeName || ORDER_STATUS || address || date) {
      fetchFilteredData(
        { employeeName, ORDER_STATUS, address, date, page },
        setData
      );
    }
    else {
      get('/order/all', page, setData);
    }
  }, [page]);

  const handleEditStatus = (orderId: string, status: string) => {
    put(`/order/update-status/${orderId}?status=${status}`, null, {})
      .then((response) => {
        console.log('Buyurtma holati yangilandi:', response);
        if (employeeName || ORDER_STATUS || address || date) {
          fetchFilteredData(
            { employeeName, ORDER_STATUS, address, date, page },
            setData
          );
        } else get('/order/all', page, setData);
      })
      .catch((err) => {
        toast.error('Error updating order status:', err);
      });
  };

  const toggleModal = () => {
    setToggle(!toggle);
  };

  const handlePageClick = (page: any) => {
    setPage(page.selected);
  };

  const handleViewClick = async (id: string) => {
    await getOne(`/order/one/${id}`);
    toggleModal();
  };

  return (
    <div>
      <div className="w-full mt-6  max-w-full rounded-sm border border-stroke bg-white shadow-default ">
        <div className="w-full max-w-full rounded-sm border border-stroke bg-white ">
          <h1 className='text-3xl ml-6 my-10 text-boxdark font-semibold'>Barcha buyurtmalar </h1>
          <FilterForm />
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">

            <table className="lg:w-[1145px] w-[992px] text-sm text-left rtl:text-right text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    #
                  </th>
                  <th scope="col" className="px-6 min-w-[200px] py-3">
                    Hodim ismi
                  </th>
                  <th scope="col" className="px-6 min-w-[160px] py-3">
                    Narxi
                  </th>
                  <th scope="col" className="px-6 min-w-[200px] py-3">
                    Buyurtma holati
                  </th>
                  <th scope="col" className="px-6 min-w-[200px]  py-3">
                    Manzil
                  </th>
                  <th scope="col" className="px-6 min-w-[200px] py-3">
                    Sana
                  </th>

                  <th colSpan={2} scope="col" className="px-6 py-3">
                    qushimcha
                  </th>
                </tr>
              </thead>
              <tbody>
                {data && data.object && data.object.length > 0
                  ? data.object.map((item: Order, i: number) => (
                    <tr
                      key={item.id}
                      className="bg-gray-600 border-b   hover:bg-gray-50 "
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                      >
                        {(page * 10) + i + 1}
                      </th>
                      {/* <td className="px-6 py-4">
                                                <img
                                                    className="w-20 h-20 rounded-full object-cover"
                                                    src={attechment + item.productAttachmentId}
                                                    alt="(404)"
                                                />
                                            </td> */}
                      <td className="px-6 py-4">{item.employeeName}</td>
                      <td className="px-6 py-4">
                        {formatNumberWithSpaces(item.price)}
                      </td>
                      <td className="px-6 py-4">{item.orderStatus}</td>
                      <td className="px-6 py-4">{item.address}</td>
                      <td className="px-6 py-4">{item.date}</td>
                      <td className="px-6">
                        <select
                          className='w-40'
                          name="editStatus"
                          id="editStatus"
                          onChange={(e) =>
                            handleEditStatus(item.id, e.target.value)
                          }
                        >
                          <option selected={item.orderStatus == "WAIT"} disabled>Kutilmoqda</option>
                          <option selected={item.orderStatus == "COMPLETED"} value="COMPLETED">Tugatilgan</option>
                          <option selected={item.orderStatus == "REJECTED"} value="REJECTED">Bekor qilingan</option>
                        </select>
                      </td>
                      <td className="px-6">
                        <button
                          onClick={() => handleViewClick(item.id)}
                          className="ml-5"
                        >
                          <FaEye size={25} className="text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))
                  : !isLoading && (
                    <tr className="bg-gray-600 border-b  hover:bg-gray-50 ">
                      <td className="px-6 py-4 text-center" colSpan={9}>
                        <FaRegFolderOpen size={50} />
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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

      <GlobalModal isOpen={toggle} onClose={toggleModal}>
        {dateOne && (
          <div className="lg:w-[600px] w-[300px]  flex flex-col gap-2 text-xl md:w-[500px]">
            <h2 className="text-lg font-semibold">Buyurtma ma'lumotlari</h2>
            {/* <p className='flex justify-between'>Employee Name: <span>{dateOne.employeeName || "not included"}</span></p> */}
            <p className="flex justify-between">
              Eni: <span>{dateOne.width || "Ma'lumot kiritilmagan!"}</span>
            </p>
            <p className="flex justify-between">
              Bo'yi: <span>{dateOne.tall || "Ma'lumot kiritilmagan!"}</span>
            </p>
            <p className="flex justify-between">
              Narxi: <span>{dateOne.price || "Ma'lumot kiritilmagan!"}</span>
            </p>
            <p className="flex justify-between">
              Buyurtma Holati:{' '}
              <span>{dateOne.orderStatus || "Ma'lumot kiritilmagan!"}</span>
            </p>
            <p className="flex justify-between">
              Manzil: <span>{dateOne.address || "Ma'lumot kiritilmagan!"}</span>
            </p>
            <p className="flex justify-between">
              Sana: <span>{dateOne.date || "Ma'lumot kiritilmagan!"}</span>
            </p>
            <div className="">
              <div className="flex items-center gap-2">
                <h3 className="text-md font-medium">Buyurtma Detallari:</h3>
                <FaArrowDownLong />
              </div>
              <div className="flex flex-col text-lg gap-3 mt-3">
                {dateOne.orderDetailsRes &&
                  dateOne.orderDetailsRes.length > 0 ? (
                  dateOne.orderDetailsRes.map((detail: any, index: number) =>
                    detail ? (
                      <div
                        key={index}
                        className="p-4 ml-3 flex items-start gap-3 border rounded"
                      >
                        <div>
                          <img
                            src={attechment + detail.detailAttachmentId}
                            alt={detail.detailName}
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        </div>
                        <div className="w-[85%] flex flex-col gap-2 justify-start">
                          <p className="flex justify-between border-b">
                            Detal nomi:{' '}
                            <span>
                              {detail.detailName || "Ma'lumot kiritilmagan !"}
                            </span>
                          </p>
                          <p className="flex justify-between border-b">
                            Miqdori: <span>{detail.amount}</span>
                          </p>
                          {detail.residual && (
                            <p>Qolgan atxod: {detail.residual}</p>
                          )}
                        </div>
                      </div>
                    ) : null,
                  )
                ) : (
                  <p className="pl-4 flex items-center gap-2 text-blue-gray-300">
                    Detal ma'lumotlari topilmadi!!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </GlobalModal>
    </div>
  );
}

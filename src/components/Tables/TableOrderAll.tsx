import { useEffect, useState } from 'react';
import { FaEye, FaRegFolderOpen } from 'react-icons/fa';
import { attechment } from '../../service/urls';
import { FaArrowDownLong } from 'react-icons/fa6';
import useGet from '../../hooks/get';
import GlobalModal from '../modal';
import ReactPaginate from 'react-paginate';
import { Order } from '../../types/Order';
import usePut from '../../hooks/put';
import usePost from '../../hooks/post';
import FilterForm from './filterTable';
import { dashboardStore } from '../../helpers/dashboard';
import { fetchFilteredData } from '../../helpers/apiFunctions/filter';
import { toast } from 'sonner';
import { Button, ListItem, Rating, select } from '@material-tailwind/react';
import { clearFunction } from '../../service/clearFunction';
import { MdDelete, MdPayment } from 'react-icons/md';
import useDelete from '../../hooks/delete';
import ImagePreview from '../imgView/Imgview';

export default function TableOrderAll() {
  const { get, isLoading } = useGet();
  const {
    page,
    setPage,
    setData,
    data,
    employeeName,
    ORDER_STATUS,
    address,
    date,
  } = dashboardStore();
  const { get: getOne, data: dateOne } = useGet();
  const { get: getPayment, data: dataPayment } = useGet(); // New payment hook
  const { put } = usePut();
  const { post, isLoading: loadPost } = usePost();
  const { post: postPay, isLoading: payload } = usePost();

  const { remove } = useDelete();
  const [toggle, setToggle] = useState(false);
  const [toggleStatus, setToggleStatus] = useState(false);
  const [toggleFeedback, setToggleFeedback] = useState(false);
  const [togglePayment, setTogglePayment] = useState(false); // State for payment modal
  const [orderID, setOrderID] = useState('');
  const [orderIDPay, setOrderIDPay] = useState('');
  const [rejectedInformation, setRejectedInformation] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');

  const formatNumberWithSpaces = (number: number | null) => {
    return number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  useEffect(() => {
    if (employeeName || ORDER_STATUS || address || date) {
      fetchFilteredData(
        { employeeName, ORDER_STATUS, address, date, page },
        setData,
      );
    } else {
      get('/order/all', page, setData);
    }
  }, [page]);

  const handleEditStatus = (
    orderId: string,
    status: string,
    rejectedInformation?: string,
  ) => {
    put(
      `/order/update-status/${orderId}?status=${status}${rejectedInformation ? `&rejectedInformation=${rejectedInformation}` : ''}`,
      null,
      {},
    )
      .then(() => {
        if (employeeName || ORDER_STATUS || address || date) {
          fetchFilteredData(
            { employeeName, ORDER_STATUS, address, date, page },
            setData,
          );
          closeModalStatus();
          toast.success('Bekor qilindi');
        } else {
          closeModalStatus();
          get('/order/all', page, setData);
        }
      })
      .catch((err) => {
        toast.error('Error updating order status:', err);
        closeModalStatus();
        clearFunction();
      });
  };

  const handleDeletePayment = async (id: string) => {
    try {
      await remove(`/order-payment/`, id);
      toast.success("To'lov uchirildi");
      getPayment(`/order-payment/order/one/${orderIDPay}`);
    } catch (err) {
      toast.error('Error deleting payment.');
    }
  };
  const handleFeedbackSubmit = async () => {
    const feedbackData = {
      orderId: orderID,
      count: rating,
      message: feedbackMessage,
    };
    try {
      await post('/feedback', feedbackData);
      await put(`/order/update-status/${orderID}?status=COMPLETED`);
      await get('/order/all', page, setData); // Adjust the endpoint and parameters as needed

      toast.success('Baholash kiritildi va buyurtma tugatildi');
      closeModalFeedback();
    } catch (err) {
      toast.error("Xato yuz berdi. Iltimos, qaytadan urinib ko'ring.");
    }
  };

  const handlePaymentSubmit = async () => {
    try {
      await postPay('/order-payment', {
        orderId: orderIDPay,
        amount: paymentAmount,
        date: paymentDate,
      });
      getPayment(`/order-payment/order/one/${orderIDPay}`);
      setPaymentAmount('');
      setPaymentDate('');
      toast.success("To'lov muvaffaqiyatli qo'shildi!");
    } catch (err) {
      toast.error(
        "To'lov amalga oshirilishida xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.",
      );
    }
  };
  const isSubmitDisabled = !paymentAmount || !paymentDate;
  const handlePaymentClick = async (id: string) => {
    setOrderIDPay(id);
    await getPayment(`/order-payment/order/one/${id}`);
    setTogglePayment(true);
  };
  const toggleModal = () => setToggle(!toggle);
  const openModalStatus = () => setToggleStatus(true);
  const FeedbackModal = () => setToggleFeedback(true);
  const closeModalStatus = () => {
    setToggleStatus(false);
    setOrderID('');
    setRejectedInformation('');
  };
  const closeModalFeedback = () => {
    setToggleFeedback(false);
    setFeedbackMessage('');
    setRating(0);
  };
  const closeModalPayment = () => {
    setTogglePayment(false);
  };

  const handlePageClick = (page: any) => setPage(page.selected);
  const handleViewClick = async (id: string) => {
    await getOne(`/order/one/${id}`);
    toggleModal();
  };

  const statusOrder = (name: any) => {
    if (name === 'REJECTED') return 'Bekor qilingan';
    else if (name === 'COMPLETED') return 'Tugatilgan';
    else if (name === 'WAIT') return 'Kutilmoqda';
    else if (name === 'DETAILS_BEING_DELIVERED') return 'Detallar oborilmoqda';
    else if (name === 'IN_PROGRESS') return 'Ish jarayonida';
    else if (name === 'CONFIRMED') return 'Tasdiqlangan';
  };

  const statusColor = (status: any) => {
    if (status === 'WAIT') return 'bg-yellow-300';
    else if (status === 'REJECTED') return 'bg-red-500';
    else if (status === 'COMPLETED') return 'bg-green-500';
    else if (
      status === 'DETAILS_BEING_DELIVERED' ||
      status === 'IN_PROGRESS' ||
      status === 'CONFIRMED'
    )
      return 'bg-blue-500';
  };

  return (
    <div>
      <h1 className="text-2xl  text-boxdark font-semibold ">
        Barcha buyurtmalar{' '}
      </h1>
      <div className="w-full mt-6  max-w-full rounded-sm border border-stroke bg-white shadow-default ">
        <div className="w-full max-w-full rounded-sm border border-stroke bg-white ">
          <FilterForm />
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
            <table className="lg:w-[1145px] w-[992px] text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    #
                  </th>
                  <th scope="col" className="px-6 min-w-[200px] py-3">
                    Hodim ismi
                  </th>
                  <th scope="col" className="px-6 min-w-[200px] py-3">
                    Mijoz ismi
                  </th>
                  <th scope="col" className="px-6 min-w-[250px] py-3">
                    Mijoz telefon raqami
                  </th>
                  <th scope="col" className="px-6 min-w-[200px] py-3">
                    Mijoz lokatsiyasi
                  </th>
                  <th scope="col" className="px-6 min-w-[160px] py-3">
                    Narxi
                  </th>
                  <th scope="col" className="px-6 min-w-[200px] py-3">
                    Buyurtma holati
                  </th>
                  <th scope="col" className="px-6 min-w-[200px] py-3">
                    Manzil
                  </th>
                  <th scope="col" className="px-6 min-w-[200px] py-3">
                    Sana
                  </th>
                  <th scope="col" className="px-6 min-w-[200px] py-3">
                    Holat kiritish
                  </th>
                  <th scope="col" className="px-6 min-w-[200px] py-3">
                    To'lov kiritish
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Qushimcha
                  </th>
                </tr>
              </thead>
              <tbody>
                {data && data.object && data.object.length > 0
                  ? data.object.map((item: Order | any, i: number) => (
                    <tr
                      key={item.id}
                      className="bg-gray-600 border-b hover:bg-gray-50"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {page * 10 + i + 1}
                      </th>
                      <td className="px-6 py-4">{item.employeeName}</td>
                      <td className="px-6 py-4">{item.clientFullName}</td>
                      <td className="px-6 py-4">{item.clientPhoneNumber}</td>
                      <td className="px-6 py-4 ">
                        <a
                          href={`${item.location}`}
                          target="blank"
                          className='text-blue-500 underline'
                          rel="blue" 
                        >
                          {item.location ? "Manzilni ko'rish" : ''}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        {formatNumberWithSpaces(item.price.toFixed())}
                      </td>
                      <td className="px-6 py-4">
                        <p
                          className={`${statusColor(item.orderStatus)} ${item.orderStatus === 'WAIT' ? 'text-black' : 'text-white'} rounded-md text-center py-2`}
                        >
                          {statusOrder(item.orderStatus)}
                        </p>
                      </td>
                      <td className="px-6 py-4">{item.address}</td>
                      <td className="px-6 py-4">{item.date}</td>
                      <td className="px-6">
                        <select
                          className="w-40"
                          name="editStatus"
                          id="editStatus"
                          value={item.orderStatus}
                          onChange={(e) => {
                            const status = e.target.value;
                            if (status === 'REJECTED') {
                              setOrderID(item.id);
                              openModalStatus();
                            } else if (status === 'COMPLETED') {
                              setOrderID(item.id);
                              FeedbackModal();
                            } else {
                              handleEditStatus(item.id, status);
                            }
                          }}
                        >
                          <option value="WAIT" disabled>
                            Kutilmoqda
                          </option>
                          <option value="CONFIRMED">Tasdiqlangan</option>
                          <option value="DETAILS_BEING_DELIVERED">
                            Detallar oborilmoqda
                          </option>
                          <option value="IN_PROGRESS">Ish jarayonida</option>
                          <option value="COMPLETED">Tugatilgan</option>
                          <option value="REJECTED">Bekor qilingan</option>
                        </select>
                      </td>
                      <td className="px-6">
                        <button
                          className="ml-5"
                          onClick={() => handlePaymentClick(item.id)}
                        >
                          <MdPayment size={25} className="text-blue-500" />
                        </button>
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
                    <tr className="bg-gray-600 border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-center" colSpan={11}>
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
          <div className="lg:w-[600px] w-[300px] flex flex-col gap-2 text-xl md:w-[500px]">
            <h2 className="text-lg font-semibold">Buyurtma ma'lumotlari</h2>
            {dateOne.orderStatus === 'REJECTED' && (
              <p className="flex justify-between">
                Bekor qilinganligi haqida:{' '}
                <span>{dateOne.rejectedOrderInformation || '-'}</span>
              </p>
            )}
            <p className="flex justify-between">
              Mijoz ismi: <span>{dateOne.clientFullName || '-'}</span>
            </p>
            <p className="flex justify-between">
              Mijoz telefon raqami: <span>{dateOne.clientPhoneNumber}</span>
            </p>
            <p className="flex justify-between">
              Guruh nomlari: <span>{dateOne.groupNames.join(', ') || '-'}</span>
            </p>
            <p className="flex justify-between">
              Narxi:{' '}
              <span>
                {formatNumberWithSpaces(dateOne.price.toFixed()) || '0'}
              </span>
            </p>
            <p className="flex justify-between">
              Manzil: <span>{dateOne.address || "Ma'lumot kiritilmagan!"}</span>
            </p>
            <p className="flex justify-between">
              Sana: <span>{dateOne.date || "Ma'lumot kiritilmagan!"}</span>
            </p>
            <h1 className="text-xl flex items-center gap-2 font-bold">
              Zakazlar: <FaArrowDownLong />
            </h1>
            <div className="pl-3">
              {dateOne.orderProductDto &&
                dateOne.orderProductDto.map((item: any) => (
                  <div key={item.id} className="p-4 border rounded mb-4">
                    <p className="flex justify-between">
                      Eni: <span>{item.width}</span>
                    </p>
                    <p className="flex justify-between">
                      Buyi: <span>{item.height}</span>
                    </p>
                    {item.orderProductStatus !==
                      'THE_GATE_IS_INSIDE_THE_ROOM' && (
                        <p className="flex justify-between">
                          Sides of House Made:{' '}
                          <span>{item.howManySidesOfTheHouseAreMade || '-'}</span>
                        </p>
                      )}
                    <p className="flex justify-between">
                      Uyning Qayeri ? :
                      <span>
                        {item.orderProductStatus === "INTERIOR_VIEW_OF_THE_HOUSE" && " ichki kurinishi"}
                        {item.orderProductStatus === "EXTERIOR_VIEW_OF_THE_HOUSE" && "Uyning tashqari qismi"}
                        {item.orderProductStatus === "THE_GATE_IS_INSIDE_THE_ROOM" && "Darvoza honaning ichi"}
                      </span>
                    </p>

                    <div className="flex items-center gap-2">
                      <h3 className="text-md font-medium">
                        Buyurtma Detallari:
                      </h3>
                      <FaArrowDownLong />
                    </div>
                    <div className="flex flex-col text-lg gap-3 mt-3">
                      {item.orderDetailsRes &&
                        item.orderDetailsRes.length > 0 ? (
                        item.orderDetailsRes.map(
                          (detail: any, index: number) =>
                            detail ? (
                              <div
                                key={index}
                                className="p-4 ml-3 flex flex-col lg:flex-row items-start gap-3 border rounded"
                              >
                                <div>
                                  <ImagePreview
                                    imageUrl={`${attechment}${detail.detailAttachmentId}`}
                                    altText={item.name}
                                  />
                                </div>
                                <div className="w-[85%] flex flex-col gap-2 justify-start">
                                  <p className="flex justify-between border-b">
                                    Detal nomi{' '}
                                    <span>{detail.detailName || '-'}</span>
                                  </p>
                                  <p className="flex justify-between border-b">
                                    Miqdori: <span>{detail.amount || '-'}{detail.amountType || ' '}</span>
                                  </p>
                                  <p className="flex justify-between border-b">
                                    Rangi: <span>{detail.color || '-'}</span>
                                  </p>
                                  <p className="flex justify-between border-b">
                                    Detal kvadarati:{' '}
                                    <span>{detail.detailKv || '-'}</span>
                                  </p>
                                  {detail.residual && (
                                    <p className="hidden lg:block">
                                      Qolgan atxod: {detail.residual || '-'}
                                    </p>
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
                ))}
            </div>
          </div>
        )}
      </GlobalModal>
      <GlobalModal isOpen={toggleStatus} onClose={closeModalStatus}>
        <div className="lg:w-[600px] w-[300px]  flex flex-col gap-2 text-xl md:w-[500px]">
          <input
            placeholder="Rad etish uchun bironta sabab keltiring"
            className="rounded select-none py-3 p-2 w-full mt-4"
            value={rejectedInformation}
            onChange={(e) => setRejectedInformation(e.target.value)}
          />

          <div className="flex justify-end gap-5">
            <Button color="red" onClick={closeModalStatus}>
              Yopish
            </Button>
            <Button
              color="green"
              disabled={!rejectedInformation}
              onClick={() =>
                handleEditStatus(orderID, 'REJECTED', rejectedInformation)
              }
            >
              Saqlash
            </Button>
          </div>
        </div>
      </GlobalModal>
      <GlobalModal isOpen={toggleFeedback} onClose={closeModalFeedback}>
        <div className="lg:w-[600px] w-[300px] flex flex-col gap-2 text-xl md:w-[500px]">
          <h2 className="text-lg font-semibold mb-4">Buyurtmani baxolang</h2>
          <div className="mb-4">
            <Rating value={rating} onChange={(value) => setRating(value)} />
          </div>
          <textarea
            placeholder="Buyurtma haqida xabar qoldirish"
            className="rounded outline-none border select-none py-3 p-2 w-full mt-4"
            value={feedbackMessage}
            onChange={(e) => setFeedbackMessage(e.target.value)}
          />
          <div className="flex justify-end gap-5 mt-4">
            <Button color="red" onClick={closeModalFeedback}>
              Cancel
            </Button>
            <Button
              color="green"
              disabled={rating === 0 || loadPost}
              onClick={handleFeedbackSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </GlobalModal>
      <GlobalModal isOpen={togglePayment} onClose={closeModalPayment}>
        {dataPayment && (
          <div className="lg:w-[600px] w-[300px] flex flex-col gap-2 text-xl md:w-[500px]">
            <h2 className="text-lg font-semibold">To'lov ma'lumotlari</h2>

            <div className="flex flex-col lg:flex-row h-10 gap-2 mb-4">
              <input
                type="number"
                placeholder="To'lov miqdori"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="border px-4 py-2 rounded"
              />
              <input
                type="date"
                placeholder="Sana"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="border px-4 w-full py-2 rounded"
              />
              <button
                onClick={handlePaymentSubmit}
                disabled={isSubmitDisabled || payload}
                className="bg-blue-500 w-full py-2 text-sm text-white rounded hover:bg-blue-600"
              >
                Qushish
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-2 mt-22 lg:mt-0 border p-4">
              <ul className="w-full">
                <li className="px-6 py-3 font-semibold">Umumiy summa</li>
                <li className="px-6 py-3">
                  {formatNumberWithSpaces(Math.round(dataPayment.totalAmount))}
                </li>
              </ul>
              <ul className="w-full border-t border-b lg:border-l">
                <li className="px-6 py-3 font-semibold">To'langan summa</li>
                <li className="px-6 py-3">
                  {formatNumberWithSpaces(Math.round(dataPayment.amountPaid))}
                </li>
              </ul>
              <ul className="w-full lg:border-l">
                <li className="px-6 py-3 font-semibold">Qolgan summa</li>
                <li className="px-6 py-3">
                  {formatNumberWithSpaces(Math.round(dataPayment.remainingAmount))}
                </li>
              </ul>

            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 min-w-[150px] py-3">
                      Sana
                    </th>
                    <th scope="col" className="px-6 min-w-[180px] py-3">
                      To'langan summa
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataPayment.orderPaymentDtos && dataPayment.orderPaymentDtos.length > 0 ? (
                    dataPayment.orderPaymentDtos.map((payment: any) => (
                      <tr key={payment.orderId} className="bg-white border-b">
                        <td className="px-6 py-4">{payment.date}</td>
                        <td className="px-6 py-4">
                          {formatNumberWithSpaces(payment.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeletePayment(payment.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <MdDelete />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center">
                        To'lov kiritilmagan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}
      </GlobalModal>
    </div>
  );
}

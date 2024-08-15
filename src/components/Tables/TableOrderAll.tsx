import React, { useEffect, useState } from 'react';
import { FaEye, FaRegFolderOpen } from 'react-icons/fa';
import { attechment } from '../../service/urls';
import { FaArrowDownLong } from "react-icons/fa6";
import useGet from '../../hooks/get';
import GlobalModal from '../modal';
import ReactPaginate from 'react-paginate';
import { MdOutlineBrowserNotSupported } from "react-icons/md";


interface OrderDetail {
    detailId: number;
    detailName: string;
    detailAttachmentId: number;
    amount: number;
    residual: string | null;
}

interface Order {
    id: string;
    employeeName: string;
    productName: string | number;
    orderDetails: string | null;
    orderDetailsRes: OrderDetail[];
    width: number;
    tall: number;
    price: number | null;
    date: string | null;
    orderStatus: string | null;
    address: string | null;
}

export default function TableOrderAll() {
    const { get, data, isLoading } = useGet();
    const { get: getOne, data: dateOne } = useGet();
    const [toggle, setToggle] = useState(false);
    const [page, setPage] = useState<number>(0);

    // const [selectedItem, setSelectedItem] = useState<Order | null>(null);

    useEffect(() => {
        get('/order/all', page);
    }, [page]);

    const toggleModal = () => {
        setToggle(!toggle);
    };
    const handlePageClick = (page: any) => {
        setPage(page.selected);
    };

    const handleViewClick = async (id: string) => {
        await getOne(`/order/one/${id}`);
        toggleModal()
    };

    return (
        <div>
            <div className="w-full mt-6 max-w-full rounded-sm border border-stroke bg-white shadow-default ">
                <div className="w-full max-w-full rounded-sm border border-stroke bg-white ">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
                        <table className="lg:w-[1145px] w-[992px] text-sm text-left rtl:text-right text-gray-500 ">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        #
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Hodim ismi
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Narxi
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Buyurtma holati
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Manzil
                                    </th>
                                    <th scope="col" className="px-6 py-3">
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
                                                {i + 1}
                                            </th>
                                            {/* <td className="px-6 py-4">
                                                <img
                                                    className="w-20 h-20 rounded-full object-cover"
                                                    src={attechment + item.productAttachmentId}
                                                    alt="(404)"
                                                />
                                            </td> */}
                                            <td className="px-6 py-4">{item.employeeName}</td>
                                            <td className="px-6 py-4">{item.price}</td>
                                            <td className="px-6 py-4">{item.orderStatus}</td>
                                            <td className="px-6 py-4">{item.address}</td>
                                            <td className="px-6 py-4">{item.date}</td>
                                            <td className="px-6">
                                                <button
                                                    onClick={() => handleViewClick(item.id)}
                                                    className="ml-5"
                                                >
                                                    <FaEye
                                                        size={25}
                                                        className="text-red-500"
                                                    />
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

            <GlobalModal
                isOpen={toggle}
                onClose={toggleModal}
            >
                {dateOne && (
                    <div className='lg:w-[600px] w-[300px]  flex flex-col gap-2 text-xl md:w-[500px]'>
                        <h2 className="text-lg font-semibold">Buyurtma ma'lumotlari</h2>
                        {/* <p className='flex justify-between'>Employee Name: <span>{dateOne.employeeName || "not included"}</span></p> */}
                        <p className='flex justify-between'>Eni: <span>{dateOne.width || "Ma'lumot kiritilmagan!"}</span></p>
                        <p className='flex justify-between'>Bo'yi: <span>{dateOne.tall || "Ma'lumot kiritilmagan!"}</span></p>
                        <p className='flex justify-between'>Narxi: <span>{dateOne.price || "Ma'lumot kiritilmagan!"}</span></p>
                        <p className='flex justify-between'>Buyurtma Holati: <span>{dateOne.orderStatus || "Ma'lumot kiritilmagan!"}</span></p>
                        <p className='flex justify-between'>Manzil: <span>{dateOne.address || "Ma'lumot kiritilmagan!"}</span></p>
                        <p className='flex justify-between'>Sana: <span>{dateOne.date || "Ma'lumot kiritilmagan!"}</span></p>
                        <div className=''>
                            <div className="flex items-center gap-2">
                                <h3 className="text-md font-medium">Buyurtma Detallari:</h3><FaArrowDownLong />
                            </div>
                            <div className='flex flex-col text-lg gap-3 mt-3'>
                                {dateOne.orderDetailsRes && dateOne.orderDetailsRes.length > 0 ? (
                                    dateOne.orderDetailsRes.map((detail: any, index: number) => (
                                        detail ? (
                                            <div key={index} className='p-4 ml-3 flex items-start gap-3 border rounded'>
                                                <div>
                                                    <img src={attechment + detail.detailAttachmentId} alt={detail.detailName} className="w-20 h-20 rounded-full object-cover" />
                                                </div>
                                                <div className="w-[85%] flex flex-col gap-2 justify-start">
                                                    <p className='flex justify-between border-b'>Detal nomi: <span>{detail.detailName || "Ma'lumot kiritilmagan !"}</span></p>
                                                    <p className='flex justify-between border-b'>Miqdori: <span>{detail.amount}</span></p>
                                                    {detail.residual && <p>Qolgan atxod: {detail.residual}</p>}
                                                </div>
                                            </div>
                                        ) : null
                                    ))
                                ) : (
                                    <p className='pl-4 flex items-center gap-2 text-blue-gray-300'>Detal ma'lumotlari topilmadi!!</p>
                                )}
                            </div>

                        </div>
                    </div>
                )}

            </GlobalModal>
        </div>
    );
}

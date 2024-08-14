import React, { useEffect, useState } from 'react';
import { FaEye, FaRegFolderOpen } from 'react-icons/fa';
import { attechment } from '../../service/urls';
import { FaArrowDownLong } from "react-icons/fa6";
import useGet from '../../hooks/get';
import GlobalModal from '../modal';
import ReactPaginate from 'react-paginate';

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
            <div className="w-full mt-6 max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="w-full max-w-full rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
                        <table className="lg:w-[1145px] w-[992px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        #
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Employee Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Product Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Price
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Order Status
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Address
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Date
                                    </th>
                                    <th colSpan={2} scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data && data.object && data.object.length > 0
                                    ? data.object.map((item: Order, i: number) => (
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
                                            {/* <td className="px-6 py-4">
                                                <img
                                                    className="w-20 h-20 rounded-full object-cover"
                                                    src={attechment + item.productAttachmentId}
                                                    alt="(404)"
                                                />
                                            </td> */}
                                            <td className="px-6 py-4">{item.employeeName}</td>
                                            <td className="px-6 py-4">{item.productName}</td>
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
                                        <tr className="bg-gray-600 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
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
                        <h2 className="text-lg font-semibold">Order Details</h2>
                        <p className='flex justify-between'>Employee Name: <span>{dateOne.employeeName || "not included"}</span></p>
                        <p className='flex justify-between'>Width: <span>{dateOne.width || "not included"}</span></p>
                        <p className='flex justify-between'>Tall: <span>{dateOne.tall || "not included"}</span></p>
                        <p className='flex justify-between'>Price: <span>{dateOne.price || "not included"}</span></p>
                        <p className='flex justify-between'>Order Status: <span>{dateOne.orderStatus || "not included"}</span></p>
                        <p className='flex justify-between'>Address: <span>{dateOne.address || "not included"}</span></p>
                        <p className='flex justify-between'>Date: <span>{dateOne.date || "not included"}</span></p>
                        <div className=''>
                            <div className="flex items-center gap-2">
                                <h3 className="text-md font-medium">Order Details Res:</h3><FaArrowDownLong />
                            </div>
                            <div className='flex flex-col text-lg gap-3 mt-3'>
                                {dateOne.orderDetailsRes.map((detail: any) => (
                                    <div className='p-4 ml-3 flex items-center gap-3 border rounded' >
                                        <div>
                                            <img src={attechment + detail.detailAttachmentId} alt={detail.detailName} className="w-20 h-20 rounded-full object-cover" />
                                        </div>
                                        <div className="w-[85%] flex flex-col justify-start">
                                            <p>Detail Name: {detail.detailName}</p>
                                            <p>Amount: {detail.amount}</p>
                                            <p>Residual: {detail.residual}</p>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </GlobalModal>
        </div>
    );
}

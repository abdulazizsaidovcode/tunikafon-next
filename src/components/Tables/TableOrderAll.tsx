import React, { useEffect, useState } from 'react';
import { FaEye, FaRegFolderOpen } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import { attechment } from '../../service/urls';
import useGet from '../../hooks/get';
import GlobalModal from '../modal';

interface Order {
    id: string;
    productAttachmentId: string;
    employeeName: string;
    productName: string;
    price: number;
    orderStatus: string;
    address: string;
    date: string;
}

export default function TableOrderAll() {
    const { get, data, isLoading } = useGet<Order[]>(); 
    const [toggle, setToggle] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Order | null>(null);

    useEffect(() => {
        get('/order/all');
    }, []);

    const toggleModal = () => {
        setToggle(!toggle);
    };

    const handleViewClick = (item: Order) => {
        setSelectedItem(item);
        toggleModal();
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
                                        Photo
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
                                {data && data.length
                                    ? data.map((item: Order, i: number) => (
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
                                                    src={attechment + item.productAttachmentId}
                                                    alt="(404)"
                                                />
                                            </td>
                                            <td className="px-6 py-4">{item.employeeName}</td>
                                            <td className="px-6 py-4">{item.productName}</td>
                                            <td className="px-6 py-4">{item.price}</td>
                                            <td className="px-6 py-4">{item.orderStatus}</td>
                                            <td className="px-6 py-4">{item.address}</td>
                                            <td className="px-6 py-4">{item.date}</td>
                                            <td className="px-6">
                                                <button
                                                    onClick={() => handleViewClick(item)}
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

            <GlobalModal
                isOpen={toggle}
                onClose={toggleModal}
            >
                {selectedItem && (
                    <div>
                        <h2 className="text-lg font-semibold">Order Details</h2>
                        <p>Employee Name: {selectedItem.employeeName}</p>
                        <p>Product Name: {selectedItem.productName}</p>
                        <p>Price: {selectedItem.price}</p>
                        <p>Order Status: {selectedItem.orderStatus}</p>
                        <p>Address: {selectedItem.address}</p>
                        <p>Date: {selectedItem.date}</p>
                        <p>Photo: <img src={attechment + selectedItem.productAttachmentId} alt={selectedItem.productName} /></p>
                    </div>
                )}
            </GlobalModal>
        </div>
    );
}

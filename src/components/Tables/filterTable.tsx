import React, { useEffect } from 'react';
import { Button } from "@material-tailwind/react";
import { fetchFilteredData } from '../../helpers/apiFunctions/filter';
import { dashboardStore } from '../../helpers/dashboard';
import Input from '../inputs/input';
import useGet from '../../hooks/get';// Adjust the import path as necessary

const FilterForm: React.FC = () => {
    const { get } = useGet();
    const { page, setData,
        employeeName,
        ORDER_STATUS,
        address,
        date,
        setEmployeeName,
        setOrderStatus,
        setAddress,
        setDate,
        resetFilters } = dashboardStore();

    const size = 10;

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchFilteredData(
                { employeeName, ORDER_STATUS, address, date, page, size },
                setData
            );
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [employeeName, ORDER_STATUS, address, date]);

    const handleReset = () => {
        resetFilters();
        setData([]);
        get('/order/all', page, setData);
    };

    return (
        <div className="py-2 px-5">
            <h1 className='text-3xl my-2 text-boxdark font-semibold'>Tartiblash</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 sm:gap-5 items-center mb-6">
                <div className="w-full">
                    <Input
                        label="Hodim ismi"
                        value={employeeName || ''}
                        onChange={(e) => setEmployeeName(e.target.value || null)}
                    />
                </div>
                <div className="w-full">
                    <Input
                        label='Manzil'
                        value={address || ''}
                        onChange={(e) => setAddress(e.target.value || null)}
                    />
                </div>
                <div className="w-full">
                    <Input
                        type="date"
                        label="Sana"
                        value={date || ''}
                        onChange={(e) => setDate(e.target.value || null)}
                    />
                </div>
                <div className="w-full">
                    <label className="block mb-2">Holat</label>
                    <select
                        className='mb-4 w-full py-2 px-4 border rounded outline-none bg-transparent'
                        value={ORDER_STATUS || ''}
                        onChange={(e: any) => setOrderStatus(e.target.value as 'COMPLETED' | 'REJECTED' | 'WAIT')}
                    >
                        <option value={""} disabled>Holatni tanlang</option>
                        <option value="COMPLETED">Tugallangan</option>
                        <option value="REJECTED">Bekor qilingan</option>
                        <option value="WAIT">Kutilayotgan</option>
                    </select>
                </div>
                <div className="w-full mb-5">
                    <Button
                        onClick={handleReset}
                        className="w-full shadow-2 bg-black md:w-auto mt-9"
                        style={{ opacity: 1, visibility: 'visible', display: 'inline-block' }}
                    >
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FilterForm;

import React from 'react';
import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
import ChartTwo from '../../components/Charts/ChartTwo';
import TableOne from '../../components/Tables/TableOne';

const ECommerce: React.FC = () => {
  return (
    <>
      <div className="md:flex md:flex-row flex-col justify-between gap-5">
        <CardDataStats title="Tugatildi" total="200 000"></CardDataStats>
        <CardDataStats title="Kutilyapti" total="180 000"></CardDataStats>
        <CardDataStats title="Rad etildi" total="200 000"></CardDataStats>
      </div>

      <div className="w-full mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartTwo />
        <ChartOne />
        <div className="flex justify-between gap-5">
          <button className="rounded-lg shadow my-5 bg-gary-600 dark:bg-boxdark px-5 py-2">
            Calendar
          </button>
          <button className="rounded-lg shadow my-5 bg-gary-600 dark:bg-boxdark px-5 py-2">
            Employee name
          </button>
          <button className="rounded-lg shadow my-5 bg-gary-600 dark:bg-boxdark px-5 py-2">
            Status
          </button>
          <button className="rounded-lg shadow my-5 bg-gary-600 dark:bg-boxdark px-5 py-2">
            Adress
          </button>
        </div>
        <div className="col-span-12">
          <TableOne />
        </div>
      </div>
    </>
  );
};

export default ECommerce;

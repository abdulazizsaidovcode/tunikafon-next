import React, { useEffect, useState } from 'react';
import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
import TableOne from '../../components/Tables/TableOne';
import useGet from '../../hooks/get';

const ECommerce: React.FC = () => {
  const [month, setMonth] = useState<number | string>(1);
  const [year, setYear] = useState<number | string>(2024);
  const { get, data } = useGet();

  useEffect(() => {
    if (year && month && Number(month) <= 12 && Number(month) >= 1) {
      get(`/dashboard/status-income?year=${year}&month=${month}`);
    }
  }, [month, year]);

  const isMonthValid = Number(month) >= 1 && Number(month) <= 12;
  const isYearValid = /^\d{4}$/.test(year.toString());

  const fallbackText = 'Enter date " year | month " ';
  const monthErrorText = 'Month not found';
  const yearErrorText = 'Enter a valid 4-digit year {202*}';

  return (
    <>
      <div className='flex justify-between'>
        <div className="w-72 py-6 select-none">
          <label htmlFor="year">Year</label>
          <input
            id="year"
            placeholder="2024"
            className='rounded select-none py-3 p-2 w-full'
            value={year.toString()}
            onChange={(e) => {
              const newValue = e.target.value;
              if (/^\d{0,4}$/.test(newValue)) {
                setYear(newValue);
              }
            }}
          />
          {!isYearValid && <div className="text-red-500">{yearErrorText}</div>}
        </div>
        <div className="w-72 py-6 select-none">
          <label htmlFor="month">Month</label>
          <input
            id="month"
            type="number"
            placeholder="01"
            className='rounded select-none py-3 p-2 w-full'
            value={month.toString()}
            onChange={(e) => setMonth(Number(e.target.value))}
          />
          {!isMonthValid && <div className="text-red-500">{monthErrorText}</div>}
        </div>
      </div>

      {year && month ? (
        isMonthValid ? (
          isYearValid ? (
            <div className="md:flex md:flex-row flex-col justify-between gap-5">
              <CardDataStats
                title="Completed Income"
                total={data?.completedIncome ?? 0}
              />
              <CardDataStats
                title="Waiting Income"
                total={data?.waitingIncome ?? 0}
              />
              <CardDataStats
                title="Rejected Income"
                total={data?.completedIncome ?? 0}
              />
            </div>
          ) : (
            <div>{yearErrorText}</div>
          )
        ) : (
          <div>{monthErrorText}</div>
        )
      ) : (
        <div>{fallbackText}</div>
      )}

      <div className="w-full mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          {/* ChartOne should take full width of its container */}
          <ChartOne />
        </div>
      </div>
    </>
  );
};

export default ECommerce;

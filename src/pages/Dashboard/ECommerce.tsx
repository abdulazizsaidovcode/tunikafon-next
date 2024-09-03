import React, { useEffect, useState } from 'react';
import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
import useGet from '../../hooks/get';
import ChartThree from '../../components/Charts/ChartThree';
import ChartTwo from '../../components/Charts/ChartTwo';

export const months = [
  { id: 1, name: 'Yanvar' },
  { id: 2, name: 'Fevral' },
  { id: 3, name: 'Mart' },
  { id: 4, name: 'Aprel' },
  { id: 5, name: 'May' },
  { id: 6, name: 'Iyun' },
  { id: 7, name: 'Iyul' },
  { id: 8, name: 'Avgust' },
  { id: 9, name: 'Sentyabr' },
  { id: 10, name: 'Oktyabr' },
  { id: 11, name: 'Noyabr' },
  { id: 12, name: 'Dekabr' },
];

const ECommerce: React.FC = () => {
  const date = new Date();
  const [month, setMonth] = useState<number | string>(date.getMonth() + 1);
  const [year, setYear] = useState<number | string>(date.getFullYear());

  const { get, data } = useGet();

  useEffect(() => {
    if (year && month && Number(month) <= 12 && Number(month) >= 1) {
      get(`/order/dashboard/status-income?year=${year}&month=${month}`);
    }
  }, [month, year]);
  const formatNumberWithSpaces = (number: number | null) => {
    return number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };
  const isMonthValid = Number(month) >= 1 && Number(month) <= 12;
  const isYearValid = /^\d{4}$/.test(year.toString());

  const fallbackText = 'Enter date " year | month " ';
  const monthErrorText = 'Month not found';
  const yearErrorText = 'Enter a valid 4-digit year {202*}';

  return (
    <>
      <div className="flex justify-between gap-2 items-center">
        <div className="w-72 py-6 select-none">
          <label htmlFor="year">Yil Kiritish</label>
          <input
            id="year"
            placeholder="2024"
            className="rounded select-none py-3 p-2 w-full"
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
        <div className="w-72 py-6 select-none mt-5.5">
          {/* <label htmlFor="month">Month</label>
          <input
            id="month"
            type="number"
            placeholder="01"
            className="rounded select-none py-3 p-2 w-full"
            value={month.toString()}
            onChange={(e) => setMonth(Number(e.target.value))}
          /> */}
          <select
            className="w-full p-3 text-lg rounded "
            onChange={(e) => setMonth(+e.target.value)}
            value={month}
          >
            {months.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {!isMonthValid && (
            <div className="text-red-500">{monthErrorText}</div>
          )}
        </div>
      </div>

      {year && month ? (
        isMonthValid ? (
          isYearValid ? (
            <div className="md:flex md:flex-row flex-col justify-between gap-5">
              <CardDataStats
                title="Tugallangan daromad"
                total={
                  formatNumberWithSpaces(data?.completedIncome?.toFixed()) ?? 0
                }
              />
              <CardDataStats
                title="Kutilayotgan daromad"
                total={
                  formatNumberWithSpaces(data?.waitingIncome?.toFixed()) ?? 0
                }
              />
              <CardDataStats
                title="Rad etilgan daromad"
                total={
                  formatNumberWithSpaces(data?.rejectedIncome?.toFixed()) ?? 0
                }
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
          <ChartOne />
          <ChartTwo month={month} year={year} />
          <ChartThree month={month} year={year} />
        </div>
      </div>
    </>
  );
};

export default ECommerce;

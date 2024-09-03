import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import useGet from '../../hooks/get';
import { FaRegFolderOpen } from 'react-icons/fa6';

interface ChartThreeState {
  series: {
    name: string | number;
    data: number[];
  }[];
}

const ChartThree: React.FC = ({ month, year }: any) => {
  const { get, data } = useGet();

  const formatNumberWithSpaces = (number: number | null) => {
    return number !== null
      ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      : '0';
  };

  const options: ApexOptions = {
    series: [
      {
        name: 'Net Profit',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        name: 'Revenue',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
      {
        name: 'Free Cash Flow',
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      },
    ],
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent'],
    },
    xaxis: {
      categories: data && data.map((item: any) => item.groupName),
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val;
        },
      },
    },
  };

  useEffect(() => {
    get(`/dashboard/group/statistic?year=${year}&month=${month}`);
  }, [month, year]);

  const [state, setState] = useState<ChartThreeState>({
    series: [
      {
        name: 'Iconma',
        data: data
          ? data.map((item: any) => (item.income === null ? 0 : item.income))
          : [],
      },
      {
        name: 'Rejected Income',
        data: data ? data.map((item: any) => item.rejectedIncome) : [],
      },
    ],
  });

  useEffect(() => {
    setState({
      series: [
        {
          name: 'Iconma',
          data: data
            ? data.map((item: any) =>
                item.income === null ? 0 : item.income && item.income.toFixed(),
              )
            : [],
        },
        {
          name: 'Rejected Income',
          data: data
            ? data.map(
                (item: any) =>
                  item.rejectedIncome && item.rejectedIncome.toFixed(),
              )
            : [0],
        },
      ],
    });
  }, [data]);

  return (
    <>
      {data ? (
        <div className="sm:px-7.5 w-full col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default xl:col-span-5">
          <div className="w-full">
            <h1 className="font-semibold">
              Guruhlar tomonidan olib kelingan foyda va Yuqotilgan summalar
            </h1>
            <ReactApexChart
              options={options}
              series={state.series}
              type="bar"
              height={350}
            />
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-wrap gap-10 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default sm:px-7.5 my-5 xl:col-span-8">
          <FaRegFolderOpen size={50} />
        </div>
      )}
    </>
  );
};

export default ChartThree;

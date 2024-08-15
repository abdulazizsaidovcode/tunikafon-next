import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import useGet from '../../hooks/get';

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartOne: React.FC = () => {
  const { get, data } = useGet();
  const [year, setYear] = useState<number>(2024);

  // Default 12 months categories
  const defaultCategories = [
    'Yanvar',
    'Fevral',
    'Mart',
    'Aprel',
    'May',
    'Iyun',
    'Iyul',
    'Avgust',
    'Sentyabr',
    'Okyabr',
    'Noyabr',
    'Dekabr',
  ];

  const options: ApexOptions = {
    legend: {
      show: false,
      position: 'top',
      horizontalAlign: 'left',
    },
    colors: ['#3C50E0', '#80CAEE'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 335,
      type: 'area',
      dropShadow: {
        enabled: true,
        color: '#623CEA14',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: 'smooth',
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: '#fff',
      strokeColors: ['#3056D3', '#80CAEE'],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      fillOpacity: 1,
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: 'category',
      categories: defaultCategories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: '0px',
        },
      },
      min: 0,
      max: 100,
    },
  };

  const [state, setState] = useState<ChartOneState>({
    series: [
      {
        name: 'Income',
        data: Array(12).fill(0), // Initialize with 0 for each month
      },
    ],
  });

  useEffect(() => {
    get(`/order/dashboard/month-income?year=${year}`);
  }, [year]);

  useEffect(() => {
    if (data) {
      // Prepare a mapping of month names to income
      const incomeMapping: { [key: string]: number } = {};
      data.forEach((item: any) => {
        incomeMapping[item.monthName] = item.income || 0;
      });

      // Fill the series data array with income values or 0 if no data
      const updatedData = defaultCategories.map(
        (month) => incomeMapping[month] || 0,
      );

      setState({
        series: [
          {
            name: 'Foyda',
            data: updatedData,
          },
        ],
      });
    }
  }, [data]);

  return (
    <div className="col-span-12 w-full rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default  sm:px-7.5 xl:col-span-8">
      <h1 className="text-2xl p-3">Yil kiriting</h1>
      <input
        id="year"
        type="number"
        placeholder="2024"
        className="rounded ml-3 select-none py-3 p-2 w-full"
        value={year}
        onChange={(e) => {
          const newValue = parseInt(e.target.value, 10);
          if (!isNaN(newValue)) {
            setYear(newValue);
          }
        }}
      />
      <div className="w-full mt-4">
        <ReactApexChart
          options={options}
          series={state.series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default ChartOne;

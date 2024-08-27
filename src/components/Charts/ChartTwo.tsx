import React, { useEffect, useState } from 'react';
import useGet from '../../hooks/get';
import ApexCharts from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface GroupData {
  groupId: number;
  groupName: string;
  capitanName: string;
  capitanId: number;
  employCount: number;
  groupFeedback: number;
  completedOrderCount: number;
  rejectedOrderCount: number;
  income: number | null;
  rejectedIncome: number | null;
}

const ChartTwo: React.FC = () => {
  const date = new Date();
  const [month, setMonth] = useState<number>(date.getMonth() + 1);
  const [year, setYear] = useState<number>(date.getFullYear());

  const { get, data, isLoading } = useGet();

  useEffect(() => {
    get(`/dashboard/group/statistic?year=${year}&month=${month}`);
  }, [year, month]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const chartOptions: ApexOptions = {
    chart: {
      type: 'pie',
      width: 480,
    },
    labels: data && data.map((item: GroupData) => item.groupName),
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  const chartSeries =
    (data && data.map((item: GroupData) => item.groupFeedback)) || 0;
  const chartSeries2 =
    (data && data.map((item: GroupData) => item.completedOrderCount)) || 0;
  const chartSeries3 =
    (data && data.map((item: GroupData) => item.rejectedOrderCount)) || 0;

  return (
    <div className="w-full flex flex-wrap  rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default sm:px-7.5 xl:col-span-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Feadback</h2>
        <ApexCharts
          options={chartOptions}
          series={chartSeries}
          type="pie"
          height={350}
          width={320}
        />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Completed</h2>
        <ApexCharts
          options={chartOptions}
          series={chartSeries2}
          type="pie"
          height={350}
          width={320}
        />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Rejected</h2>
        <ApexCharts
          options={chartOptions}
          series={chartSeries3}
          type="pie"
          height={350}
          width={320}
        />
      </div>
    </div>
  );
};

export default ChartTwo;

import React, { useEffect, useState } from 'react';
import useGet from '../../hooks/get';
import ApexCharts from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const ChartTwo: React.FC = () => {
  const date = new Date();
  const [month, setMonth] = useState<number>(date.getMonth() + 1);
  const [year, setYear] = useState<number>(date.getFullYear());

  const { get, data, isLoading } = useGet();
  
  useEffect(() => {
    get(`/dashboard/group/statistic?year=${year}&month=${month}`);
  }, [year, month]);

  // Prepare column chart options and series for each group
  const getColumnChartOptions = (groupName: string): ApexOptions => ({
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
    xaxis: {
      categories: ['Income', 'Completed Orders', 'Rejected Orders', 'Feedback', 'Employee Count'],
    },
    yaxis: {
      title: {
        text: 'Value',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  });

  const getColumnChartSeries = (data: any) => [
    {
      name: data.groupName,
      data: [
        data.income || 0,
        data.completedOrderCount || 0,
        data.rejectedOrderCount || 0,
        data.groupFeedback || 0,
        data.employCount || 0,
      ],
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <div className='col-span-12 w-full rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default  sm:px-7.5 xl:col-span-8'>
      {data?.map((group: any) => (
        <div key={group.groupId} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{group.groupName}</h2>
          <ApexCharts
            options={getColumnChartOptions(group.groupName)}
            series={getColumnChartSeries(group)}
            type="bar"
            height={350}
          />
        </div>
      ))}
    </div>
    </div>
  );
};

export default ChartTwo;

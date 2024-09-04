import React, { useEffect } from 'react';
import useGet from '../../hooks/get';
import ApexCharts from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { FaRegFolderOpen } from 'react-icons/fa6';

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

const ChartTwo: React.FC<{ month: number | string; year: number | string }> = ({
  month,
  year,
}) => {
  const { get, data, isLoading } = useGet();

  useEffect(() => {
    get(`/dashboard/group/statistic?year=${year}&month=${month}`);
  }, [year, month]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const isDataAvailable = (series: number[]) =>
    series.some((value) => value > 0);

  const getSeries = (key: keyof GroupData) => {
    const series = data
      ? data.map((item: GroupData) => item[key] as number)
      : [];
    return isDataAvailable(series)
      ? series
      : data
        ? data.map((_: GroupData) => 0.1)
        : [0.1];
  };

  const chartOptions: ApexOptions = {
    chart: {
      type: 'pie',
      width: 480,
    },
    labels: data && data.map((item: GroupData) => item.groupName),
    colors: ['#ffff'],
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
    states: {
      hover: {
        filter: {
          type: 'none', 
        },
      },
      active: {
        filter: {
          type: 'none',
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '18px',
        colors: ['white'], 
        
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: '#fff',
        opacity: 1,
        
      },
      
      // background: {
      //   enabled: true,
      //   foreColor: '#000000', 
        
      // },
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: '24px',
      },
    },
  };
  
  

  return (
    <>
      {data ? (
        <div className="w-full flex flex-wrap justify-center gap-10 rounded-sm border border-stroke bg-white px-5 pt-7.5 my-5 pb-5 shadow-default sm:px-7.5 xl:col-span-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Bildirilgan fikrlar</h2>
            <ApexCharts
              options={{
                ...chartOptions,
                colors: getSeries('groupFeedback').every(
                  (v: number) => v === 0.1,
                )
                  ? ['#d3d3d3']
                  : undefined,
                tooltip: {
                  enabled: !getSeries('groupFeedback').every(
                    (v: number) => v === 0.1,
                  ),
                },
              }}
              series={getSeries('groupFeedback')}
              type="pie"
              height={350}
              width={400}
            />
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Tugatilgan zakaslar</h2>
            <ApexCharts
              options={{
                ...chartOptions,
                colors: getSeries('completedOrderCount').every(
                  (v: number) => v === 0.1,
                )
                  ? ['#d3d3d3']
                  : undefined,
                tooltip: {
                  enabled: !getSeries('completedOrderCount').every(
                    (v: number) => v === 0.1,
                  ),
                },
              }}
              series={getSeries('completedOrderCount')}
              type="pie"
              height={350}
              width={400}
            />
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Rad etilgan</h2>
            <ApexCharts
              options={{
                ...chartOptions,
                colors: getSeries('rejectedOrderCount').every(
                  (v: number) => v === 0.1,
                )
                  ? ['#d3d3d3']
                  : undefined,
                tooltip: {
                  enabled: !getSeries('rejectedOrderCount').every(
                    (v: number) => v === 0.1,
                  ),
                },
              }}
              series={getSeries('rejectedOrderCount')}
              type="pie"
              height={350}
              width={400}
            />
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-wrap  gap-10 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default sm:px-7.5 my-5 xl:col-span-8">
          <FaRegFolderOpen size={50} />
        </div>
      )}
    </>
  );
};

export default ChartTwo;

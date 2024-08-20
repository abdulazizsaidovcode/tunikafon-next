import React from 'react';

interface CardDataStatsProps {
  title: string;
  total: string | number;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({ title, total }) => {
  return (
    <div className="rounded-lg mt-5 md:mt-0 border w-full border-stroke bg-white py-6 px-7.5 shadow-default ">
      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black ">
            {title}
          </h4>
          <span className="text-sm font-medium">{total}</span>
        </div>
      </div>
    </div>
  );
};

export default CardDataStats;

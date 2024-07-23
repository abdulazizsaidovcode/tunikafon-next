import { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

const Calculation = () => {
  const [select, setSelect] = useState<string>();
  return (
    <>
      <Breadcrumb pageName="Calculation" />

      <div className="flex justify-between">
        <button
          onClick={() => setSelect('TEMPLATE')}
          className="rounded-lg my-5 bg-gary-600 shadow dark:bg-boxdark px-5 py-2"
        >
          Shablon bo’yicha
        </button>
        <button
          onClick={() => setSelect('CUSTOM')}
          className="rounded-lg my-5 shadow bg-gary-600 dark:bg-boxdark px-5 py-2"
        >
          Qo’lda hisoblash
        </button>
      </div>

      <div>
        {select === 'TEMPLATE' && (
          <div className="grid gap-10 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 place-items-center">
            <div>
              <div className="w-50 h-50 bg-graydark rounded-lg"></div>
              {/* <img
                className="w-50 h-50 bg-cover object-cover rounded-lg"
                src=""
                alt=""
              /> */}
              <div className="w-full rounded-lg  border mt-5 text-center py-2">
                <h1>Hello</h1>
              </div>
            </div>
          </div>
        )}
        <div className="w-full flex justify-center">
          {select === 'CUSTOM' && (
            <div className="w-full p-4 bg-black border border-white rounded-lg text-white">
              <div className="flex justify-between items-center border-b border-white pb-2 mb-4">
                <h2 className="text-lg">Detail category</h2>
                <img
                  src="path/to/your/icon.png"
                  alt="Detail Icon"
                  className="w-8 h-8"
                />
              </div>
              <div className="flex mb-4">
                <ul className="w-1/2 graydark">
                  <li className="flex items-center rounded-lg py-2 border border-white">
                    <img
                      src="path/to/your/icon.png"
                      alt="Detail 1"
                      className="w-6 h-6 mr-2"
                    />
                    <span>Detail 1</span>
                  </li>
                </ul>
                <div className="w-1/2 flex items-center justify-center">
                  <img
                    src="path/to/your/icon.png"
                    alt="Detail 1"
                    className="w-16 h-16"
                  />
                </div>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Enter address"
                  className="w-full p-2 border border-graydark rounded-md bg-black text-white focus:outline-none"
                />
              </div>
              <div className="flex justify-between mb-4">
                <div className="flex gap-5">
                  <input
                    type="text"
                    placeholder="bo'yi"
                    className="w-44 h-10 p-2 border border-graydark rounded-md bg-black text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="eni"
                    className="w-44 h-10 p-2 border border-graydark rounded-md bg-black text-white focus:outline-none mx-2"
                  />
                </div>
                <button className="rounded-lg my-5 bg-gary-600 dark:bg-boxdark px-5 py-2">
                  Hisoblash
                </button>
              </div>
              <div className="flex justify-between">
                <button className="rounded-lg my-5 bg-gary-600 dark:bg-boxdark px-5 py-2">
                  CANCEL
                </button>
                <button className="rounded-lg my-5 bg-gary-600 dark:bg-boxdark px-5 py-2">
                  SAVE
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Calculation;

import { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import AddModal from '../components/modal/add-modal';
import Table from '../components/Tables/Table';
import useGet from '../hooks/get';
import GlobalModal from '../components/modal';
import Input from '../components/inputs/input';

const Employees = () => {
  const [toggle, setToggle] = useState(false);
  const { data, isLoading } = useGet();

  const toggleModal = () => setToggle(!toggle);
  return (
    <>
      <div className="mx-auto">
        <Breadcrumb pageName="Employees" />

        <button
          onClick={toggleModal}
          className="rounded-lg shadow my-5 bg-gary-600 dark:bg-boxdark px-5 py-2"
        >
          Add
        </button>
        <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <Table
            name={'Phone Number'}
            data={data && data.object}
            isLoading={isLoading}
          />
        </div>
      </div>
      <GlobalModal
        isOpen={toggle}
        onClose={toggleModal}
        children={
          <div>
            <div>
              <Input label="Full name" />
              <Input label="PhoneNumber" />
            </div>
            <div className="w-full flex justify-between">
              <button
                // onClick={onClose}
                className="rounded-lg px-3 py-2 bg-graydark"
              >
                Close
              </button>
              <button
                // onClick={onConfirm}
                className="rounded-lg px-3 py-2 bg-green-500 text-white"
              >
                Save
              </button>
            </div>
          </div>
        }
      />
    </>
  );
};

export default Employees;

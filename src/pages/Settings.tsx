import { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import AddModal from '../components/modal/add-modal';
import Table from '../components/Tables/Table';

const Employees = () => {
  const [toggle, setToggle] = useState(false);

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
            data={[{ name: 'sdasad', attechment: 'https://picsum' }]}
          />
        </div>
      </div>
      <AddModal isModal={toggle} onClose={toggleModal} name="phone number" />
    </>
  );
};

export default Employees;

import { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Table from '../components/Tables/Table';
import AddModal from '../components/modal/add-modal';

const Category = () => {
  const [toggle, setToggle] = useState(false);

  const toggleModal = () => setToggle(!toggle);
  return (
    <>
      <Breadcrumb pageName="Category" />

      <button
        onClick={toggleModal}
        className="rounded-lg shadow my-5 bg-gary-600 dark:bg-boxdark px-5 py-2"
      >
        Add
      </button>
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <Table />
      </div>
      <AddModal isModal={toggle} onClose={toggleModal} />
    </>
  );
};

export default Category;

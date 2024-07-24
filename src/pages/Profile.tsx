import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Table from '../components/Tables/Table';
import AddModal from '../components/modal/add-modal';
import useGet from '../hooks/get';

const DetailCategory = () => {
  const [toggle, setToggle] = useState(false);
  const { data, get, isLoading } = useGet();

  useEffect(() => {
    get('/detail-category/list');
  }, []);

  const toggleModal = () => setToggle(!toggle);
  return (
    <>
      <Breadcrumb pageName="Detail Category" />

      <button
        onClick={toggleModal}
        className="rounded-lg shadow my-5 bg-gary-600 dark:bg-boxdark px-5 py-2"
      >
        Add
      </button>
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <Table data={data && data.object} isLoading={isLoading} />
      </div>
      <AddModal isModal={toggle} onClose={toggleModal} />
    </>
  );
};

export default DetailCategory;

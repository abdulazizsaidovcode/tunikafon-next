import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Tables/Table';

const Product = () => {
  return (
    <>
      <Breadcrumb pageName="Product" />

      <button className="rounded-lg shadow my-5 bg-gary-600 dark:bg-boxdark px-5 py-2">
        Add
      </button>
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <Table />
      </div>
    </>
  );
};

export default Product;

import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import useGet from '../hooks/get';
import { attechment } from '../service/urls';
import GlobalModal from '../components/modal';
import Input from '../components/inputs/input';
import { Button } from '@material-tailwind/react';
import usePost from '../hooks/post';
import { toast } from 'sonner';

const Calculation = () => {
  const { get, isLoading, data } = useGet();
  const { get: getDetail, data: details } = useGet();
  const { post, isLoading: countLoading, data: total } = usePost();
  const { post: save, isLoading: saveLoading } = usePost();

  const [req, setReq] = useState<any>({
    width: null,
    tall: null,
  });
  const [orderData, setOrderData] = useState<any>({
    date: null,
    address: null,
  });
  const [select, setSelect] = useState(true);
  const [toggle, setToggle] = useState(false);
  const [productId, setProductId] = useState<number>();
  const [orderDetailDtos, setOrderDetailDtos] = useState<any>();

  const toggleModal = () => setToggle(!toggle);

  const sort = (e: React.ChangeEvent<HTMLInputElement>, item: any) => {
    const sortDetail = orderDetailDtos.filter(
      (state: any) => state.id !== item.id,
    );
    const data = sortDetail.map((state: any) => {
      if (state.count > 0) {
        return { detailId: state.id, count: state.count };
      } else {
        return { detailId: state.id, count: 0 };
      }
    });
    const updatedItem = { detailId: item.id, count: +e.target.value };

    setOrderDetailDtos([...data, updatedItem]);
  };

  const handleClick = async () => {
    try {
      if (!req.width || !req.tall) {
        throw new Error('Width or tall is required');
      } else {
        await post('/order/calculation', {
          width: +req.width,
          tall: +req.tall,
          orderDetailDtos,
        });
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSave = async () => {
    try {
      if (!req.width || !req.tall || !orderData.address || !orderData.date)
        throw new Error('All fields required');

      await save('/order/save', {
        width: +req.width,
        tall: +req.tall,
        address: orderData.address,
        date: orderData.date,
        orderDetailDtos,
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    get('/product');
  }, []);

  useEffect(() => {
    const getDet = async () => {
      await getDetail('detail/for/detail/product/1');
      const data = details.map((item: any) => ({
        detailId: item.id,
        count: 0,
      }));
      setOrderDetailDtos([...data]);
    };
    getDet();
  }, [productId]);

  return (
    <>
      <Breadcrumb pageName="Calculation" />

      <div className="flex justify-between">
        <Button
          onClick={() => setSelect(true)}
          className="my-5 bg-gary-600 dark:bg-boxdark"
        >
          Shablon bo’yicha
        </Button>
        <Button
          onClick={() => setSelect(false)}
          className="my-5 bg-gary-600 dark:bg-boxdark"
        >
          Qo’lda hisoblash
        </Button>
      </div>

      <div>
        {select ? (
          <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 place-items-center">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i}>
                    <div className="w-60 h-60 rounded-xl animate-pulse bg-[#e3e3e3]" />
                    <div className="w-full rounded-lg animate-pulse border mt-5 py-2">
                      <span className="w-24 h-5 mx-auto block rounded-lg animate-pulse bg-[#e3e3e3]"></span>
                    </div>
                  </div>
                ))
              : data &&
                data.object.map((item: any) => (
                  <div
                    key={item.id}
                    className="cursor-pointer"
                    onClick={() => {
                      toggleModal();
                      setProductId(item.id);
                    }}
                  >
                    <img
                      className="w-60 h-60 bg-cover object-cover rounded-xl"
                      src={attechment + item.attachmentId}
                      alt={item.name}
                    />
                    <div className="w-full rounded-lg  border mt-5 text-center py-2">
                      <h1>{item.name}</h1>
                    </div>
                  </div>
                ))}
          </div>
        ) : (
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
              <Button
                // disabled={countLoading}
                className="my-5 bg-gary-600 dark:bg-boxdark"
              >
                Hisoblash
              </Button>
            </div>
            <div className="flex justify-between">
              <Button className="my-5 bg-gary-600 dark:bg-boxdark">
                CANCEL
              </Button>
              <Button className="my-5 bg-gary-600 dark:bg-boxdark">SAVE</Button>
            </div>
          </div>
        )}
      </div>
      <GlobalModal
        isOpen={toggle}
        onClose={toggleModal}
        children={
          <div>
            <Input
              onChange={(e) =>
                setOrderData({ ...orderData, date: e.target.value })
              }
              value={orderData.date}
              label="Date"
              type="date"
            />
            <div>
              {isLoading ? (
                <div className="w-full flex justify-center">
                  <div
                    className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                      Loading....
                    </span>
                  </div>
                </div>
              ) : (
                details && (
                  <div>
                    <h2>Detail</h2>
                    <div className="flex flex-col gap-5 border p-3 rounded max-h-44 overflow-y-auto">
                      {details.map((item: any) => (
                        <div className="w-full flex items-center justify-between border rounded-lg px-5 py-2">
                          <h4>{item.name}</h4>
                          <input
                            type="number"
                            className="rounded outline-none px-1 py-0.5"
                            onChange={(e: any) => sort(e, item)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="flex justify-between my-5">
              <div className="flex items-center gap-5">
                <input
                  type="number"
                  onChange={(e) => setReq({ ...req, tall: e.target.value })}
                  value={req.tall}
                  placeholder="bo'yi"
                  className="w-44 h-10 p-2 border border-graydark rounded-md text-white focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="eni"
                  onChange={(e) => setReq({ ...req, width: e.target.value })}
                  value={req.width}
                  className="w-44 h-10 p-2 border border-graydark rounded-md text-white focus:outline-none mx-2"
                />
              </div>
              <Button
                disabled={countLoading}
                onClick={handleClick}
                className="my-5 bg-gary-600 dark:bg-boxdark"
              >
                {countLoading ? 'Loading...' : 'Hisoblash'}
              </Button>
            </div>
            <h1 className="text-lg">{total}</h1>
            <Input
              onChange={(e) =>
                setOrderData({ ...orderData, address: e.target.value })
              }
              value={orderData.address}
              label="Enter address"
            />
            <div className="w-full flex justify-end gap-5">
              <Button onClick={toggleModal} color="red">
                Close
              </Button>
              <Button disabled={saveLoading} onClick={handleSave} color="green">
                {saveLoading ? 'Loading...' : 'Save'}
              </Button>
            </div>
          </div>
        }
      />
    </>
  );
};

export default Calculation;

import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import useGet from '../hooks/get';
import { attechment } from '../service/urls';
import GlobalModal from '../components/modal';
import Input from '../components/inputs/input';
import {
  Option,
  Select,
} from '@material-tailwind/react';
import usePost from '../hooks/post';
import { toast } from 'sonner';
import { FaRegFolderOpen } from 'react-icons/fa6';
import { RiShareForwardFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

const Calculation = () => {
  const { get, isLoading, data } = useGet();
  const { get: getProductDetail, data: productdetail } = useGet();
  const { post, data: total, error: totalError, isLoading: saveLoadingShablon } = usePost();
  const [kvData, setKvData] = useState<any>(null);
  const [toggle, setToggle] = useState(false);
  const [orderProductStatus, setOrderProductStatus] = useState(
    'THE_GATE_IS_INSIDE_THE_ROOM',
  );
  const [orderProductDto, setOrderProductDto] = useState<any>([
    {
      orderDetails: [],
      width: 0,
      height: 0,
      dropOffTwo: "",
      dropOffOne: "",
      howManySidesOfTheHouseAreMade: 0,
      orderProductStatus: 'THE_GATE_IS_INSIDE_THE_ROOM',
    },
  ]);

  useEffect(() => {
    if (total) {
      setKvData(total);
    } else if (totalError) {
      setKvData(null);
    }
  }, [total]);

  const toggleModal = () => {
    setKvData(null);
    setToggle(!toggle);
    resetAll();
  };
  const formatHovuz = (residual: any) => {
    return residual?.replace(/\d+\.\d+/g, (match: any) => {
      return parseFloat(match)
        .toString()
        .match(/^-?\d+(?:\.\d{0,4})?/)?.[0] ?? '0';
    }) ?? '';
  };

  const formatNumberWithSpaces = (number: number | null) => {
    return number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleInputChange = (id: number, index: number, value: string) => {
    setOrderProductDto((prev : any) =>
      prev.map((product : any, i : number)  =>
        i === index
          ? {
              ...product,
              orderDetails: product.orderDetails.map((data : any, idx : any) =>
                idx === id
                  ? {
                      ...data,
                      count: +value,
                      color: 'string', 
                    }
                  : data
              ),
            }
          : product
      )
    );
  };
  

  const handleChange = (
    index: number,
    field: 'width' | 'height' | 'howManySidesOfTheHouseAreMade' | 'dropOffOne' | `dropOffTwo`,
    value: number,
  ) => {
    setOrderProductDto((prev: any) => {
      return prev.map((product: any, i: number) => {
        if (index === i) {
          
          console.log("weweweweweewewewewewewewewewew" , product);
          return {
            ...product,
            [field]: value,
          };
        }
        return product;
      });
    });
  };


  const resetAll = () => {
    setOrderProductDto([
      {
        orderDetails: [],
        width: 0,
        height: 0,
        howManySidesOfTheHouseAreMade: 0,
        orderProductStatus: 'THE_GATE_IS_INSIDE_THE_ROOM',
      },
    ]);
  };

  const handleClick2 = async () => {
    const areDimensionsValid = orderProductDto.every(
      (product: any) => product.width > 0 && product.height > 0,
    );
    try {
      if (!areDimensionsValid) throw new Error('Malumotlar tuliq emas');
      await post('/order/calculation', [
        {
          orderDetails: orderProductDto[0]?.orderDetails,
          width: orderProductDto[0]?.width,
          height: orderProductDto[0]?.height,
          dropOffTwo: orderProductDto[0]?.dropOffTwo,
          dropOffOne: orderProductDto[0]?.dropOffOne,
          howManySidesOfTheHouseAreMade:
            orderProductDto[0]?.howManySidesOfTheHouseAreMade,
          orderProductStatus: orderProductStatus,
        },
      ]);
      // toggleModal();
    } catch (error) {
      toast.error('Hisoblashda xatolik yuz berdi');
    }
  };

  useEffect(() => {
    get('/product/all');
  }, []);

  const getProductDetails = async (id: number) => {
    const data = await getProductDetail(`product/details/${id}`);
    
    const orderDetail = data.map((product: any) => ({
      detailId: product.id || '0',
      name: product.name || "-",
      attachmentId: product.attachmentId || '0',
      count: 0,
      number: product.row || 0,
      color: 'string',
    }));

    setOrderProductDto((prev: any) => {
      return prev.map((product: any) => ({
        ...product,
        orderDetails: orderDetail,
      }));
    });
  };

  return (
    <>
      <Breadcrumb pageName="Hisoblash" />

      <div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  sm:grid-cols-2 grid-cols-1 place-items-center">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col  items-center w-60 h-full"
                >
                  <div className="w-full h-60 rounded-xl animate-pulse bg-[#e3e3e3]" />
                  <div className="w-full rounded-lg animate-pulse border mt-5 py-2">
                    <span className="w-24 h-5 mx-auto block rounded-lg animate-pulse bg-[#e3e3e3]"></span>
                  </div>
                </div>
              ))
            ) : data && data.length ? (
              data.map((item: any) => (
                <div
                  key={item.id}
                  className="cursor-pointer shadow-2xl p-5 mb-3 rounded-xl flex flex-col justify-between w-60 h-[calc(100%-20px)]"
                  onClick={() => {
                    getProductDetails(item.id);
                    toggleModal();
                  }}
                >
                  <img
                    className="w-full h-60 bg-cover object-cover rounded-xl"
                    src={attechment + item.attachmentId}
                    alt={item.name}
                  />
                  <div className="w-full rounded-lg border mt-5 text-center py-2">
                    <h1>{item.name}</h1>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center">
                <FaRegFolderOpen size={80} />
              </div>
            )}
          </div>
      </div>
      <GlobalModal
        isOpen={toggle}
        onClose={toggleModal}
        children={
          <div>
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
              ) : productdetail && productdetail.length > 0 ? (
                <div>
                  <h2>Detal</h2>
                  <Select
                    value={orderProductStatus}
                    onChange={(val: any) => {
                      setOrderProductStatus(val);
                    }}
                    placeholder="Tanlang"
                    className="w-full"
                    label="Holat"
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    <Option value="EXTERIOR_VIEW_OF_THE_HOUSE">
                      Uyning tashqi ko'rinishi
                    </Option>
                    <Option className="my-1" value="INTERIOR_VIEW_OF_THE_HOUSE">
                      Uyning ichki ko'rinishi
                    </Option>
                    <Option value="THE_GATE_IS_INSIDE_THE_ROOM">
                      Darvoza xona
                    </Option>
                    <Option value="THE_RAGEL">RAGEL</Option>
                  </Select>
                  <div className="flex flex-col gap-5 py-3 rounded max-h-44 overflow-y-auto">
                    {orderProductDto[0].orderDetails.map(
                      (item: any, i: number) => {

                        return (
                          <div
                            key={item.id}
                            className="flex flex-col lg:flex-row items-start lg:items-center justify-between border border-[#64748B] rounded-lg px-5 py-2 w-full gap-3"
                          >
                            <img
                              className="w-8 h-8 sm:w-10 sm:h-10 bg-cover object-cover rounded-xl"
                              src={
                                item.attachmentId
                                  ? attechment + item.attachmentId
                                  : 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
                              }
                              alt={item.name}
                            />
                            <div className="flex-1 px-0">
                              <h1 className="text-sm sm:text-md text-center">
                                {item.name}
                              </h1>
                            </div>
                            <input
                              type="number"
                              placeholder="Soni"
                              // value={item.count ?? ''}
                              onChange={(e) =>
                                handleInputChange(i, 0, e.target.value)
                              }
                              className="rounded outline-none px-1 py-0.5 lg:w-20"
                              aria-label={`Count for ${item.name}`}
                            />
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <h4 className="text-red-400 text-center">
                    ❗Detal topilmadi. Siz oldin detal qo'shishingiz kerak
                  </h4>
                  <Link
                    to={'/detail'}
                    className="flex gap-2 justify-center items-center border-b border-blue-700"
                  >
                    <h4 className="text-blue-700">Detal qo'shish </h4>
                    <RiShareForwardFill />
                  </Link>
                </div>
              )}
            </div>

            <div className="flex justify-between my-5 items-center gap-4">
              <div className="flex items-center gap-5">
                <Input
                  placeholder="Bo'yini kiriting"
                  onChange={(e: any) =>
                    handleChange(0, 'height', e.target.value)
                  }
                  value={orderProductDto[0]?.height || ''}
                  label="Bo'yi"
                  type="number"
                />
                <Input
                  placeholder="Enini kiriting"
                  onChange={(e: any) =>
                    handleChange(0, 'width', e.target.value)
                  }
                  value={orderProductDto[0]?.width || ''}
                  label="Eni"
                  type="number"
                />
                <>
                  {orderProductStatus === 'THE_RAGEL' ? (
                    <>
                      <Input
                        placeholder="Balandlik bir"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange(0, 'dropOffOne', +e.target.value)
                        }
                        value={orderProductDto[0]?.dropOffOne || ''}
                        label="Balandlik bir"
                        type="number"
                      />
                      <Input
                        placeholder="Balandlik ikki"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange(0, 'dropOffTwo', +e.target.value)
                        }
                        value={orderProductDto[0].dropOffTwo || ''}
                        label="Balandlik ikki"
                        type="number"
                      />
                    </>
                  ) : orderProductStatus ===
                    'THE_GATE_IS_INSIDE_THE_ROOM' ? null : (
                    <Input
                      placeholder="Tomon"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(
                          0,
                          'howManySidesOfTheHouseAreMade',
                          +e.target.value,
                        )
                      }
                      value={
                        orderProductDto[0]?.howManySidesOfTheHouseAreMade || ''
                      }
                      label="Uyning tomonlari"
                      type="number"
                    />
                  )}
                </>
              </div>
            </div>
            <div className="flex flex-col my-4">
              <h1 className="text-lg">
                {total
                  ? total.result &&
                  formatNumberWithSpaces(total.result.toFixed())
                  : '0'}{' '}
                so'm
              </h1>
              <div className="overflow-auto">
                {kvData && (
                  <div className="flex gap-2 items-center justify-between border-b border-gray-200 py-2">
                    <h2 className="w-1/3 text-sm font-bold text-gray-800">
                      Nomi
                    </h2>
                    <h2 className="w-1/3 text-sm font-bold text-gray-800">
                      KV
                    </h2>
                    <h2 className="w-1/3 text-sm font-bold text-gray-800">
                      Soni
                    </h2>
                  </div>
                )}

                {kvData && (
                  <div className="">
                    {kvData?.resOrderDetails?.map(
                      (item: {
                        id: number | string;
                        residual: string;
                        detailName: string;
                        detailKv: number;
                        amount: number;
                        amountType: number | string;
                      }) => (
                        <div
                          key={item.id}
                          className="flex gap-2 items-center justify-between border-b border-gray-200 py-2"
                        >
                          <h2 className="w-1/3 min-w-[100px] text-sm text-gray-600">
                            {item.detailName}
                          </h2>
                          <h2 className="w-1/3 min-w-[100px] text-sm text-gray-600">
                            {item.detailKv ? item.detailKv.toFixed(5) : '-'}
                          </h2>
                          <h2 className="w-1/3 min-w-[200px] text-sm text-gray-600">
                            {item.amount && item.amount.toFixed(5)}{' '}
                            {item.amountType || '0'}
                            <br />
                            {(item.residual?.slice(0, 5) === 'Hovuz' ||
                              item.residual?.slice(0, 3) === 'MDF') &&
                              formatHovuz(item.residual)}
                          </h2>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>

              {kvData && (
                <div className="mt-4">
                  <h2 className="text-lg font-bold text-gray-800">
                    Yig'indi KV:{' '}
                    {kvData.resOrderDetails.reduce(
                      (acc: any, item: { detailKv: number }) =>
                        acc + (item.detailKv || 0),
                      0,
                    )}
                  </h2>
                </div>
              )}
            </div>
            <div className="w-full flex justify-end gap-5">
              <Button  onClick={toggleModal} color="red">
                Yopish
              </Button>
              <Button
                disabled={saveLoadingShablon}
                onClick={() => {
                  handleClick2();
                }}
                color="green"
              >
                {saveLoadingShablon ? 'Yuklanmoqda...' : 'Hisoblash'}
              </Button>
            </div>
          </div>
        }
      />
    </>
  );
};

export default Calculation;

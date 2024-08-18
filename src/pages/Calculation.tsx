import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import useGet from '../hooks/get';
import { attechment } from '../service/urls';
import GlobalModal from '../components/modal';
import Input from '../components/inputs/input';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Button,
  Checkbox,
} from '@material-tailwind/react';
import usePost from '../hooks/post';
import { toast } from 'sonner';
import { FaRegFolderOpen } from 'react-icons/fa6';
import { RiShareForwardFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const Calculation = () => {
  const { get, isLoading, data } = useGet();
  const { get: getProductDetail, data: productdetail } = useGet();
  const { get: getcategoryDetail, data: categorydetail } = useGet();
  const { get: getDetailCategory, data: detailCategory } = useGet();
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
  const [open, setOpen] = useState(0);
  const [details1, setDetails1] = useState<any[]>([]);
  const [details2, setDetails2] = useState<any[]>([]);
  const [details3, setDetails3] = useState<any[]>([]);

  const handleOpen = (value: any) => {
    getDetailCategoryDetail(value);
    setOpen(open === value ? 0 : value);
  };

  const toggleModal = () => {
    setToggle(!toggle);
    setDetails3([]);
  };

  const handleCheckboxChange = (item: any) => {
    const isSelected = details1.some((detail) => detail.id === item.id);

    if (isSelected) {
      setDetails1(details1.filter((detail) => detail.id !== item.id));
      setDetails2(details2.filter((detail) => detail.detailId !== item.id));
    } else {
      setDetails1([
        ...details1,
        { id: item.id, name: item.name, attachmentId: item.attachmentId },
      ]);
      setDetails2([
        ...details2,
        { detailId: item.id, count: 0 }, // Initialize count as 0
      ]);
    }
  };

  const formatNumberWithSpaces = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleInputChange = (id: number, value: string) => {
    setDetails2(
      details2.map((detail) =>
        detail.detailId === id
          ? { ...detail, count: value ? +value : 0 }
          : detail,
      ),
    );
  };
  useEffect(() => {
    if (productdetail) {
      setDetails3(
        productdetail.map((item: any) => ({
          detailId: item.id,
          count: 0,
        })),
      );
    }
  }, [productdetail]);

  const handleProductDetailChange = (id: number, value: string) => {
    setDetails3(
      details3.map((detail) =>
        detail.detailId === id
          ? { ...detail, count: value ? +value : 0 }
          : detail,
      ),
    );
  };

  const resetAll = () => {
    setReq({ width: null, tall: null });
    setOrderData({ date: null, address: null });
    setDetails1([]);
    setDetails2([]);
    setDetails3([]);
    setToggle(false);
    post('/order/calculation', {
      width: 0,
      tall: 0,
      orderDetailDtos: [],
    });
  };

  const handleClick = async () => {
    if (!req.width || !req.tall) {
      toast.error("Bo'yi va enini kiriting");
    } else {
      try {
        await post('/order/calculation', {
          width: +req.width,
          tall: +req.tall,
          orderDetailDtos: select ? details3 : details2,
        });
        // console.log(details2); // For debugging: see the structure of details2
      } catch (error) {
        toast.error('Hisoblashda xatolik yuz berdi');
      }
    }
  };

  const handleSave = async () => {
    try {
      if (!req.width || !req.tall || !orderData.address || !orderData.date || !orderData.clientPhoneNumber || !orderData.clientFullName || !orderData.location)
        throw new Error('Barcha malumotlarni kiriting');

      await save('/order/save', {
        width: +req.width,
        tall: +req.tall,
        address: orderData.address,
        date: orderData.date,
        // productAttachmentId: 0,
        orderDetails: details2,
        clientPhoneNumber: orderData.clientPhoneNumber,
        clientFullName: orderData.clientFullName,
        location: orderData.location
      });

      // Reset the state after a successful save
      resetAll();

      toast.success('Malumotlaringiz kiritildi!');
    } catch (error) {
      toast.error('Malumotlaringizni yuklashda xatolik yuz berdi');
    }
  };

  useEffect(() => {
    get('/product');
  }, []);

  const getDetailCategoryDetail = async (id: number) => {
    await getcategoryDetail(`detail/for/detail/category/${id}`);
  };

  const getProductDetails = async (id: number) => {
    await getProductDetail(`product/details/${id}`);
  };
  const getDetailCategorys = async () => {
    await getDetailCategory(`detail-category/all/list`);
  };

  return (
    <>
      <Breadcrumb pageName="Hisoblash" />

      <div className="flex flex-col sm:flex-row justify-between ">
        <Button
          onClick={() => {
            resetAll();
            setSelect(true);
          }}
          className="rounded-lg my-2 sm:my-5 text-white bg-boxdark shadow px-6 py-3"
        >
          Shablon bo’yicha
        </Button>
        <Button
          onClick={() => {
            getDetailCategorys();
            resetAll();
            setSelect(false);
          }}
          className="rounded-lg my-2 sm:my-5 text-white bg-boxdark shadow px-6 py-3"
        >
          Qo’lda hisoblash
        </Button>
      </div>

      <div>
        {select ? (
          <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 place-items-center">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <div className="w-60 h-60 rounded-xl animate-pulse bg-[#e3e3e3]" />
                  <div className="w-full rounded-lg animate-pulse border mt-5 py-2">
                    <span className="w-24 h-5 mx-auto block rounded-lg animate-pulse bg-[#e3e3e3]"></span>
                  </div>
                </div>
              ))
            ) : data && data.object.length ? (
              data.object.map((item: any) => (
                <div
                  key={item.id}
                  className="cursor-pointer shadow-2xl p-5 rounded-xl"
                  onClick={() => {
                    getProductDetails(item.id);
                    toggleModal();
                  }}
                >
                  <img
                    className="w-60 h-60 bg-cover object-cover rounded-xl"
                    src={attechment + item.attachmentId}
                    alt={item.name}
                  />
                  <div className="w-full rounded-lg border mt-5 text-center py-2">
                    <h1>{item.name}</h1>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full">
                <FaRegFolderOpen size={80} />
              </div>
            )}
          </div>
        ) : (
          <div className="w-full p-4 bg-white rounded-lg border-stroke shadow-default">
            {detailCategory && (
              <div className="flex justify-between items-center border-b border-[#64748B] pb-2 mb-4">
                <h2 className="text-lg">Detal kategoriya</h2>
              </div>
            )}
            <div className="flex flex-col lg:flex-row gap-10 mb-4">
              {detailCategory ? (
                <div className="w-full lg:w-1/2 h-[260px] md:h-[350px] overflow-y-auto">
                  {detailCategory.map((item: any) => (
                    <Accordion
                      key={item.id}
                      open={open === item.id}
                      className="mb-3"
                    >
                      <AccordionHeader
                        className="border border-[#64748B] rounded-xl flex gap-10 items-center p-1 sm:p-3"
                        onClick={() => handleOpen(item.id)}
                      >
                        <div className="flex gap-10 items-center px-10">
                          <img
                            className="w-11 h-11 bg-cover object-cover rounded-xl "
                            src={
                              item.attachmentId
                                ? attechment + item.attachmentId
                                : 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
                            }
                            alt={item.name}
                          />
                          {/* <div className="w-full flex items-center rounded-lg mt-5 text-center py-2"> */}
                          <h1 className="text-sm sm:text-lg">{item.name}</h1>
                          {/* </div> */}
                        </div>
                      </AccordionHeader>
                      <AccordionBody>
                        {categorydetail ? (
                          categorydetail.map((detail: any) => (
                            <div
                              key={detail.id}
                              className="flex items-center gap-3 sm:gap-10 border border-[#64748B] rounded-lg p-0 sm:px-5 sm:py-1 mb-4 mx-3 sm:mx-10"
                            >
                              <Checkbox
                                className="bg-blue-gray-300 sm:w-6 sm:h-6"
                                checked={details1.some(
                                  (d) => d.id === detail.id,
                                )}
                                onChange={() => handleCheckboxChange(detail)}
                              />
                              <img
                                className="w-10 h-10 bg-cover object-cover rounded-xl"
                                src={
                                  detail.attachmentId
                                    ? attechment + detail.attachmentId
                                    : 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
                                }
                                alt={detail.name}
                              />
                              <h1 className="sm:text-lg">{detail.name}</h1>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col justify-center items-center">
                            <h4 className="text-red-400 text-center">
                              Detal topilmadi. Siz oldin detal qo'shishingiz
                              kerak
                            </h4>
                            <Link
                              to={'/detail'}
                              className="flex gap-2 justify-center items-center"
                            >
                              <h4 className="text-gray-700">Detal qo'shish </h4>
                              <RiShareForwardFill />
                            </Link>
                          </div>
                        )}
                      </AccordionBody>
                    </Accordion>
                  ))}
                </div>
              ) : (
                <div className="w-full flex flex-col justify-center items-center">
                  <h4 className="text-red-400 text-center">
                    ❗Detal topilmadi. Siz oldin detal kategoriya qo'shishingiz
                    kerak
                  </h4>
                  <Link
                    to={'/categor-detail'}
                    className="flex gap-2 justify-center items-center border-b border-blue-700"
                  >
                    <h4 className="text-blue-700">
                      Detal kategoriya qo'shish{' '}
                    </h4>
                    <RiShareForwardFill />
                  </Link>
                </div>
              )}
              {detailCategory && (
                <div className="w-full lg:w-1/2 h-[350px] overflow-y-auto flex flex-col items-center gap-2 border border-[#64748B] rounded-lg p-5">
                  {details1.length > 0 ? (
                    details1.map((detail) => (
                      <div
                        key={detail.id}
                        className="flex items-center justify-between border border-[#64748B] rounded-lg px-5 py-2 w-full gap-3"
                      >
                        <img
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-cover object-cover rounded-xl"
                          src={
                            detail.attachmentId
                              ? attechment + detail.attachmentId
                              : 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
                          }
                          alt={detail.name}
                        />
                        <div className="flex-1 px-0">
                          <h1 className="text-sm sm:text-md text-center">
                            {detail.name}
                          </h1>
                        </div>
                        <input
                          type="number"
                          placeholder="Soni"
                          onChange={(e) =>
                            handleInputChange(detail.id, e.target.value)
                          }
                          className="rounded outline-none px-1 py-0.5 w-20"
                        />
                      </div>
                    ))
                  ) : (
                    <div
                      className="w-full flex flex-col justify-center items-center"
                      py-10
                    >
                      <h1 className="text-gray-600 font-semibold text-lg text-center">
                        Bu qismda siz tanlagan detallar ko'rinadi.
                      </h1>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:gap-5 xl:gap-0 justify-between py-5 items-center">
              <div className="flex flex-col sm:flex-row sm:gap-5 w-full justify-center items-center xl:justify-start">
                <Input
                  placeholder="Bo'yini kiriting"
                  onChange={(e) => setReq({ ...req, tall: e.target.value })}
                  value={req.tall ? req.tall : ''}
                  label="Bo'yi"
                  type="number"
                />
                <Input
                  placeholder="Enini kiriting"
                  onChange={(e) => setReq({ ...req, width: e.target.value })}
                  value={req.width ? req.width : ''}
                  label="Eni"
                  type="number"
                />
              </div>
              <div className="flex flex-col sm:items-end items-center sm:justify-between w-full sm:flex-row ">
                <div className="flex">
                  <h1 className="text-lg">{total ? formatNumberWithSpaces(total) : '0'}</h1>
                  <h1 className="text-lg ms-2">{`so'm`}</h1>
                </div>
                <Button onClick={handleClick} className="bg-primary">
                  Hisoblash
                </Button>
              </div>
            </div>
            <div className="mb-4 flex flex-col md:flex-row sm:gap-10 pt-5">
              <div className="w-full">
                <Input
                  onChange={(e) =>
                    setOrderData((prevState: any) => ({
                      ...prevState,
                      clientFullName: e.target.value,
                    }))
                  }
                  value={orderData.clientFullName ? orderData.clientFullName : ''}
                  label="Mijoz F.I.O"
                  placeholder="Mijoz tuliq ism sharfini kiriting"
                />
              </div>
              <div className="w-full">
                <Input
                  onChange={(e) =>
                    setOrderData((prevState: any) => ({
                      ...prevState,
                      clientPhoneNumber: e.target.value,
                    }))
                  }
                  value={orderData.clientPhoneNumber ? orderData.clientPhoneNumber : ''}
                  label="Mijoz telifon raqami"
                  placeholder="Mijoz telifon raqamini kiriting"
                />
              </div>
              <div className="w-full">
                <Input
                  onChange={(e) =>
                    setOrderData((prevState: any) => ({
                      ...prevState,
                      location: e.target.value,
                    }))
                  }
                  value={orderData.location ? orderData.location : ''}
                  label="Mijoz lokatsiyasi"
                  placeholder="Mijoz lokatsitsiyasini kiriting"
                />
              </div>
            </div>
            <div className="mb-4 flex flex-col sm:flex-row sm:gap-10">
              <div className="w-full">
                <Input
                  placeholder="Manzilni kiriting"
                  onChange={(e) =>
                    setOrderData((prevState: any) => ({
                      ...prevState,
                      address: e.target.value,
                    }))
                  }
                  value={orderData.address ? orderData.address : ''}
                  label="Manzil"
                />
              </div>
              <div className="w-full">
                <Input
                  onChange={(e) =>
                    setOrderData((prevState: any) => ({
                      ...prevState,
                      date: e.target.value,
                    }))
                  }
                  value={orderData.date ? orderData.date : 0}
                  label="Sana"
                  placeholder="Sanani kiriting"
                  type="date"
                />
              </div>
            </div>
            <div className="w-full flex justify-center">
              <Button onClick={handleSave} className="bg-primary px-20">
                Saqlash
              </Button>
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
              label="Sana"
              placeholder="Sanani kiriting"
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
              ) : productdetail && productdetail.length > 0 ? (
                <div>
                  <h2>Detal</h2>
                  <div className="flex flex-col gap-5 py-3 rounded max-h-44 overflow-y-auto">
                    {productdetail.map((item: any) => (
                      <div className="w-full flex items-center justify-between border rounded-lg px-5 py-2">
                        <img
                          className="w-8 h-8 bg-cover object-cover rounded-xl "
                          src={
                            item.attachmentId
                              ? attechment + item.attachmentId
                              : 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
                          }
                          alt={item.name}
                        />
                        <h4>{item.name}</h4>
                        <input
                          type="number"
                          placeholder="soni"
                          className="rounded outline-none px-1 py-0.5"
                          onChange={(e) =>
                            handleProductDetailChange(item.id, e.target.value)
                          }
                        />
                      </div>
                    ))}
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
                  onChange={(e) => setReq({ ...req, tall: e.target.value })}
                  value={req.tall}
                  label="Bo'yi"
                  type="number"
                />
                <Input
                  placeholder="Enini kiriting"
                  onChange={(e) => setReq({ ...req, width: e.target.value })}
                  value={req.width}
                  label="Eni"
                  type="number"
                />
              </div>
            </div>
            <div className="flex w-full gap-10 justify-end items-center">
              <h1 className="text-lg text-center">{total ? formatNumberWithSpaces(total) : 0} so'm</h1>
              <Button
                disabled={countLoading}
                onClick={handleClick}
                className="h-10 bg-primary"
              >
                {countLoading ? 'Loading...' : 'Hisoblash'}
              </Button>
            </div>
            <Input
              onChange={(e) =>
                setOrderData({ ...orderData, address: e.target.value })
              }
              value={orderData.address}
              label="Manzil"
              placeholder="Manzilni kiriting"
            />
            <Input
              onChange={(e) =>
                setOrderData({ ...orderData, clientFullName: e.target.value })
              }
              value={orderData.clientFullName}
              label="Mijoz F.I.O"
              placeholder="Mijoz tuliq ism sharfini kiriting"
            />
            <Input
              onChange={(e) =>
                setOrderData({ ...orderData, clientPhoneNumber: e.target.value })
              }
              value={orderData.clientPhoneNumber}
              label="Mijoz telifon raqami"
              placeholder="Mijoz telifon raqamini kiriting"
            />
            <Input
              onChange={(e) =>
                setOrderData({ ...orderData, location: e.target.value })
              }
              value={orderData.location}
              label="Mijoz lokatsiyasi"
              placeholder="Mijoz lokatsitsiyasini kiriting"
            />
            <div className="w-full flex justify-end gap-5">
              <Button onClick={toggleModal} color="red">
                Yopish
              </Button>
              <Button disabled={saveLoading} onClick={handleSave} color="green">
                {saveLoading ? 'Yuklanyapti...' : 'Saqlash'}
              </Button>
            </div>
          </div>
        }
      />
    </>
  );
};

export default Calculation;

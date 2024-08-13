import { useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import useGet from "../hooks/get";
import { attechment } from "../service/urls";
import GlobalModal from "../components/modal";
import Input from "../components/inputs/input";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Button,
  Checkbox,
} from "@material-tailwind/react";
import usePost from "../hooks/post";
import { toast } from "sonner";

const Calculation = () => {
  const { get, isLoading, data } = useGet();
  const { get: getDetail, data: details } = useGet();
  const { get: getProductDetail, data: productdetail } = useGet();
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
    getDetails(value);
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

  const handleInputChange = (id: number, value: string) => {
    setDetails2(
      details2.map((detail) =>
        detail.detailId === id
          ? { ...detail, count: value ? +value : 0 }
          : detail
      )
    );
  };
  useEffect(() => {
    if (productdetail) {
      setDetails3(
        productdetail.map((item: any) => ({
          detailId: item.id,
          count: 0,
        }))
      );
    }
  }, [productdetail]);

  const handleProductDetailChange = (id: number, value: string) => {
    setDetails3(
      details3.map((detail) =>
        detail.detailId === id
          ? { ...detail, count: value ? +value : 0 }
          : detail
      )
    );
  };

  const handleClick = async () => {
    try {
      if (!req.width || !req.tall) {
        throw new Error("Width or tall is required");
      } else {
        await post("/order/calculation", {
          width: +req.width,
          tall: +req.tall,
          orderDetailDtos: select ? details3 : details2,
        });
        // console.log(details2); // For debugging: see the structure of details2
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSave = async () => {
    try {
      if (!req.width || !req.tall || !orderData.address || !orderData.date)
        throw new Error("All fields required");

      await save("/order/save", {
        width: +req.width,
        tall: +req.tall,
        address: orderData.address,
        date: orderData.date,
        // productAttachmentId: 0,
        orderDetails: details2,
      });

      // Reset the state after a successful save
      setReq({ width: null, tall: null });
      setOrderData({ date: null, address: null });
      setDetails1([]);
      setDetails2([]);
      setDetails3([]);
      setToggle(false);
      await post("/order/calculation", {
        width: 0,
        tall: 0,
        orderDetailDtos: [],
      });

      toast.success("Data saved successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    get("/product");
  }, []);

  const getDetails = async (id: number) => {
    await getDetail(`detail/for/detail/product/${id}`);
  };

  const getProductDetails = async (id: number) => {
    await getProductDetail(`product/details/${id}`);
  };

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
                ))}
          </div>
        ) : (
          <div className="w-full p-4 bg-black border border-white rounded-lg text-white">
            <div className="flex justify-between items-center border-b border-white pb-2 mb-4">
              <h2 className="text-lg">Detail category</h2>
            </div>
            <div className="flex gap-10 mb-4">
              <div className="w-1/2">
                {data &&
                  data.object.map((item: any) => (
                    <Accordion key={item.id} open={open === item.id}>
                      <AccordionHeader onClick={() => handleOpen(item.id)}>
                        <img
                          className="w-15 h-15 bg-cover object-cover rounded-xl"
                          src={
                            item.attachmentId
                              ? attechment + item.attachmentId
                              : "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
                          }
                          alt={item.name}
                        />
                        <div className="w-full text-white rounded-lg mt-5 text-center py-2">
                          <h1>{item.name}</h1>
                        </div>
                      </AccordionHeader>
                      <AccordionBody>
                        {details &&
                          details.map((detail: any) => (
                            <div
                              key={detail.id}
                              className="flex items-center justify-between border rounded-lg px-5 py-2 mb-4"
                            >
                              <Checkbox
                                checked={details1.some(
                                  (d) => d.id === detail.id
                                )}
                                onChange={() => handleCheckboxChange(detail)}
                              />
                              <span>{detail.name}</span>
                              <span></span>
                            </div>
                          ))}
                      </AccordionBody>
                    </Accordion>
                  ))}
              </div>
              <div className="w-1/2 flex flex-col items-center justify-center gap-2">
                {details1.map((detail) => (
                  <div
                    key={detail.id}
                    className="flex items-center justify-between border rounded-lg px-5 py-2 w-full"
                  >
                    {/* <img
                      className="w-15 h-15 bg-cover object-cover rounded-xl"
                      src={attechment + detail.attachmentId}
                      alt={detail.name}
                    /> */}
                    <span></span>
                    <div className="flex-1 px-4">
                      <h1 className="text-center">{detail.name}</h1>
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
                ))}
              </div>
            </div>

            <div className="flex justify-between py-5 items-end">
              <div className="flex gap-5">
                <div className="w-full flex flex-col">
                  <label htmlFor="buyi">Bo'yi</label>
                  <input
                    type="number"
                    value={req.tall ? req.tall : ""}
                    id="buyi"
                    placeholder="bo'yi"
                    className="w-44 h-10 p-2 border border-graydark rounded-md bg-black text-white focus:outline-none"
                    onChange={(e) => setReq({ ...req, tall: e.target.value })}
                  />
                </div>
                <div className="w-full flex flex-col">
                  <label htmlFor="eni">Eni</label>
                  <input
                    type="number"
                    value={req.width ? req.width : ""}
                    id="eni"
                    placeholder="eni"
                    className="w-44 h-10 p-2 border border-graydark rounded-md bg-black text-white focus:outline-none"
                    onChange={(e) => setReq({ ...req, width: e.target.value })}
                  />
                </div>
                <div className="flex items-end flex-row">

                <h1 className="text-lg ">{total ? total : "0"}</h1>
                <h1 className="text-lg ms-2">{`so'm`}</h1>
                </div>
              </div>
              <div>
                <Button onClick={handleClick} className="bg-primary">
                  Calculate
                </Button>
              </div>
            </div>
            <div className="mb-4 flex gap-10 py-5">
              <div className="w-full">
                <label htmlFor="address">Address</label>
                <input
                  id="address"
                  type="text"
                  value={orderData.address ? orderData.address : ""}
                  placeholder="Enter address"
                  className="w-full p-2 border border-graydark rounded-md bg-black text-white focus:outline-none"
                  onChange={(e) =>
                    setOrderData((prevState: any) => ({
                      ...prevState,
                      address: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="w-full">
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  type="date"
                  value={orderData.date ? orderData.date : 0}
                  placeholder="Enter date"
                  className="w-full p-2 border border-graydark rounded-md bg-black text-white focus:outline-none"
                  onChange={(e) =>
                    setOrderData((prevState: any) => ({
                      ...prevState,
                      date: e.target.value,
                    }))
                  }
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
                productdetail && (
                  <div>
                    <h2>Detail</h2>
                    <div className="flex flex-col gap-5 border p-3 rounded max-h-44 overflow-y-auto">
                      {productdetail.map((item: any) => (
                        <div className="w-full flex items-center justify-between border rounded-lg px-5 py-2">
                          <h4>{item.name}</h4>
                          <input
                            type="number"
                            className="rounded outline-none px-1 py-0.5"
                            onChange={(e) =>
                              handleProductDetailChange(item.id, e.target.value)
                            }
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
                {countLoading ? "Loading..." : "Hisoblash"}
              </Button>
            </div>
            <h1 className="text-lg text-center">{total} so'm</h1>
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
                {saveLoading ? "Loading..." : "Save"}
              </Button>
            </div>
          </div>
        }
      />
    </>
  );
};

export default Calculation;

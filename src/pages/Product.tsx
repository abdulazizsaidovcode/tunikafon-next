import { useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import Table from "../components/Tables/Table";
import useGet from "../hooks/get";
import ReactPaginate from "react-paginate";
import GlobalModal from "../components/modal";
import Input from "../components/inputs/input";
import { Menu, MenuHandler } from "@material-tailwind/react";
import useDelete from "../hooks/delete";
import DeleteModal from "../components/modal/deleteModal";
import { toast } from "sonner";
import usePost from "../hooks/post";
import usePut from "../hooks/put";
import { MenuList, MenuItem } from "../components/Menu";
import { Button } from "../components/Button";

const Product = () => {
  const { get, isLoading, data } = useGet();
  const {
    get: getDetail,
    isLoading: detailIsloading,
    data: details,
  } = useGet();

  const { remove, isLoading: deleteIsloading } = useDelete();
  const { post, isLoading: postLoading } = usePost();
  const { post: addAttechmet, isLoading: attechmentLoading } = usePost();
  const { put, isLoading: putLoading } = usePut();

  const [page, setPage] = useState<number>(0);
  const [toggle, setToggle] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [deleteId, setDeleteId] = useState<number>();
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<any>(null);
  const [update, setUpdate] = useState<any>();
  const [editModal, setEditModal] = useState(false);
  const [detailsName, setDeatilsName] = useState<any>([]);

  const toggleModal = () => {
    setToggle(!toggle);
    setDeatilsName([]);
    setName("");
    setFile(null);
  };

  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const toggleEditModal = () => {
    setEditModal(!editModal);

    if (update) {
      setName(update.name || "");
      setDeatilsName(update.details || []);
      setFile(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const validate = () => {
    if (!name.trim() || !detailsName?.length || (file && !file.name && !update?.attachmentId)) return true;
    return false;
  };

  const handlePageClick = (e: any) => {
    setPage(e.selected);
  };

  const sortDetailIds = (item: any) => {
    setDeatilsName([...detailsName, item]);
  };

  const addProduct = async () => {
    try {
      const formData = new FormData();
      if (file) formData.append("file", file);

      const attachmentId = file ? await addAttechmet("/attachment/upload", formData) : update?.attachmentId;

      await post("/product", {
        name: name,
        productDetails: detailsName?.length > 0 && detailsName.map((item: any) => ({
          detailId: item.id,
          row: +item.value || 0
        })),
        attachmentId: attachmentId,
      });
      get("/product", page);
      toast.success("Mufaqiyatli qo'shildi");
      toggleModal();
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  const editProduct = async () => {
    try {
      if (!name.trim() || !detailsName.length)
        throw new Error("Bo'sh maydonlarni to'ldiring");

      const formData = new FormData();
      if (file) formData.append("file", file);  // Append new file if provided

      const attachmentId = file ? await addAttechmet("/attachment/upload", formData) : update?.attachmentId;

      await put("/product", update.id, {
        name: name,
        productDetails: detailsName?.length > 0 && detailsName.map((item: any) => ({
          detailId: item.id,
          row: +item.value || 0
        })),
        attachmentId: attachmentId,
      });
      get("/product", page);
      toast.success("Mufaqiyatli tahrirlandi");
      toggleEditModal();
    } catch (error) {
      toast.error("Failed to edit");
    }
  };

  const deleteProduct = async () => {
    try {
      await remove("/product/", deleteId);
      get("/product", page);
      toggleDeleteModal();
      toast.success("Mufaqiyatli o'chirildi");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  useEffect(() => {
    get("/product", page);
    getDetail("/detail/list");
  }, []);

  useEffect(() => {
    get("/product", page);
  }, [page]);

  useEffect(() => {
    if (update) {
      setName(update.name);
      setDeatilsName(update.details || []);
    }
  }, [update, editModal]);

  return (
    <>
      <Breadcrumb pageName="Mahsulotlar" />

      <Button
        onClick={toggleModal}
        className="rounded-lg !bg-boxdark shadow my-5 bg-gary-600 px-6 py-3"
      >
        Qo'shish
      </Button>
      <Table
        updataModal={toggleEditModal}
        setUpdate={setUpdate}
        setDeleteId={setDeleteId}
        isLoading={isLoading}
        data={data && data.object}
        deleteModal={toggleDeleteModal}
        page={page}
      />
      {!isLoading &&  (
        <ReactPaginate
          className="flex gap-3 navigation mt-5"
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={data && data.totalPage}
          previousLabel="<"
          renderOnZeroPageCount={null}
          forcePage={page}
        />
      )}

      <GlobalModal
        isOpen={toggle}
        onClose={toggleModal}
        children={
          <div className="sm:w-96 w-full relative">
            <Input onChange={handleImageChange} label="Rasm" type="file" />
            <Input
              onChange={(e: any) => setName(e.target.value)}
              label="Mahsulot nomi"
              value={name}
            />
            <Menu
              dismiss={{
                itemPress: false,
              }}
            >
              <MenuHandler>
                <div className="w-full cursor-pointer rounded flex flex-col gap-2 border overflow-y-auto border-black text-black px-6 py-3 text-start font-normal">
                  {detailsName && detailsName.length > 0 ? (
                    detailsName.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="border rounded flex justify-between items-center px-2 py-1 gap-2"
                      >
                        <span className="flex-1 truncate">{item.name}</span>
                        <div className="w-20">
                          <Input
                            type="number"
                            value={item.value || ""}
                            onChange={(e) => {
                              const updatedValue = e.target.value.replace(/[^0-9]/g, "");
                              const clampedValue =
                                updatedValue.length > 2
                                  ? updatedValue.slice(0, 2)
                                  : updatedValue;

                              setDeatilsName((prevState: any[]) =>
                                prevState.map((detail, index) =>
                                  index === i ? { ...detail, value: clampedValue } : detail
                                )
                              );
                            }}
                          />
                        </div>
                        <button
                          onClick={() =>
                            setDeatilsName((prevState: any[]) =>
                              prevState.filter((_, index) => index !== i)
                            )
                          }
                          className="text-red-500 text-xl hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>Detalni tanlang</p>
                  )}
                </div>
              </MenuHandler>
              <MenuList className="z-[1000000] bg-white border relative max-h-50 w-60 sm:w-96 text-black">
                {details && !detailIsloading ? (
                  <>
                    {details.map((item: any) => (
                      <MenuItem
                        onClick={() => sortDetailIds(item)}
                        key={item.id}
                        className="p-0 !bg-white !text-black active:bg-white/50 hover:bg-white/50 hover:text-black flex items-center w-full"
                      >
                        <label
                          htmlFor={item.id}
                          className="flex cursor-pointer items-center gap-2 p-2"
                        >
                          {item.name}
                        </label>
                      </MenuItem>
                    ))}
                  </>
                ) : (
                  <MenuItem disabled>
                    {!details ? (
                      <div>Malumot yuq</div>
                    ) : (
                      <div className="w-full flex justify-center">
                        <div
                          className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                          role="status"
                        >
                          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                            Loading...
                          </span>
                        </div>
                      </div>
                    )}
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
            <div className="sm:w-96 w-full mt-5 flex gap-5 justify-end">
              <Button onClick={toggleModal} color="red">
                Yopish
              </Button>
              <Button
                disabled={validate() || postLoading || attechmentLoading}
                onClick={addProduct}
                color="green"
              >
                {postLoading || attechmentLoading ? "Loading..." : "Qo'shish"}
              </Button>
            </div>
          </div>
        }
      />

      {/* Edit modal */}
      <GlobalModal
        isOpen={editModal}
        onClose={() => {
          toggleEditModal();
        }}
        children={
          <div className="sm:w-96 w-full relative">
            <Input onChange={handleImageChange} label="Rasm" type="file" />
            <Input
              onChange={(e: any) => setName(e.target.value)}
              label="Mahsulot nomi"
              value={name}
            />
            <Menu dismiss={{ itemPress: false }}>
              <MenuHandler>
                <div className="w-full cursor-pointer rounded flex flex-col gap-2 border overflow-y-auto border-black text-black px-6 py-3 text-start font-normal">
                  {detailsName && detailsName.length > 0 ? (
                    detailsName.map((item: any, i: number) => (
                      <div key={i} className="border rounded flex justify-between items-center px-2 py-1 gap-2">
                        <span className="flex-1 truncate">{item.name}</span>
                        <div className="w-20">
                          <Input
                            type="number"
                            value={item.value || ""}
                            onChange={(e) => {
                              const updatedValue = e.target.value.replace(/[^0-9]/g, "");
                              const clampedValue = updatedValue.length > 2
                                ? updatedValue.slice(0, 2)
                                : updatedValue;

                              setDeatilsName((prevState: any[]) =>
                                prevState.map((detail, index) =>
                                  index === i ? { ...detail, value: clampedValue } : detail
                                )
                              );
                            }}
                          />
                        </div>
                        <button
                          onClick={() =>
                            setDeatilsName((prevState: any[]) =>
                              prevState.filter((_, index) => index !== i)
                            )
                          }
                          className="text-red-500 text-xl hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>Detalni tanlang</p>
                  )}
                </div>
              </MenuHandler>
              <MenuList className="z-[1000000] bg-white border relative max-h-50 w-60 sm:w-96 text-black">
                {details && !detailIsloading ? (
                  details.map((item: any) => (
                    <MenuItem
                      onClick={() => sortDetailIds(item)}
                      key={item.id}
                      className="p-0 !bg-white !text-black active:bg-white/50 hover:bg-white/50 hover:text-black flex items-center w-full"
                    >
                      <label
                        htmlFor={item.id}
                        className="flex cursor-pointer items-center gap-2 p-2"
                      >
                        {item.name}
                      </label>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    {!details ? (
                      <div>Malumot yuq</div>
                    ) : (
                      <div className="w-full flex justify-center">
                        <div
                          className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                          role="status"
                        >
                          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                            Loading...
                          </span>
                        </div>
                      </div>
                    )}
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
            <div className="sm:w-96 w-full mt-5 flex gap-5 justify-end">
              <Button onClick={toggleEditModal} color="red">
                Yopish
              </Button>
              <Button
                disabled={validate() || putLoading || attechmentLoading}
                onClick={editProduct}
                color="green"
              >
                {putLoading || attechmentLoading ? "Loading..." : "Tahrirlash"}
              </Button>
            </div>
          </div>
        }
      />

      <DeleteModal
        onConfirm={deleteProduct}
        isModal={deleteModal}
        onClose={toggleDeleteModal}
        isLoading={deleteIsloading}
      />
    </>
  );
};

export default Product;

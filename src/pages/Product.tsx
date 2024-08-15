import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Table from '../components/Tables/Table';
import useGet from '../hooks/get';
import ReactPaginate from 'react-paginate';
import GlobalModal from '../components/modal';
import Input from '../components/inputs/input';
import {
  Button,
  Checkbox,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from '@material-tailwind/react';
import useDelete from '../hooks/delete';
import DeleteModal from '../components/modal/deleteModal';
import { toast } from 'sonner';
import usePost from '../hooks/post';
import usePut from '../hooks/put';

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

  // states
  const [page, setPage] = useState<number>(0);
  const [toggle, setToggle] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [detailsIds, setDetailIds] = useState<number[]>([]);
  const [deleteId, setDeleteId] = useState<number>();
  const [name, setName] = useState<string>('');
  const [file, setFile] = useState<any>(null);
  const [update, setUpdate] = useState<any>();
  const [editModal, setEditModal] = useState(false);
  const [detailsName, setDeatilsName] = useState<any>([]);

  const toggleModal = () => {
    setToggle(!toggle);
    setDetailIds([]);
    setDeatilsName([]);
  };
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const toggleEditModal = () => {
    setEditModal(!editModal);
    setDetailIds([]);
    setDeatilsName([]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const validate = () => {
    if (!name.trim() || !detailsIds.length || !file) return true;
    return false;
  };

  const handlePageClick = (e: any) => {
    setPage(e.selected);
  };

  const sortDetailIds = (item: any) => {
    if (detailsIds.includes(item.id)) {
      const res = detailsIds.filter((state) => state !== item.id);
      const detail = detailsName.filter((state: any) => state !== item);
      setDeatilsName(detail);
      setDetailIds(res);
    } else {
      setDetailIds([...detailsIds, item.id]);
      setDeatilsName([...detailsName, item]);
    }
  };

  const addProduct = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const attachmentId = await addAttechmet('/attachment/upload', formData);

      await post('/product', {
        name,
        detailIds: detailsIds,
        attachmentId,
      });
      get('/product', page);
      toast.success("Mufaqiyatli qo'shildi");
      setName('');
      setDetailIds([]);
      setFile(null);
      toggleModal();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const editProduct = async () => {
    try {
      if (!name.trim() || !detailsIds.length)
        throw new Error("Bo'sh maydonlarni to'ldiring");

      const formData = new FormData();
      formData.append('file', file);

      if (file) await put('/attachment', update.attachmentId, formData);

      await put('/product', update.id, {
        name,
        detailIds: detailsIds,
        attachmentId: update.attachmentId,
      });
      get('/product', page);
      toast.success('Mufaqiyatli tahrirlandi');
      setName('');
      setDetailIds([]);
      setFile(null);
      toggleEditModal();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteProduct = async () => {
    try {
      await remove('/product/', deleteId);
      get('/product', page);
      toggleDeleteModal();
      toast.success("Mufaqiyatli o'chirildi");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    get('/product', page);
    getDetail('/detail');
  }, []);

  useEffect(() => {
    if (update) {
      setName(update.name);
      setDetailIds(update.detailIds ? update.detailIds : []);
    }
  }, [update, editModal]);

  return (
    <>
      <Breadcrumb pageName="Product" />

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
      />
      {!isLoading && data && data.object ? (
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
      ) : null}

      <GlobalModal
        isOpen={toggle}
        onClose={toggleModal}
        children={
          <div className="sm:w-96 w-full relative">
            <Input onChange={handleImageChange} label="Rasm" type="file" />
            <Input
              onChange={(e: any) => setName(e.target.value)}
              label="Mahsulot nomi"
            />
            <Menu
              dismiss={{
                itemPress: false,
              }}
            >
              <MenuHandler>
                <div className="w-full cursor-pointer rounded flex gap-2 border overflow-y-auto border-black text-black px-6 py-3 text-start font-normal">
                  {detailsName && detailsName.length
                    ? detailsName.map((item: any) => (
                        <p className="border rounded p-1 line-clamp-1">
                          {item.name}
                        </p>
                      ))
                    : 'Detalni tanlang'}
                </div>
              </MenuHandler>
              <MenuList className="z-[1000000] bg-white border relative max-h-50 w-60 sm:w-96 text-black">
                {details && !detailIsloading ? (
                  <>
                    {details.object.map((item: any) => (
                      <MenuItem
                        onClick={() => sortDetailIds(item)}
                        key={item.id}
                        className="p-0 !bg-white !text-black active:bg-white/50 hover:bg-white/50 hover:text-black flex items-center w-full"
                      >
                        <label
                          htmlFor={item.id}
                          className="flex cursor-pointer items-center gap-2 p-2"
                        >
                          <Checkbox
                            color="blue"
                            ripple={false}
                            checked={detailsIds.includes(item.id)}
                            id={item.id}
                            containerProps={{ className: 'p-0' }}
                            className="hover:before:content-none"
                          />

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
                            Loading....
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
                {postLoading || attechmentLoading ? 'Loading...' : "Qo'shish"}
              </Button>
            </div>
          </div>
        }
      />
      <GlobalModal
        isOpen={editModal}
        onClose={toggleEditModal}
        children={
          <div className="sm:w-96 w-full relative">
            <Input onChange={handleImageChange} label="Rasm" type="file" />
            <Input
              onChange={(e: any) => setName(e.target.value)}
              value={name}
              label="Masulot nomi"
            />
            <Menu
              dismiss={{
                itemPress: false,
              }}
            >
              <MenuHandler>
                <div className="w-full rounded cursor-pointer flex gap-2 border overflow-y-auto border-black text-black px-6 py-3 text-start font-normal">
                  {detailsName && detailsName.length
                    ? detailsName.map((item: any) => (
                        <p className="border rounded p-1 line-clamp-1">
                          {item.name}
                        </p>
                      ))
                    : 'Detalni tanlang'}
                </div>
              </MenuHandler>
              <MenuList className="z-[1000000] bg-white border relative max-h-50 w-60 sm:w-96 text-black">
                {details && !detailIsloading ? (
                  <>
                    {details.object.map((item: any) => (
                      <MenuItem
                        onClick={() => sortDetailIds(item)}
                        key={item.id}
                        className="p-0 !bg-white !text-black active:bg-white/50 hover:bg-white/50 hover:text-black flex items-center w-full"
                      >
                        <label
                          htmlFor={item.id}
                          className="flex cursor-pointer items-center gap-2 p-2"
                        >
                          <Checkbox
                            color="blue"
                            ripple={false}
                            checked={detailsIds.includes(item.id)}
                            id={item.id}
                            containerProps={{ className: 'p-0' }}
                            className="hover:before:content-none"
                          />

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
                            Loading....
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
              <Button disabled={putLoading} onClick={editProduct} color="green">
                {putLoading ? 'Loading...' : 'Tahrirlash'}
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

import { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Tables/Table';
import useGet from '../../hooks/get';
import ReactPaginate from 'react-paginate';
import GlobalModal from '../../components/modal';
import Input from '../../components/inputs/input';
import {
  Button,
  Checkbox,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from '@material-tailwind/react';
import useDelete from '../../hooks/delete';
import DeleteModal from '../../components/modal/deleteModal';
import { toast } from 'sonner';
import usePost from '../../hooks/post';
import usePut from '../../hooks/put';

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

  const toggleModal = () => setToggle(!toggle);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);
  const toggleEditModal = () => setEditModal(!editModal);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handlePageClick = (e: any) => {
    setPage(e.selected);
  };

  const sortDetailIds = (id: number) => {
    if (detailsIds.includes(id)) {
      const res = detailsIds.filter((state) => state !== id);
      setDetailIds(res);
    } else {
      setDetailIds([...detailsIds, id]);
    }
  };

  const addProduct = async () => {
    try {
      if (!name.trim() || !detailsIds.length || !file)
        throw new Error('All fields required');

      const formData = new FormData();
      formData.append('file', file);

      const attachmentId = await addAttechmet('/attachment/upload', formData);

      await post('/product', {
        name,
        detailIds: detailsIds,
        attachmentId,
      });
      get('/product', page);
      toast.success('Product added succesfuly');
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
      if (!name.trim() || !detailsIds.length || !file)
        throw new Error('All fields required');

      const formData = new FormData();
      formData.append('file', file);

      await put('/attachment', update.attachmentId, formData);

      await put('/product', update.id, {
        name,
        detailIds: detailsIds,
        attachmentId: update.attachmentId,
      });
      get('/product', page);
      toast.success('Product updated succesfuly');
      setName('');
      setDetailIds([]);
      setFile(null);
      toggleModal();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteProduct = async () => {
    try {
      await remove('/detail', deleteId);
      get('/product', page);
      toggleDeleteModal();
      toast.success('Product deleted succsefuly');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    get('/product', page);
    getDetail('/detail');
  }, []);

  return (
    <>
      <Breadcrumb pageName="Product" />

      <button
        onClick={toggleModal}
        className="rounded-lg shadow my-5 bg-gary-600 dark:bg-boxdark px-5 py-2"
      >
        Add
      </button>
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
          <div className="sm:w-96 w-60 relative">
            <Input onChange={handleImageChange} label="Image" type="file" />
            <Input
              onChange={(e: any) => setName(e.target.value)}
              label="Product name"
            />
            <Menu
              dismiss={{
                itemPress: false,
              }}
            >
              <MenuHandler>
                <Button className="w-full border text-start font-normal">
                  Select detail
                </Button>
              </MenuHandler>
              <MenuList className="z-[1000000] bg-[#30303d] border relative max-h-50 w-60 sm:w-96 text-white">
                {details && !detailIsloading ? (
                  <>
                    {details.object.map((item: any) => (
                      <MenuItem
                        onClick={() => sortDetailIds(item.id)}
                        key={item.id}
                        className="p-0 !bg-[#30303d] !text-white active:bg-black/50 hover:bg-black/50 hover:text-white flex items-center w-full"
                      >
                        <label
                          htmlFor="item-1"
                          className="flex cursor-pointer items-center gap-2 p-2"
                        >
                          <Checkbox
                            ripple={false}
                            checked={detailsIds.includes(item.id)}
                            id="item-1"
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
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
            <div className="w-96 mt-5 flex gap-5 justify-end">
              <Button onClick={toggleModal} color="red">
                Close
              </Button>
              <Button
                disabled={postLoading || attechmentLoading}
                onClick={addProduct}
                color="green"
              >
                {postLoading || attechmentLoading ? 'Loading...' : 'Add'}
              </Button>
            </div>
          </div>
        }
      />
      <GlobalModal
        isOpen={editModal}
        onClose={toggleEditModal}
        children={
          <div className="sm:w-96 w-60 relative">
            <Input onChange={handleImageChange} label="Image" type="file" />
            <Input
              onChange={(e: any) => setName(e.target.value)}
              value={name}
              label="Product name"
            />
            <Menu
              dismiss={{
                itemPress: false,
              }}
            >
              <MenuHandler>
                <Button className="w-full border text-start font-normal">
                  Select detail
                </Button>
              </MenuHandler>
              <MenuList className="z-[1000000] bg-[#30303d] border relative max-h-50 w-60 sm:w-96 text-white">
                {details && !detailIsloading ? (
                  <>
                    {details.object.map((item: any) => (
                      <MenuItem
                        onClick={() => sortDetailIds(item.id)}
                        key={item.id}
                        className="p-0 !bg-[#30303d] !text-white active:bg-black/50 hover:bg-black/50 hover:text-white flex items-center w-full"
                      >
                        <label
                          htmlFor="item-1"
                          className="flex cursor-pointer items-center gap-2 p-2"
                        >
                          <Checkbox
                            ripple={false}
                            checked={detailsIds.includes(item.id)}
                            id="item-1"
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
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
            <div className="w-96 mt-5 flex gap-5 justify-end">
              <Button onClick={toggleEditModal} color="red">
                Close
              </Button>
              <Button disabled={putLoading} onClick={editProduct} color="green">
                {putLoading ? 'Loading...' : 'Update'}
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

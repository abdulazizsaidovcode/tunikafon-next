import { FaRegEdit, FaRegFolderOpen, FaStar } from "react-icons/fa";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import useGet from "../../hooks/get";
import { useEffect, useState } from "react";
// import ReactPaginate from "react-paginate";
// import { dashboardStore } from "../../helpers/dashboard";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "sonner";
import DeleteModal from "../../components/modal/deleteModal";
import useDelete from "../../hooks/delete";
import { Button, Rating } from "@material-tailwind/react";
// import AddModal from "../../components/modal/add-modal";
import GlobalModal from "../../components/modal";
import usePost from "../../hooks/post";
import Input from "../../components/inputs/input";
import usePut from "../../hooks/put";

interface Group {
  id: number;
  userName: string;
  name: string;
  userId: string | number;
}

interface AddGroup {
  userId: string | number;
  name: string;
  employCount: number | string;
}


interface EditGroup {
  userId: string | number;
  name: string;
  employCount: number | string;
}
export default function Groups() {
  const { data, get, isLoading } = useGet();
  const { data: Users, get: getUser } = useGet();

  const { remove, isLoading: deleteIsLoading } = useDelete();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const deleteToggleModal = () => setDeleteModal(!deleteModal);
  const addToggleModal = () => setAddModal(!addModal);
  const { post, isLoading: postIsLoading } = usePost();
  const [addData, setAddData] = useState<AddGroup>({
    userId: '',
    name: '',
    employCount: 0
  });
  const [ratingModal, setRatingModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const { get: getStars, data: dataStars, isLoading: ratingIsLoading } = useGet();

  const ratingToggleModal = () => setRatingModal(!ratingModal);

  const { put, isLoading: editIsLoading } = usePut();

  const [editId, setEditId] = useState<number>(0);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState<EditGroup>({
    userId: '',
    name: '',
    employCount: 0
  });

  const editToggleModal = () => setEditModal(!editModal);
  const handleRatingClick = async (groupId: number) => {
    try {
      setSelectedGroupId(groupId);
      await getStars(`/feedback/${groupId}`);
      ratingToggleModal();
    } catch (error) {
      console.error("Error fetching ratings:", error);
      toast.error("Failed to fetch ratings");
    }
  };

  const handleEditClick = async () => {
    try {

      await put('/group', editId, editData);
      toast.success('Successfully updated');
      setEditData({ userId: '', name: '', employCount: 0 });
      editToggleModal();
      get('/group/all/list');
    } catch (error) {
      console.error('Error updating detail:', error);
      toast.error('Failed to update');
    }
  };
  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    const isValid =
      !!addData.userId &&
      !!addData.name &&
      !!addData.employCount

    setIsFormValid(isValid);
  }, [addData]);

  const handleDelete = async () => {
    try {
      if (deleteId !== null) {
        await remove(`/group/`, deleteId);
        toast.success('Successfully deleted');
        deleteToggleModal();
        get('/group/all/list');
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleAddClick = async () => {
    try {
      await post('/group', addData);
      toast.success('Successfully created');
      setAddData({ userId: '', name: '', employCount: 0 });
      addToggleModal();
      get('/group/all/list');
    } catch (error) {
      console.error('Error creating detail:', error);
      toast.error('');
    }
  };

  useEffect(() => {
    get('/group/all/list');
    getUser('/user/employees/group-not');
  }, []);

  return (
    <div>
      <Breadcrumb pageName="Guruhlar" />
      <div className="w-full  flex justify-between items-center">
        <Button
          className="rounded-lg my-5 text-white bg-boxdark shadow px-6 py-3"
          onClick={addToggleModal}
        >
          Guruh qushish
        </Button>
      </div>
      <div className="w-full max-w-full border border-stroke bg-white">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
          <table className="lg:w-[1145px] w-[992px] text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">#</th>
                <th scope="col" className="px-6 min-w-[200px] py-3">Hodim(Sardor) ismi</th>
                <th scope="col" className="px-6 min-w-[200px] py-3">Guruh Nomi</th>
                <th scope="col" className="px-6 min-w-[200px] py-3">Ishchilar soni</th>
                <th scope="col" className="px-6 min-w-[200px] py-3">Baholarni kurish</th>
                <th colSpan={2} scope="col" className="px-6 py-3">Qushimcha</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && data?.object ? (
                data.object.map((item: Group, i: number) => (
                  <tr key={item.id}>
                    <td className="px-6 py-3">{i + 1}</td>
                    <td className="px-6 py-3">{item.userName}</td>
                    <td className="px-6 py-3">{item.name}</td>
                    <td className="px-6 py-3">{item.userId}</td>
                    <td className="px-6 py-3">
                      <button onClick={() => handleRatingClick(item.id)}>
                        <FaStar />
                      </button>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => {
                          deleteToggleModal();
                          setDeleteId(item.id);
                        }}
                      >
                        <RiDeleteBinLine size={25} className="text-red-500" />
                      </button>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => {
                          const selectedGroup = data?.object.find((group: any) => group.id === item.id);
                          if (selectedGroup) {
                            setEditData({
                              userId: selectedGroup.userId,
                              name: selectedGroup.name,
                              employCount: selectedGroup.employCount,
                            });
                          }
                          setEditId(item.id);
                          editToggleModal();
                        }}
                      >
                        <FaRegEdit size={25} className="text-green-500" />
                      </button>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-3">Loading...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <DeleteModal
        isModal={deleteModal}
        onClose={deleteToggleModal}
        isLoading={deleteIsLoading}
        onConfirm={handleDelete}
      />
      <GlobalModal
        isOpen={addModal}
        onClose={addToggleModal}
      >
        <div className="lg:min-w-[600px] min-w-[300px] py-4">
          <div className="flex flex-col">
            <label className="block mb-2">
              Hodim tanlash
            </label>
            <select
              value={addData.userId}

              onChange={(e) => setAddData({ ...addData, userId: e.target.value })}
              className="w-full rounded  mb-3 px-1 py-2 outline-none"
            >
              <option value="" disabled>Hodim tanlang</option>
              {Users && Users.map((item: number | any) => (
                <option key={item.id} value={item.id}>
                  {item.fullName || "user topilmadi"}
                </option>
              ))}

            </select>
            <Input
              label="Guruh nomi"
              value={addData.name}
              onChange={(e) => setAddData({ ...addData, name: e.target.value })}
            />
            <Input
              label="Hodimlar soni"
              type="number"
              value={addData.employCount}
              onChange={(e) => setAddData({ ...addData, employCount: e.target.value })}
            />
          </div>
          <div className="w-full flex justify-between gap-5 mt-5">
            <Button onClick={addToggleModal} className="bg-graydark">
              Close
            </Button>
            <Button onClick={handleAddClick} disabled={!isFormValid || postIsLoading} color="green">
              {postIsLoading ? 'Loading...' : 'Add Group'}
            </Button>
          </div>
        </div>
      </GlobalModal>
      <GlobalModal
        isOpen={editModal}
        onClose={editToggleModal}
      >
        <div className="lg:min-w-[600px] min-w-[300px] py-4">
          <div className="flex flex-col">
            <label className="block mb-2">
              Hodim tanlash
            </label>
            <select
              onChange={(e) => setEditData({ ...editData, userId: e.target.value })}
              className="w-full rounded  mb-3 px-1 py-2 outline-none"
            >
              <option selected value={editData.userId}>
                Uzgratirilmasin
              </option>
              {Users && Users.map((item: number | any) => (
                <option key={item.id} value={item.id}>
                  {item.fullName || "user topilmadi"}
                </option>
              ))}

            </select>
            <Input
              label="Guruh nomi"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
            <Input
              label="Hodimlar soni"
              type="number"
              value={editData.employCount}
              onChange={(e) => setEditData({ ...editData, employCount: e.target.value })}
            />
          </div>
          <div className="w-full flex justify-between gap-5 mt-5">
            <Button onClick={editToggleModal} className="bg-graydark">
              Close
            </Button>
            <Button onClick={handleEditClick} color="green">
              {editIsLoading ? 'Loading...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </GlobalModal>
      <GlobalModal
        isOpen={ratingModal}
        onClose={ratingToggleModal}
      >
        <div className="lg:min-w-[600px] min-w-[300px] ">
          <h2 className="text-lg font-semibold mb-4">Group Ratings</h2>
          {ratingIsLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="flex flex-col gap-3"> 
              {dataStars && dataStars.length ? (
                dataStars.map((rating: any, index: number) => (
                  <div key={index} className=" border px-3 py-1 flex flex-col gap-3 mb-3">
                    <h1 className="font-semibold">{rating.orderDate}</h1>
                    <p className="mr-3 flex justify-between ">Izoh: <span>{rating.message || '-'}</span></p>
                    <p className="mr-3 flex justify-between ">Baho <span><Rating value={rating.count} readonly/></span></p>

                  </div>
                ))
              ) : (
                <FaRegFolderOpen size={50}/>
              )}
            </div>
          )}
          <div className="mt-5 flex justify-end">
            <Button onClick={ratingToggleModal} className="bg-graydark">
              Close
            </Button>
          </div>
        </div>
      </GlobalModal>

    </div>
  );
}

import DropdownUser from './DropdownUser';
import GlobalModal from '../modal';
import { useEffect, useState } from 'react';
import useGet from '../../hooks/get';
import Input from '../inputs/input';
import { Button } from '@material-tailwind/react';
import usePost from '../../hooks/post';
import usePut from '../../hooks/put';
import { toast } from 'sonner';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import DarkModeSwitcher from './DarkModeSwitcher';

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const { get, data } = useGet();
  const { post: attechmentUpload, isLoading: attechmentLoading } = usePost();
  const { put, isLoading: updateLoading } = usePut();

  const [toggle, setToggle] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [file, setFile] = useState<any>(0);
  const [togglePassword, setTogglePassword] = useState(false);
  const [editUserData, setEditUserData] = useState<any>({
    fullName: '',
    phoneNumber: '+998',
    password: '',
  });

  const toggleModal = () => {
    setToggle(!toggle);
    setDropdownOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const validate = () => {
    if (
      !editUserData.fullName ||
      !editUserData.phoneNumber.length ||
      !editUserData.password
    ) {
      return true;
    }
    return false;
  };

  const handleClick = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const attechment =
        file && (await attechmentUpload('/attachment/upload', formData));

      await put('/auth/edit/profile', null, {
        ...editUserData,
        attachmentId: attechment
          ? attechment
          : data.attachmentId
          ? data.attachmentId
          : 0,
      });
      get('/user/me');
      toggleModal();
    } catch (error) {
      toast.error("Ma'lumot mos emas");
    }
  };

  useEffect(() => {
    setEditUserData({
      fullName: data && data.fullName,
      phoneNumber: data && data.phoneNumber,
      password: '',
    });
  }, [toggle, data]);

  useEffect(() => {
    get('/user/me');
  }, []);

  return (
    <>
      <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 ">
        <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
          <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
            {/* <!-- Hamburger Toggle BTN --> */}
            <button
              aria-controls="sidebar"
              onClick={(e) => {
                e.stopPropagation();
                props.setSidebarOpen(!props.sidebarOpen);
              }}
              className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm   lg:hidden"
            >
              <span className="relative block h-5.5 w-5.5 cursor-pointer">
                <span className="du-block absolute right-0 h-full w-full">
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out  ${
                      !props.sidebarOpen && '!w-full delay-300'
                    }`}
                  ></span>
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out ${
                      !props.sidebarOpen && 'delay-400 !w-full'
                    }`}
                  ></span>
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out ${
                      !props.sidebarOpen && '!w-full delay-500'
                    }`}
                  ></span>
                </span>
                <span className="absolute right-0 h-full w-full rotate-45">
                  <span
                    className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out  ${
                      !props.sidebarOpen && '!h-0 !delay-[0]'
                    }`}
                  ></span>
                  <span
                    className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out ${
                      !props.sidebarOpen && '!h-0 !delay-200'
                    }`}
                  ></span>
                </span>
              </span>
            </button>
            {/* <!-- Hamburger Toggle BTN --> */}
          </div>

          <div className="hidden sm:block"></div>

          <div className="flex items-center gap-3 2xsm:gap-7">
            <ul className="flex items-center gap-2 2xsm:gap-4">
              {/* <!-- Dark Mode Toggler --> */}
              {/* <DarkModeSwitcher /> */}
            </ul>

            {/* <!-- User Area --> */}
            <DropdownUser
              data={data}
              toggleModal={toggleModal}
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
            />
            {/* <!-- User Area --> */}
          </div>
        </div>
      </header>
      <GlobalModal
        isOpen={toggle}
        onClose={toggleModal}
        children={
          <div className="w-full sm:w-96">
            <Input onChange={handleImageChange} type="file" label="Rasm" />
            <Input
              onChange={(e: any) =>
                setEditUserData({ ...editUserData, fullName: e.target.value })
              }
              value={editUserData.fullName}
              label="To'liq ism"
            />
            <Input
              onChange={(e: any) =>
                setEditUserData({
                  ...editUserData,
                  phoneNumber: e.target.value.replace(/[^0-9+]/g, ''),
                })
              }
              value={
                editUserData.phoneNumber &&
                editUserData.phoneNumber.replace(/[^0-9+]/g, '')
              }
              label="Telefon raqam"
            />
            <div className="relative">
              <Input
                onChange={(e: any) =>
                  setEditUserData({ ...editUserData, password: e.target.value })
                }
                value={editUserData.password}
                label="Parol"
                type={togglePassword ? 'text' : 'password'}
              />
              <span className="absolute right-4 top-10">
                {!togglePassword ? (
                  <button
                    onClick={(e: any) => {
                      e.preventDefault();
                      setTogglePassword(!togglePassword);
                    }}
                  >
                    <FaEye size={25} />
                  </button>
                ) : (
                  <button
                    onClick={(e: any) => {
                      e.preventDefault();
                      setTogglePassword(!togglePassword);
                    }}
                  >
                    <FaEyeSlash size={25} />
                  </button>
                )}
              </span>
            </div>
            <div className="w-full flex gap-5 justify-end">
              <Button onClick={toggleModal} color="red">
                Yopish
              </Button>
              <Button
                onClick={handleClick}
                disabled={validate() || attechmentLoading || updateLoading}
                color="green"
              >
                {attechmentLoading || updateLoading
                  ? 'Loading...'
                  : 'Tahrirlash'}
              </Button>
            </div>
          </div>
        }
      />
    </>
  );
};

export default Header;

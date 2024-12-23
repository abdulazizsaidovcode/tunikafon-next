import React, { useState } from 'react';
import useLogin from '../../hooks/useLogin';
import { toast } from 'sonner';
import { Button } from '@material-tailwind/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignIn: React.FC = () => {
  const [val, setVal] = useState({ phoneNumber: '+998', password: '' });
  const { login, isLoading } = useLogin();
  const [togglePassword, setTogglePassword] = useState(false);

  const validate = () => {
    if (!val.phoneNumber.trim() || !val.password.trim()) return true;
    else return false;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    try {
      login(val.phoneNumber.trim(), val.password.trim());
    } catch (error) {
      toast.error("Bo'sh maydonlarni toldiring");
    }
  };
 //  console.clear();
  return (
    <>
      <div className="rounded-sm bg-white ">
        <div className="flex h-screen flex-wrap justify-center items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="py-1 px-26 text-center">
              <h1 className="cursor-pointer inline-block text-5xl">
                Tunikafon
              </h1>
            </div>
          </div>

          <div className="w-full border-stroke  xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black  sm:text-title-xl2">
                Kirish
              </h2>

              <form>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black ">
                    Telefon raqam
                  </label>
                  <div className="relative">
                    <input
                      onChange={(e) =>
                        setVal({
                          ...val,
                          phoneNumber: e.target.value.replace(/[^0-9+]/g, ''),
                        })
                      }
                      value={val.phoneNumber.replace(/[^0-9+]/g, '')}
                      type="text"
                      placeholder="Telefon raqamingizni kiriting"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none "
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black">
                    Parol
                  </label>
                  <div className="relative">
                    <input
                      onChange={(e) =>
                        setVal({
                          ...val,
                          password: e.target.value,
                        })
                      }
                      type={togglePassword ? 'text' : 'password'}
                      placeholder="Parolingizni kiriting"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                    />

                    <span className="absolute right-4 top-4">
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
                </div>

                <div className="mb-5">
                  <Button
                    disabled={isLoading || validate()}
                    onClick={handleSubmit}
                    type="submit"
                    className="w-full cursor-pointer rounded-lg border border-boxdark bg-boxdark p-4 text-white transition hover:bg-opacity-90"
                  >
                    {isLoading ? 'Loading...' : 'Kirish'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;

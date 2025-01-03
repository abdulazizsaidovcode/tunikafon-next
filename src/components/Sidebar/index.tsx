import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BsBarChart, BsBlockquoteRight, BsBoxSeam, BsFileSpreadsheet } from 'react-icons/bs';
import { FaRegUser } from "react-icons/fa";
import { PiUsersLight } from "react-icons/pi";
import { LuListOrdered } from "react-icons/lu";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const styles = {
    sidemenu: 'group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black duration-300 ease-in-out border border-transparent hover:border-[#B2C0CE] hover:bg-[#F5F9FD]'
  };

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-50 flex h-screen w-72.5 flex-col overflow-y-hidden bg-white duration-300 ease-linear  lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/dashboard" className="text-3xl text-black">
          Tunikafon
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-black">
              MENYU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <li>
                <NavLink
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  to="/dashboard"
                  className={`${styles.sidemenu} ${pathname.includes('/dashboard') && 'bg-gray border-[#003543]'}`}
                >
                  <BsBarChart />
                  Statistika
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  to="/orders"
                  className={`${styles.sidemenu} ${pathname.includes('/orders') && 'bg-gray border-[#003543]'}`}
                >
                  <LuListOrdered />
                  Buyurtmalar
                </NavLink>
              </li>
              {/* <!-- Menu Item Groups --> */}
              <li>
                <NavLink
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  to="/groups"
                  className={`${styles.sidemenu} ${pathname.includes('/groups') && 'bg-gray border-[#003543]'}`}
                >
                  <PiUsersLight />
                  Guruhlar
                </NavLink>
              </li>
              {/* <!-- Menu Item Details --> */}
              <li>
                <NavLink
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  to="/categor-detail"
                  className={`${styles.sidemenu} ${pathname.includes('/categor-detail') && 'bg-gray border-[#003543]'}`}
                >
                  <BsBlockquoteRight />
                  Detal bo'limlari
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  to="/detail"
                  className={`${styles.sidemenu} ${pathname.includes('/detail') && 'bg-gray border-[#003543]'}`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_130_9756)">
                      <path
                        d="M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V15.8021C0.506348 16.7584 1.29385 17.574 2.27822 17.574H15.7782C16.7345 17.574 17.5501 16.7865 17.5501 15.8021V2.3021C17.522 1.34585 16.7063 0.55835 15.7501 0.55835ZM6.69385 10.599V6.4646H11.3063V10.5709H6.69385V10.599ZM11.3063 11.8646V16.3083H6.69385V11.8646H11.3063ZM1.77197 6.4646H5.45635V10.5709H1.77197V6.4646ZM12.572 6.4646H16.2563V10.5709H12.572V6.4646ZM2.2501 1.82397H15.7501C16.0313 1.82397 16.2563 2.04897 16.2563 2.33022V5.2271H1.77197V2.3021C1.77197 2.02085 1.96885 1.82397 2.2501 1.82397ZM1.77197 16.2538V11.8646H5.45635V16.3083H2.27822C2.02297 16.2802 1.77197 16.0584 1.77197 16.2538ZM15.7782 16.3083H12.572V11.8646H16.2563V15.7784C16.2563 16.0346 16.0345 16.2802 15.7782 16.3083Z"
                        fill=""
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_130_9756">
                        <rect
                          width="18"
                          height="18"
                          fill="white"
                          transform="translate(0 0.55835)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  Detallar
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  to="/product"
                  className={`${styles.sidemenu} ${pathname.includes('/product') && 'bg-gray border-[#003543]'}`}
                >
                  <BsBoxSeam />
                  Mahsulotlar
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  to="/Calculation"
                  className={`${styles.sidemenu} ${pathname.includes('/Calculation') && 'bg-gray border-[#003543]'}`}
                >
                  <BsFileSpreadsheet />
                  Shablon bo'yicha Hisoblash
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  to="/calculationSome"
                  className={`${styles.sidemenu} ${pathname.includes('/calculation') && 'bg-gray border-[#003543]'}`}
                >
                  <BsFileSpreadsheet />
                  Qo'lda Hisoblash
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  to="/employees"
                  className={`${styles.sidemenu} ${pathname.includes('/employees') && 'bg-gray border-[#003543]'}`}
                >
                  <FaRegUser />
                  Hodimlar
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

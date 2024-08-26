import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';

import Calculation from './pages/Calculation';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import DetailCategory from './pages/Detail-category';
import Detail from './pages/Detail/Detail';
import Product from './pages/Product';
import Employees from './pages/Employees';
import EmployeeRoute from './layout/Employee';
import useGet from './hooks/get';

function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { get, data, isLoading } = useGet();

  const role = localStorage.getItem('role');

  useEffect(() => {
    get('/user/me');
  }, []);

  useEffect(() => {
    if (data) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [data]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (isLoading) {
    return (
      <div>
        <div className="w-full flex justify-center items-center h-screen">
          <div
            className="inline-block h-20 w-20 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      {data ? (
        <>
          {role === 'ROLE_SUPER_ADMIN' ? (
            <DefaultLayout>
              <Routes>
                <Route
                  path="/dashboard"
                  element={
                    <>
                      <PageTitle title="Dashboard" />
                      <ECommerce />
                    </>
                  }
                />
                <Route
                  path="/categor-detail"
                  element={
                    <>
                      <PageTitle title="DetailCategory" />
                      <DetailCategory />
                    </>
                  }
                />
                <Route
                  path="/detail"
                  element={
                    <>
                      <PageTitle title="Detail" />
                      <Detail />
                    </>
                  }
                />
                <Route
                  path="/product"
                  element={
                    <>
                      <PageTitle title="Product" />
                      <Product />
                    </>
                  }
                />
                <Route
                  path="/calculation"
                  element={
                    <>
                      <PageTitle title="Calculation" />
                      <Calculation />
                    </>
                  }
                />
                <Route
                  path="/employees"
                  element={
                    <>
                      <PageTitle title="Employees" />
                      <Employees />
                    </>
                  }
                />
                <Route
                  path="/chart"
                  element={
                    <>
                      <PageTitle title="Basic Chart" />
                      <Chart />
                    </>
                  }
                />
                <Route
                  path="/ui/alerts"
                  element={
                    <>
                      <PageTitle title="Alerts" />
                      <Alerts />
                    </>
                  }
                />
                <Route
                  path="/ui/buttons"
                  element={
                    <>
                      <PageTitle title="Buttons" />
                      <Buttons />
                    </>
                  }
                />
              </Routes>
            </DefaultLayout>
          ) : (
            <EmployeeRoute>
              <Routes>
                <Route
                  path="/dashboard"
                  element={
                    <>
                      <PageTitle title="Dashboard" />
                      <ECommerce />
                    </>
                  }
                />
                <Route
                  path="/calculation"
                  element={
                    <>
                      <PageTitle title="Tables " />
                      <Calculation />
                    </>
                  }
                />
              </Routes>
            </EmployeeRoute>
          )}
        </>
      ) : (
        <Routes>
          <Route
            path="/login"
            element={
              <>
                <PageTitle title="Signin" />
                <SignIn />
              </>
            }
          />
        </Routes>
      )}
    </>
  );
}

export default App;

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

function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (token) navigate('/dashboard');
    else navigate('/login');
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      {token ? (
        <>
          {role === "ROLE_SUPER_ADMIN" ? <DefaultLayout>
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <>
                    <PageTitle title="Dashboard |" />
                    <ECommerce />
                  </>
                }
              />
              <Route
                path="/categor-detail"
                element={
                  <>
                    <PageTitle title="DetailCategory |" />
                    <DetailCategory />
                  </>
                }
              />
              <Route
                path="/detail"
                element={
                  <>
                    <PageTitle title="Detail |" />
                    <Detail />
                  </>
                }
              />
              <Route
                path="/product"
                element={
                  <>
                    <PageTitle title="Product |" />
                    <Product />
                  </>
                }
              />
              <Route
                path="/calculation"
                element={
                  <>
                    <PageTitle title="Tables |" />
                    <Calculation />
                  </>
                }
              />
              <Route
                path="/employees"
                element={
                  <>
                    <PageTitle title="Employees |" />
                    <Employees />
                  </>
                }
              />
              <Route
                path="/chart"
                element={
                  <>
                    <PageTitle title="Basic Chart |" />
                    <Chart />
                  </>
                }
              />
              <Route
                path="/ui/alerts"
                element={
                  <>
                    <PageTitle title="Alerts |" />
                    <Alerts />
                  </>
                }
              />
              <Route
                path="/ui/buttons"
                element={
                  <>
                    <PageTitle title="Buttons |" />
                    <Buttons />
                  </>
                }
              />
            </Routes>
          </DefaultLayout> :
            <EmployeeRoute >
              <Routes>
                <Route
                  path="/dashboard"
                  element={
                    <>
                      <PageTitle title="eCommerce Dashboard |" />
                      <ECommerce />
                    </>
                  }
                />
                <Route
                  path="/calculation"
                  element={
                    <>
                      <PageTitle title="Tables |" />
                      <Calculation />
                    </>
                  }
                />
              </Routes>
            </EmployeeRoute>
          }
        </>
      ) : (
        <Routes>
          <Route
            path="/login"
            element={
              <>
                <PageTitle title="Signin |" />
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

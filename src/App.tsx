import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import Detail from './pages/Form/FormElements';
import Product from './pages/Form/FormLayout';
import DetailCategory from './pages/Profile';
import Employees from './pages/Settings';
import Calculation from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import Category from './pages/Calendar';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (token) navigate('/');
    else navigate('/login');
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      {token ? (
        <DefaultLayout>
          <Routes>
            <Route
              index
              element={
                <>
                  <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <ECommerce />
                </>
              }
            />
            <Route
              path="/category"
              element={
                <>
                  <PageTitle title="Category | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Category />
                </>
              }
            />
            <Route
              path="/categor-detail"
              element={
                <>
                  <PageTitle title="DetailCategory | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <DetailCategory />
                </>
              }
            />
            <Route
              path="/detail"
              element={
                <>
                  <PageTitle title="Detail | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Detail />
                </>
              }
            />
            <Route
              path="/product"
              element={
                <>
                  <PageTitle title="Product | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Product />
                </>
              }
            />
            <Route
              path="/calculation"
              element={
                <>
                  <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Calculation />
                </>
              }
            />
            <Route
              path="/employees"
              element={
                <>
                  <PageTitle title="Employees | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Employees />
                </>
              }
            />
            <Route
              path="/chart"
              element={
                <>
                  <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Chart />
                </>
              }
            />
            <Route
              path="/ui/alerts"
              element={
                <>
                  <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Alerts />
                </>
              }
            />
            <Route
              path="/ui/buttons"
              element={
                <>
                  <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Buttons />
                </>
              }
            />
          </Routes>
        </DefaultLayout>
      ) : (
        <Routes>
          <Route
            path="/login"
            element={
              <>
                <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
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

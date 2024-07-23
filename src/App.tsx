import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route
          path="/dashboard"
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
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignUp />
            </>
          }
        />
      </Routes>
    </DefaultLayout>
  );
}

export default App;

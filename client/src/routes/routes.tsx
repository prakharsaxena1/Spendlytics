import { Navigate, redirect, type RouteObject } from "react-router-dom";
import Layout from "../components/Layout";
import ErrorElement from "../pages/Errors/ErrorElement";
import LandingPage from "../pages/LandingPage";
import MoneyPlans from "../pages/MoneyPlans";
import Transactions from "../pages/Transactions";
import Dashboard from "../pages/Dashboard";
import Account from "../pages/Account";
import Settings from "../pages/Settings";
import LoginRegister from "../pages/LoginRegister";
import SharedGroups from "../pages/SharedGroups";
import { store } from "../redux/store";
import { AuthApis } from "../redux/services/auth";

const routes: RouteObject[] = [
  {
    path: "/",
    errorElement: <ErrorElement />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
        loader: async () => {
          try {
            const user = await store
              .dispatch(AuthApis.endpoints.getCurrentUser.initiate())
              .unwrap();
            if (!user) return redirect("/");
            return null;
          } catch {
            return redirect("/");
          }
        },
      },
      {
        path: "/account",
        element: <LoginRegister />,
      },
      {
        path: "/app",
        element: <Layout />,
        loader: async () => {
          try {
            const user = await store
              .dispatch(AuthApis.endpoints.getCurrentUser.initiate())
              .unwrap();
            if (!user) return redirect("/account?tab=login");
            return null;
          } catch {
            return redirect("/account?tab=login");
          }
        },
        children: [
          {
            index: true,
            element: <Navigate to="/app/dashboard" replace />,
          },
          {
            path: "/app/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/app/transactions",
            element: <Transactions />,
          },
          {
            path: "/app/shared-groups",
            element: <SharedGroups />,
          },
          {
            path: "/app/money-plans",
            element: <MoneyPlans />,
          },
          {
            path: "/app/settings",
            element: <Settings />,
          },
          {
            path: "/app/account",
            element: <Account />,
          },
        ],
      },
    ],
  },
];

export default routes;

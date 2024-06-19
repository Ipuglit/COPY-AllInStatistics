import { lazy, Suspense, useEffect } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/dashboard'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const UsersPage = lazy(() => import('src/pages/users'));
export const AccountsPage = lazy(() => import('src/pages/accounts'));
export const MyAccountsPage = lazy(() => import('src/pages/myaccounts'));
export const UplinesPage = lazy(() => import('src/pages/uplines'));
export const MyUplinesPage = lazy(() => import('src/pages/myuplines'));
export const HistoryPage = lazy(() => import('src/pages/history'));
export const ClubsPage = lazy(() => import('src/pages/clubs'));
export const ApplicationsPage = lazy(() => import('src/pages/applications'));
export const FXRatesPage = lazy(() => import('src/pages/fxrates'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {

  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'users', element: <UsersPage /> },
        { path: 'accounts', element: <AccountsPage /> },
        { path: 'myaccounts', element: <MyAccountsPage /> },
        { path: 'uplines', element: <UplinesPage /> },
        { path: 'myuplines', element: <MyUplinesPage /> },
        { path: 'history', element: <HistoryPage /> },
        { path: 'applications', element: <ApplicationsPage /> },
        { path: 'clubs', element: <ClubsPage /> },
        { path: 'fxrates', element: <FXRatesPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}

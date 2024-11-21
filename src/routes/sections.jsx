import { lazy, Suspense, useEffect } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import CSVUploadPage from 'src/pages/csvupload';
import RegisterPage from 'src/pages/register';

import { GoTo } from 'src/layouts/dashboard/control';

export const IndexPage = lazy(() => import('src/pages/dashboard'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const DealsPage = lazy(() => import('src/pages/deals'));
export const UsersPage = lazy(() => import('src/pages/users'));
export const AccountsPage = lazy(() => import('src/pages/accounts'));
export const MyAccountsPage = lazy(() => import('src/pages/myaccounts'));
export const UplinesPage = lazy(() => import('src/pages/uplines'));
export const MyUplinesPage = lazy(() => import('src/pages/myuplines'));
export const HistoryPage = lazy(() => import('src/pages/history'));
export const MyHistoryPage = lazy(() => import('src/pages/myhistory'));
export const RecordsPage = lazy(() => import('src/pages/records'));
export const MyRecordsPage = lazy(() => import('src/pages/myrecords'));
export const ClubsPage = lazy(() => import('src/pages/clubs'));
export const ApplicationsPage = lazy(() => import('src/pages/applications'));
export const FXRatesPage = lazy(() => import('src/pages/fxrates'));
export const FormulaPage = lazy(() => import('src/pages/formula'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const AnnouncementPage = lazy(() => import('src/pages/announcements'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  
  const A           = JSON.parse( localStorage.getItem('slk-user') )
  const B           = JSON.parse( localStorage.getItem('slk-route') )

  const Go          = GoTo(A,B)

  const adminPages  = { element: <IndexPage />, index: true }
  const usersPages  = { element: <MyAccountsPage />, index: true }

  const homePages   = A?.roleID < 4 ? usersPages : adminPages

  const routes      = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: A?.roleID < 4 ? <MyAccountsPage /> : <IndexPage />, index: true },
       Go.Apps    ? { path: 'applications', element: <ApplicationsPage /> } : homePages,
       Go.Clubs   ? { path: 'clubs', element: <ClubsPage /> } : homePages,
       Go.Deals   ? { path: 'deals', element: <DealsPage /> } : homePages,
       Go.Users   ? { path: 'users', element: <UsersPage /> } : homePages,
       Go.Accounts? { path: 'accounts', element: <AccountsPage /> } : homePages,
       Go.Uplines ? { path: 'uplines', element: <UplinesPage /> } : homePages,
       Go.Formula ? { path: 'formula', element: <FormulaPage /> } : homePages,
       Go.Records ? { path: 'records', element: <RecordsPage /> } : homePages,
       Go.MyRecords ? { path: 'myrecords', element: <MyRecordsPage /> } : homePages,
       Go.Rates   ? { path: 'fxrates', element:  <FXRatesPage/> } : homePages,
       Go.CSVUp   ? { path: 'csvupload', element: <CSVUploadPage /> } : homePages,
       Go.History ? { path: 'history', element: <HistoryPage /> } : homePages,
       Go.Announce ? { path: 'announce', element: <AnnouncementPage /> } : homePages,
        //goUnions  ? { path: 'unions', element: <UnionsPage /> } : adminPages,
        //goNotifs  ? { path: 'notifications', element: <NotificationPage /> } : adminPages,
        { path: 'myaccounts', element: <MyAccountsPage /> },
        { path: 'myuplines', element: <MyUplinesPage /> },
        { path: 'myhistory', element: <MyHistoryPage /> },

      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'register',
      element: <RegisterPage />,
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

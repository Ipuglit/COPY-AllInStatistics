import { Helmet } from 'react-helmet-async';

import { MyAccountsView } from 'src/sections/myaccounts/view/';

// ----------------------------------------------------------------------

export default function MyAccountsPage() {
  return (
    <>
      <Helmet>
        <title> My Accounts | Poker Analytics </title>
      </Helmet>

      <MyAccountsView />
    </>
  );
}

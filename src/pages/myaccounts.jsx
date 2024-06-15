import { Helmet } from 'react-helmet-async';

import { Viewing } from 'src/sections/accounts/view/';

// ----------------------------------------------------------------------

export default function MyAccountsPage() {
  return (
    <>
      <Helmet>
        <title> My Accounts | Poker Analytics </title>
      </Helmet>

      <Viewing TheFor="MINE" TheTitle="MY ACCOUNTS" />
    </>
  );
}

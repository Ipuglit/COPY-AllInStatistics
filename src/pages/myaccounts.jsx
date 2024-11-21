import { Helmet } from 'react-helmet-async';

import { Viewing } from 'src/sections/myaccounts';

// ----------------------------------------------------------------------

export default function MyAccountsPage() {
  return (
    <>
      <Helmet>
        <title> My Accounts | All In Statistics </title>
      </Helmet>

      <Viewing TheFor="MINE" TheTitle="MY ACCOUNTS" />
    </>
  );
}

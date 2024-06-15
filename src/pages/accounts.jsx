import { Helmet } from 'react-helmet-async';

import { Viewing } from 'src/sections/accounts/view/';

// ----------------------------------------------------------------------

export default function AccountsPage() {
  return (
    <>
      <Helmet>
        <title> Accounts | Poker Analytics </title>
      </Helmet>

      <Viewing TheFor="ALL" TheTitle="ACCOUNTS" />
    </>
  );
}

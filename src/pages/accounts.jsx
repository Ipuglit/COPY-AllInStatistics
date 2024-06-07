import { Helmet } from 'react-helmet-async';

import { AccountsView } from 'src/sections/accounts/view/';

// ----------------------------------------------------------------------

export default function AccountsPage() {
  return (
    <>
      <Helmet>
        <title> Accounts | Poker Analytics </title>
      </Helmet>

      <AccountsView />
    </>
  );
}

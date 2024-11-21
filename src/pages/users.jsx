import { Helmet } from 'react-helmet-async';

import { Viewing } from 'src/sections/users/view/';

// ----------------------------------------------------------------------

export default function UsersPage() {
  return (
    <>
      <Helmet>
        <title> Users | All In Statistics </title>
      </Helmet>

      <Viewing TheFor="ALL" TheTitle="USERS" />
    </>
  );
}

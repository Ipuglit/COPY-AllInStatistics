import { Helmet } from 'react-helmet-async';

import { Upsert } from 'src/sections/register/';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Register | All In Statistics </title>
      </Helmet>

      <Upsert TheFor="ALL" TheTitle="REGISTER" />
    </>
  );
}

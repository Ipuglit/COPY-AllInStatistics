import { Helmet } from 'react-helmet-async';

import { Viewing } from 'src/sections/formula/';

// ----------------------------------------------------------------------

export default function FormulaPage() {
  return (
    <>
      <Helmet>
        <title> Formula | All In Statistics </title>
      </Helmet>

      <Viewing TheFor="ALL" TheTitle="FORMULA" />
    </>
  );
}

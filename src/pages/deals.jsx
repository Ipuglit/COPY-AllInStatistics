import { Helmet } from 'react-helmet-async';

import { Viewing } from 'src/sections/deals/';

// ----------------------------------------------------------------------

export default function DealsPage() {
  return (
    <>
      <Helmet>
        <title> Deals | All In Statistics </title>
      </Helmet>

      <Viewing TheFor="ALL" TheTitle="DEALS" />
    </>
  );
}

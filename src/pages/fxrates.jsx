import { Helmet } from 'react-helmet-async';

import { Viewing } from 'src/sections/fxrates/view/';

// ----------------------------------------------------------------------

export default function FXRatesPage() {
  return (
    <>
      <Helmet>
        <title> FX Rates | All In Statistics </title>
      </Helmet>

      <Viewing TheFor="ALL" TheTitle="FX RATES" />
    </>
  );
}

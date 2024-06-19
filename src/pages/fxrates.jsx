import { Helmet } from 'react-helmet-async';

import { Viewing } from 'src/sections/uplines/view/';

// ----------------------------------------------------------------------

export default function FXRatesPage() {
  return (
    <>
      <Helmet>
        <title> FX Rates | Poker Analytics </title>
      </Helmet>

      <Viewing TheFor="ALL" TheTitle="FXRATES" />
    </>
  );
}

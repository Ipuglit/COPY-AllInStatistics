import { Helmet } from 'react-helmet-async';

import { Viewing } from 'src/sections/uplines/view/';

// ----------------------------------------------------------------------

export default function UplinesPage() {
  return (
    <>
      <Helmet>
        <title> Uplines | Poker Analytics </title>
      </Helmet>

      <Viewing TheFor="ALL" TheTitle="UPLINES" />
    </>
  );
}

import { Helmet } from 'react-helmet-async';

import { Viewing } from 'src/sections/uplines/view/';

// ----------------------------------------------------------------------

export default function MyUplinesPage() {
  return (
    <>
      <Helmet>
        <title> My Uplines | Poker Analytics </title>
      </Helmet>

      <Viewing TheFor="ALL" TheTitle="MY UPLINES" />
    </>
  );
}

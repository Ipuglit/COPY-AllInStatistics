import { Helmet } from 'react-helmet-async';

import { Viewing } from 'src/sections/uplines/view/';

// ----------------------------------------------------------------------

export default function UplinesPage() {
  return (
    <>
      <Helmet>
        <title> Uplines | All In Statistics </title>
      </Helmet>

      <Viewing TheFor="ALL" TheTitle="UPLINES" />
    </>
  );
}

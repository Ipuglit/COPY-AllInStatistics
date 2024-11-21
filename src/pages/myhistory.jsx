import { Helmet } from 'react-helmet-async';

import { Viewing } from 'src/sections/history/view/';

// ----------------------------------------------------------------------

export default function MyHistoryPage() {
  return (
    <>
      <Helmet>
        <title> My History | All In Statistics </title>
      </Helmet>

      <Viewing TheFor="MINE" TheTitle="MY HISTORY" />
    </>
  );
}

import { Helmet } from 'react-helmet-async';

import { Viewing } from 'src/sections/history/view/';

// ----------------------------------------------------------------------

export default function HistoryPage() {
  return (
    <>
      <Helmet>
        <title> History | All In Statistics </title>
      </Helmet>

      <Viewing TheFor="ALL" TheTitle="HISTORY" />
    </>
  );
}

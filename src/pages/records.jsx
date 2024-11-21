import { Helmet } from 'react-helmet-async';

import { Viewing } from 'src/sections/record/';

// ----------------------------------------------------------------------

export default function RecordsPage() {
  return (
    <>
      <Helmet>
        <title> Records | All In Statistics </title>
      </Helmet>

      <Viewing TheFor="ALL" TheTitle="RECORDS" />
    </>
  );
}

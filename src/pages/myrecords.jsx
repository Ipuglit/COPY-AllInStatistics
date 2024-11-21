import { Helmet } from 'react-helmet-async';

import { Viewing } from 'src/sections/myrecord/';

// ----------------------------------------------------------------------

export default function MyRecordsPage() {
  return (
    <>
      <Helmet>
        <title> My Records | All In Statistics </title>
      </Helmet>

      <Viewing TheFor="ALL" TheTitle="MY RECORDS" />
    </>
  );
}

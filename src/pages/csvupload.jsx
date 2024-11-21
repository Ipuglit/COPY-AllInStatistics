import { Helmet } from 'react-helmet-async';

import { Viewing } from 'src/sections/csvupload/view/';

// ----------------------------------------------------------------------

export default function CSVUploadPage() {
  return (
    <>
      <Helmet>
        <title> CSV Upload | All In Statistics </title>
      </Helmet>

      <Viewing TheFor="ALL" TheTitle="CSV UPLOAD" />
    </>
  );
}

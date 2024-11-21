import { Helmet } from 'react-helmet-async';

import { Viewing } from 'src/sections/announcements/view/';

// ----------------------------------------------------------------------

export default function AnnouncementPage() {
  return (
    <>
      <Helmet>
        <title> Announcements | All In Statistics </title>
      </Helmet>

      <Viewing TheFor="ALL" TheTitle="ANNOUNCEMENTS" />
    </>
  );
}

import { Helmet } from 'react-helmet-async';

import { Viewing } from 'src/sections/clubs/view/';

// ----------------------------------------------------------------------

export default function ClubsPage() {
  return (
    <>
      <Helmet>
        <title> Clubs | All In Statistics </title>
      </Helmet>

      <Viewing />
    </>
  );
}

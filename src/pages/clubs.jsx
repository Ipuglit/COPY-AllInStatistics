import { Helmet } from 'react-helmet-async';

import { ClubsView } from 'src/sections/clubs/view/';

// ----------------------------------------------------------------------

export default function ClubsPage() {
  return (
    <>
      <Helmet>
        <title> Clubs | Poker Analytics </title>
      </Helmet>

      <ClubsView />
    </>
  );
}

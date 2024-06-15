import { Helmet } from 'react-helmet-async';

import { Viewing } from 'src/sections/clubss/view/';

// ----------------------------------------------------------------------

export default function ClubsPage() {
  return (
    <>
      <Helmet>
        <title> Clubs | Poker Analytics </title>
      </Helmet>

      <Viewing />
    </>
  );
}

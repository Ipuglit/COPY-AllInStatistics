import { Helmet } from 'react-helmet-async';

import { ApplicationsView } from 'src/sections/applications/view/';

// ----------------------------------------------------------------------

export default function ApplicationsPage() {
  return (
    <>
      <Helmet>
        <title> Applications | Poker Analytics </title>
      </Helmet>

      <ApplicationsView />
    </>
  );
}

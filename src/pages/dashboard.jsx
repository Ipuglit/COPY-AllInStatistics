import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { AppView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function AppPage() {


  return (
    <>
      <Helmet>
        <title> Dashboard | All In Statistics </title>
      </Helmet>

    <AppView /> 

    </>
  );
}

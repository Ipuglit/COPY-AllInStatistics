import { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';

import { shadows } from './shadows';
import { typography } from './typography';
import { customShadows } from './custom-shadows';

// ----------------------------------------------------------------------

export default function ThemeProvider({ children }) {

  const themeModed    = JSON.parse(localStorage.getItem("theme-mode"))

  const memoizedValue = useMemo(
    () => ({
      palette: {mode: themeModed.theme ? themeModed.theme : 'light'},
      typography,
      shadows: shadows(),
      customShadows: customShadows(),
      shape: { borderRadius: 8 },
    }),
    []
  );

  const theme = createTheme(memoizedValue);
  
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

import { useState,useEffect } from 'react';

import {Stack,Button,Grid,Divider} from '@mui/material/';

import { Icon } from '@iconify/react';

import { FILTER_BY } from './filter';
import { SORT_BY } from './sort';
import { SEARCH_BY } from './search';
import { TOGGLE_BY } from './toggle';

import * as Fnc from 'src/hooks/functions'

// ----------------------------------------------------------------------

export default function OnSortings({FILTER_TO,FILTER_RE,SORT_TO,SORT_RE,SEARCH_RE,TOGGLE_RE}) {

  return (
    <>
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md:12 }}>

      <Grid item  xs={6} sm={6} md={6}>

          <Stack mb={0} direction="row" alignItems="right" justifyContent="flex-start">
              
              <Button sx={{height: Fnc.isMobile() ? 30 :34}}>
                  <Icon icon="line-md:filter-twotone" width="30px" color='violet'/> &nbsp;
              </Button>

                {FILTER_TO.map((i, ndx) => (
                  <FILTER_BY key={ndx} Data={i} Returned={FILTER_RE} /> 
                ))}

          </Stack>

      </Grid>

      <Grid item  xs={6} sm={6} md={6}>
        
          <Stack mb={0} direction="row" alignItems="right" justifyContent="flex-end">

                {SORT_TO.map((i, ndx) => (
                  <SORT_BY key={ndx} Data={i} Returned={SORT_RE} /> 
                ))}

          </Stack>

      </Grid>

    </Grid>

    <Divider sx={{ borderStyle: 'dashed', m: 1 }} />


    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 8, md: 12 }}>

        <Grid item xs={7.5} sm={6} md={6}>

            <Stack mb={1} direction="row" alignItems="right" justifyContent="flex-start">

                <SEARCH_BY Returned={SEARCH_RE} />

            </Stack>

        </Grid>

        <Grid item xs={4.5} sm={6} md={6}>

            <TOGGLE_BY Returned={TOGGLE_RE} />

        </Grid>

    </Grid>

    
    
    {
    // ========================= ++ SORTING ++ =========================
    // ========================= ++ SORTING ++ =========================
    }


    </>
  );
}

import { useState } from 'react';

import { Grid,Stack,TextField, InputAdornment, IconButton,ToggleButtonGroup,ToggleButton } from '@mui/material';

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
// ----------------------------------------------------------------------
export const TOGGLE_BY = ({Returned,Showing}) => {  

    const dataView  = localStorage.getItem('slk-dataview')

      const [onview, setonView] = useState(dataView ? dataView : 'table');
      
      const onchangeView = (event, i) => {
            setonView(i);
            Returned(i)
      };


  return (
    <>
                <Stack mb={1} direction="row" alignItems="right" justifyContent="flex-end">

                    <ToggleButtonGroup value={onview} onChange={onchangeView} exclusive size="small"  >

                        {
                        Showing.includes('table') ? 
                              <ToggleButton value="table" sx={{height: Fnc.isMobile() ? 30 : 35}}>
                                    <Icon icon="fluent-mdl2:table" color='gray' width={ 22} sx={{ mr: 5 }}  />
                              </ToggleButton>
                        : null }
                        {
                        Showing.includes('list') ? 
                              <ToggleButton value="list" sx={{height: Fnc.isMobile() ? 30 : 35}}>
                                    <Icon icon="cil:list" color='gray' width={22} sx={{ mr: 5 }}  />
                              </ToggleButton>
                        : null }
                        {
                        Showing.includes('card') ? 
                              <ToggleButton value="card" sx={{height: Fnc.isMobile() ? 30 : 35}}>
                                    <Icon icon="clarity:view-cards-line" color='gray' width={22} sx={{ mr: 5 }}  />
                              </ToggleButton>
                        : null }

                    </ToggleButtonGroup>

                </Stack>

    </>
  );
}

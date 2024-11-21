import { useState,useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import * as Fnc from 'src/hooks/functions'

export const FILTER_BY = ({Data,Returned}) => {  

    const whats = Data[0][0]['what']
    const items = Data[0].map((i) => i.label);

    const [value, setValue] = useState(null);

    const SX = {
        width: Fnc.isMobile() ? 140 : 165,
       '& .MuiInputBase-input': { fontSize: Fnc.isMobile() ? 10 : 12 }, // Target input field
       '& .MuiInputLabel-root': { fontSize: Fnc.isMobile() ? 10 : 12 }, // Target label
       }

    const Changing =(i)=>{

        setValue(i); 

        const x = Data[0].find((e) => (e.label == i));
    
        if(x){
            console.log(x)
            Returned(x)
        } else {
            Returned({
                what:   whats,
            })
        }

    }


    return (
        <>
      <Autocomplete value={value} size='small'
        onChange={(e, newValue) => { Changing(newValue)}}
        options={items} getOptionLabel={(option) => option ? option : ""}
        renderInput={(params) => (

          <TextField {...params} label={whats} sx={SX} />
          
        )}
      /> 
        &nbsp;
        </>

    );
  }
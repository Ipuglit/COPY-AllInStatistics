import { useState,useEffect } from 'react';

import {    TextField,
            Autocomplete,
            Button
            } from '@mui/material/';



import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'



export const SORT_BY = ({Data,Returned}) => {  

    
    const whats = Data[0][0]['what']
    const items = Data[0].map((i) => i.label);


    const [value, setValue]                 = useState(null);
    const [selected, setSelected]           = useState([]);
    const [arrange, setArrange]             = useState('DESC');

    const SX = {
        width: Fnc.isMobile() ? 150 : 165,
       '& .MuiInputBase-input': { fontSize: Fnc.isMobile() ? 10 : 12 }, // Target input field
       '& .MuiInputLabel-root': { fontSize: Fnc.isMobile() ? 10 : 12 }, // Target label
       }

    const Changing =(i)=>{

        if(i == 'ASC' || i == 'DESC'){

            if(i == 'ASC'){
                setArrange('DESC')
            } else {
                setArrange('ASC')
            }
    
            Returned({
                arrange: arrange,
                by: { x: selected }
            })

        } else {
            setValue(i); 

            const x = Data[0].find((e) => (e.label == i));

            if(x){
                Returned({
                            arrange: arrange == 'ASC' ? 'DESC' : 'ASC',
                            by: { x: x }
                        })
                setSelected(x)
            } else {
                setSelected({ what:   whats, idd:    "NONE", })
                Returned({
                            arrange: arrange == 'ASC' ? 'DESC' : 'ASC',
                            by: { what:   whats, idd:    "NONE", }
                        })
            }

        }


    


    }





    return (
        <>

                { arrange == 'ASC' ? 
                <Button onClick={()=>Changing('ASC')} sx={{height: Fnc.isMobile() ? 30 : 35}}>
                    <Icon icon="iconamoon:arrow-down-6-circle-duotone" width="23px" color='violet'/>
                </Button>
                :
                <Button onClick={()=>Changing('DESC')} sx={{height: Fnc.isMobile() ? 30 : 35}}>
                    <Icon icon="iconamoon:arrow-up-6-circle-duotone" width="23px" color='violet'/>
                </Button>
                }
            
            
            <Autocomplete value={value} size='small'
                onChange={(e, newValue) => { Changing(newValue)}}
                options={items} getOptionLabel={(option) => option ? option : ""}
                renderInput={(params) => (

                <TextField {...params} label={"SORT BY "} sx={SX}/>
                
                )}
            /> 

        </>

    );
  }
import { useState, useEffect } from 'react';
import {
    List,
    ListItem ,
    ListItemAvatar,
    ListItemText,
    Button ,
  Paper,
  InputBase,
  IconButton,
  TablePagination,
  TextField,
  Divider,
  InputAdornment,
  Avatar,
  Chip
} from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

import { OnNothing, OnLoading, OnEdit } from 'src/items/menu/'

import { Icon } from '@iconify/react';

export default function ViaList({DATA, SEARCH, RETURN, REFRESH}) {

  const itemx = DATA.data ? DATA.data : []

  const [onData, setonData]     = useState(itemx);

  // ====================== * ___ * ======================

  useEffect(() => {

    const searching = String(SEARCH).toLowerCase()
    const filteredFinal = itemx.filter(i =>   
                                        Object.values(i).some(e =>
                                          String(e).toLowerCase().includes(searching)
                                        )
                                      );
    setonData(filteredFinal)

  }, [SEARCH,DATA]);

    if( DATA.load && DATA.tally > 0){
        return (
          <List style={{paddingRight:'50px',paddingLeft:'50px', width:'100%'}}>
  
      {onData.map((i) => (
        <ListItem key={i.id} >
          <ListItemAvatar>
            <Avatar src={Fnc.ifImage(i.appImageFull,'/images/applications/default.jpg')} alt={i.name} />
          </ListItemAvatar>
          <ListItemText>
            <p>{i.appName}</p>

            <Chip icon={<Icon icon={i.appStatusLabel == 'Active' ? "mdi:check-circle" : i.appStatusLabel == 'Pending' ? "mdi:clock-outline" : "mdi:close-circle"}/>} 
                                    label={i.appStatusLabel}
                                    variant={'contained'} 
                                    size='small'
                                    sx={{marginTop:'-18px'}}
                                    color={i.appStatusLabel == 'Active' ? "success" : i.appStatusLabel == 'Pending' ? "warning" : "error" } />
            <br />

            <span style={{fontSize:'12px', color:'gray'}}>
                {i.count_accounts == 0 ? 'No account' : i.count_accounts == 1 ? '1 account' : i.count_accounts+' accounts' }, &nbsp;
            </span>


            <span style={{fontSize:'12px', color:'gray', marginTop:'-10px'}}>
                {i.count_clubs == 0 ? 'No clubs' : i.count_clubs == 1 ? '1 club' : i.count_clubs+' clubs' }, &nbsp;
            </span>

            <br/>

            <span style={{fontSize:'12px', color:'gray'}}>
                {i.recorded_last ? 'Latest Record: '+i.recorded_last : 'No records found'}
            </span>
            
          </ListItemText>

          <Button sx={{ mt: 0, color: 'text.disabled', }} 
                            edge="end" aria-label="edit"
                            endIcon={<Icon icon="eva:arrow-ios-forward-fill" color='purple' />}
                            onClick={()=>RETURN({...i,modal:'Open'})} >
                        <span style={{color: "violet"}}> View </span>
            </Button>

        </ListItem>
      ))}


          </List>
        );

    } else if( DATA.tally == 0 && DATA.load ){
    
        return  <>
                  <OnNothing LABEL='No players deals found...' /> 
                </>;
    
    } else {
        
        return  <>
                  <OnLoading TYPE='table' />
                </>;
    
    }
}
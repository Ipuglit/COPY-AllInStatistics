import { useState, useEffect } from 'react';
import {
  Avatar,
  Card, 
  CardHeader,
  Tooltip,
  Chip
} from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'
import * as Fn from '../functions/dialogs'

import { Icon } from '@iconify/react';

import { OnLoading, OnNothing } from 'src/items/menu'

export default function ViaList_DealClubs({DATA, RETURN, SEARCH}) {

  const items = DATA.data ? DATA.data : []


  const [onData, setonData]         = useState(items);
  const [onSelect, setonSelect]     = useState('');
  const [onCount, setonCount]       = useState(0);

  const handleSelect = (i,ndx) => {

        if(onSelect == ndx){
            setonSelect('')
            RETURN('')
        } else {
            setonSelect(ndx)
            RETURN(i)
        }

  };

  // ====================== * ___ * ======================

    useEffect(() => {

        if(Fn.isNull(SEARCH)){
            setonData(items)
            setonCount(items.length)
        } else {
            const searching = String(SEARCH).toLowerCase()
            const filtered = items.filter(i => i.appName.toLowerCase().includes(searching) || i.clubID.toLowerCase().includes(searching) || i.clubName.toLowerCase().includes(searching) );
            setonData(filtered)
            setonCount(filtered.length)
        }

    }, [items,SEARCH]);

    if( DATA.load && DATA.tally > 0 && onCount > 0){
        return (
          <>
            {onData.map((i, index) => (

                    <Card   key={index} 
                            onClick={()=>handleSelect(i,i.id)}
                            size='small' 
                            sx={onSelect == i.id 
                                    ? 
                                    {
                                        marginTop:'6px', 
                                        backgroundColor:'mediumpurple',
                                        transform: 'scale(1.05)'
                                    }
                                :
                                    {
                                        marginTop:'6px', 
                                        transition: '0.2s', 
                                        '&:hover': { boxShadow: '10px 10px 20px rgba(0,0,0,0.5)', transform: 'scale(1.04)', }
                                    }
                                }>
                        <CardHeader
                            sx={{marginTop:'-22px', marginBottom:'-7px', marginLeft:'-10px'}}
                            avatar={
                                    <Avatar aria-label="image" src={Fn.byImage(i.clubImage,'/images/clubs/defaults.png')} />
                                    }
                            title=  {
                                      <Tooltip title={i.statusLabel} placement="top-start">
                                            <b style={{fontSize:'12px', marginTop:'2px', color: i.statusLabel == 'Active' ? '' : 'red'}}>
                                                {i.clubName}
                                            </b>
                                      </Tooltip>
                                    }
                            subheader=  {
                                        <>
                                        <p style={{fontSize:'12px',marginTop:'-2px'}}>ID: {i.clubID}</p>
                                        <p style={{fontSize:'12px',marginTop:'-18px'}}>{i.appName}</p>
                                        </>
                                        }
                        />
                    </Card>

            ))}
          </>
        );

      } else if( onCount == 0 && DATA.load ){

        return  <OnNothing LABEL='Club not found...' />
    
      } else {
    
        return <OnLoading TYPE='list' />
    
      }
}
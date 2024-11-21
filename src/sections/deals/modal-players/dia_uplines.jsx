// DialogComponent.js
import React, {useEffect, useState} from 'react';
import {
        Grid,
        Autocomplete,
        TextField,
        DialogContent,
        DialogContentText,
        DialogActions,
        Button,
        Box,
        InputAdornment,
        Divider,
        Chip
    } from '@mui/material';


    import * as Fn from '../functions/dialogs'
    import * as Fnc from 'src/hooks/functions'
    import * as Cs from 'src/hooks/classes'

import { Icon } from '@iconify/react';

import OnMobileScreen from 'src/items/screen/resize';

export default function Uplines({ onClose, onData, onAccounts, onClubs, onReturn }) {

    const itemx = onData
    const OnMobile= OnMobileScreen();

    const NEW = itemx.what == 'NEW' ? true : false

    const [upline, setUpline]       = useState(null);
    const [club, setClub]           = useState(null);
    const [deals, setDeals]          = useState(null);

    const [newAppID, setnewAppID]           = useState(0);

    const [onSwitch, setonSwitch]           = useState('rake');

    const Zero = {id: 0, value: 0, label: '0', description:''}

    const seeACCOUNTS = onAccounts.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    idd:                  itemx.id,
                                                                    value:                e.accountID, 
                                                                    label:                e.accountID, 
                                                                    description:          e.accountNickname, 
                                                                    appID:                e.appID,
                                                                    uplineID:             e.accountID,
                                                                    uplineNick:           e.accountNickname,
                                                                    uplineUserNick:       e.userNickname ? e.userNickname : '',
                                                                    uplineUserName:       e.userFirstname ? e.userFirstname+' '+e.userLastname : ''  
                                                                  } 
                                                      } 
                                        )
    
    const seeCLUBS = onClubs.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    idd:                  itemx.id,
                                                                    value:                e.clubID, 
                                                                    label:                e.clubName, 
                                                                    description:          e.clubID, 
                                                                    appID:                e.appID,
                                                                    appName:              e.appName,
                                                                    clubID:               e.clubID,
                                                                    clubName:             e.clubName,
                                                                  } 
                                                      } 
                                        )
    const newACCOUNTS   = seeACCOUNTS.filter((e)=> itemx.appID == e.appID)
    const addACCOUNTS   = seeACCOUNTS.filter((e)=> e.appID == newAppID ? newAppID : 0) 

    const Ndx_upline    = seeACCOUNTS.filter((e)=> e.value == itemx.uplineID )
    const Ndx_club      = seeCLUBS.filter((e)=> e.value == itemx.clubID )

    const handleChanged = (i,ii) => {

        if(ii == 'club'){

          setClub(i)
          setnewAppID(i.appID)

          if(upline && upline.appID != i.appID){
            setUpline(null)
          }

        } else if( ii == 'upline' ){
          setUpline(i)

       }
        
    };

    const handleInput = (i,ii,it) => {

        if(it == 'text'){

            setDeals({...deals, [ii]: i})

        } else if( it == 'decimal' ){

            setDeals({...deals, [ii]: Fn.numDecimal(i)})

        } else if( it == 'percent' ){

            setDeals({...deals, [ii]: Fn.numHundred(i)})

        }

    };

    const onSubmit =(i)=>{

      const newArr = {
        clubID:       club.clubID,
        uplineID:     upline.uplineID,
        rakeback:     deals.rakeback,
        rebate:       deals.rebate,
        status:       0,
        action:       'upsert',
        id:           itemx.id ? itemx.id : 0,
      }

      onReturn({...newArr, what: 'dealuplines'})

    }

    const isValid = () => {

        if(club && upline && deals){
          const isChecked = itemx.clubID == club.clubID 
                            && itemx.uplineID == upline.uplineID 
                            && itemx.rakeback == deals.rakeback 
                            ?  false  :  true
          return isChecked
        } else {
          return false
        }

      }

    useEffect(() => {

      setUpline(Ndx_upline[0] ? Ndx_upline[0] : null)
      setClub(Ndx_club[0] ? Ndx_club[0] : null)

      setDeals({    
                    clubID:                 itemx.clubID ? itemx.clubID : 0,
                    uplineID:               itemx.uplineID ? itemx.uplineID : 0,
                    rakeback:               itemx.rakeback ? itemx.rakeback : 0,
                    rebate:                 itemx.rebate ? itemx.rebate : 0,
                })

    }, [onData]);

  return (
    <>
        
        <DialogContent>

          <DialogContentText component="section">

        <Grid container  padding={{ xs: 1, sm: 2, md: 3 }} spacing={{ xs: 2, sm: 2, md: 2 }}>

            <Grid item xs={12} sm={12} md={12}>
            <Autocomplete
                value={club}
                size='small'
                onChange={(event, newValue)=>handleChanged(newValue,'club')}
                options={seeCLUBS}
                getOptionLabel={(option) => option.label ? option.label : ''}
                isOptionEqualToValue={(option, value) => value.clubID === club.clubID}
                filterOptions={Fn.filterOptions}
                renderOption={(props, option) => (
                  <React.Fragment key={option.id}>
                    <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
                    <span style={{ fontSize: '11px', color: 'gray', paddingLeft:'16px'}}>ID: {option.clubID}</span>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Fn.isNull(club) ? true : false}
                    label={ club ? ( club.clubID ? club.appName+' Club ID: '+club.clubID : 'No club' ) : "Select a club"}
                    variant="outlined"
                    fullWidth
                    sx={{ '& .MuiInputBase-input': { fontSize: OnMobile ? '11px' : '', }, '& .MuiInputLabel-root': { fontSize: OnMobile ? '12px' : '',   }, }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12}>

                <Autocomplete
                    value={upline}
                    size='small'
                    onChange={(event, newValue)=>handleChanged(newValue,'upline')}
                    options={ Fn.isNull(newAppID,0) ? newACCOUNTS : addACCOUNTS}
                    getOptionLabel={(option) => option.label ? option.label : ''}
                    isOptionEqualToValue={(option, value) => value.value === upline.uplineID}
                    filterOptions={Fn.filterOptions}
                    renderOption={(props, option) => (
                    <React.Fragment key={option.id}>
                        <span {...props} style={{ fontSize: '12px'}}>ID: {option.label}</span>
                        <span style={{ fontSize: '11px', color: 'gray', paddingLeft:'16px'}}>{option.description}</span>
                        {
                        option.playerUserName ? 
                        <span style={{ color: 'grey', fontSize: '0.70em'}}> ({option.playerUserName})</span>
                        : 
                        option.uplineUserNick ? 
                        <span style={{ color: 'grey', fontSize: '0.70em'}}> ({option.uplineUserNick})</span>
                        : 
                        null
                        }
                    </React.Fragment>
                    )}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        error={Fn.isNull(upline) ? true : false}
                        label={ 
                            upline 
                            ? 
                            ( upline.userName ? 'Upline: '+upline.userName : upline.uplineUserNick ? 'Upline: '+upline.uplineUserNick : upline.uplineNick ? 'Upline: '+upline.uplineNick : 'No upline user' ) 
                            : 
                            "Select a upline"
                        }
                        variant="outlined"
                        fullWidth
                        sx={{ '& .MuiInputBase-input': { fontSize: OnMobile ? '11px' : '', }, '& .MuiInputLabel-root': { fontSize: OnMobile ? '12px' : '',   }, }}
                    />
                    )}
                />

            </Grid>
            
            <Grid item xs={12} sm={12} md={12}>
                <Divider style={{marginBottom:'1px'}}/>
            </Grid>

            <Grid item xs={6} sm={6} md={6}>

            <TextField  sx={Cs.TextCenter}
                        size='small'
                        error={deals ? ( Fn.isNull(deals.rakeback,0) ) : true}
                        label={"Rakeback"}
                        value={deals ? Fn.numCheck(deals.rakeback) : 0}
                        fullWidth
                        onChange={(e)=>handleInput(e.currentTarget.value,'rakeback','percent')}
                        InputProps={{  ...Cs.IconPercent, sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                        InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                        />

            </Grid>

            <Grid item xs={6} sm={6} md={6}>

            <TextField  sx={Cs.TextCenter}
                        size='small'
                        label={"Rebate"}
                        value={deals ? Fn.numCheck(deals.rebate) : 0}
                        fullWidth
                        onChange={(e)=>handleInput(e.currentTarget.value,'rebate','percent')}
                        InputProps={{  ...Cs.IconPercent, sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                        InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                        />

            </Grid>


        </Grid>




            {
              //<pre>{JSON.stringify(onData,null,2)}</pre>
            }
            
          </DialogContentText>

        </DialogContent>
           
        <DialogActions style={{paddingBottom:'30px',paddingRight:'30px',display: 'flex', justifyContent: 'center'}}>

            {
              !isValid()
              ?
              null
              :
              <Button sx={{...Cs.buttonClass('contained','violet'), width:'50%',borderRadius:'0',}} variant='contained' onClick={()=>onSubmit()}>SUBMIT</Button>
            }

            <Button variant='outlined' onClick={onClose} sx={{borderRadius:'0',width:'50%'}}>CANCEL</Button>

        </DialogActions>

    </>
  );
  
}
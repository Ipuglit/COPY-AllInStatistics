// DialogComponent.js
import React, {useEffect, useState} from 'react';
import {FormControlLabel,Checkbox,Autocomplete,TextField,DialogContent,DialogContentText,DialogActions,Button,Box} from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

import { Icon } from '@iconify/react';

export default function Account({ onClose, onData, onItems, onReturn }) {

    const onMobile    = Fnc.OnMobile()

    const itemx       = onData?.data
    const listDDown   = onItems?.ACCOUNTS

    const seeACCOUNTS = listDDown?.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    idd:                  itemx.id,
                                                                    value:                e.accountID, 
                                                                    label:                e.accountID, 
                                                                    description:          e.accountNickname, 
                                                                    appID:                e.appID,
                                                                    accountID:            e.accountID,
                                                                    accountNick:          e.accountNickname,
                                                                    accountUserID:        e.userID,
                                                                    accountUserNick:      e.userNickname ? e.userNickname : '',
                                                                    accountUserName:      e.userFirstname ? e.userFirstname+' '+e.userLastname : ''  
                                                                  } 
                                                      } 
                                        )
    const gotAPP =(app,id)=> { 
                              return app > 0 && !Fnc.isNull(id) ? id : '0' 
                            }

    const newListPlayers  = seeACCOUNTS.filter((e)=> e.value != gotAPP(itemx.UPLINEAPPID,itemx.UPLINEID) && e.value != gotAPP(itemx.AGENCYAPPID,itemx.AGENCYID) && e.value != gotAPP(itemx.DOWNLINEAPPID,itemx.DOWNLINEID) && itemx.APPID == e.appID && !Fnc.isNull(e?.value))
    const newListUplines  = seeACCOUNTS.filter((e)=> e.value != gotAPP(itemx.PLAYERAPPID,itemx.PLAYERID) && e.value != gotAPP(itemx.AGENCYAPPID,itemx.AGENCYID) && e.value != gotAPP(itemx.DOWNLINEAPPID,itemx.DOWNLINEID) && itemx.APPID == e.appID && !Fnc.isNull(e?.value))   
    const newListAgency   = seeACCOUNTS.filter((e)=> e.value != gotAPP(itemx.UPLINEAPPID,itemx.UPLINEID) && e.value != gotAPP(itemx.PLAYERAPPID,itemx.PLAYERID) && e.value != gotAPP(itemx.DOWNLINEAPPID,itemx.DOWNLINEID) && itemx.APPID == e.appID && !Fnc.isNull(e?.value))   
    const newListDownline = seeACCOUNTS.filter((e)=> e.value != gotAPP(itemx.UPLINEAPPID,itemx.UPLINEID) && e.value != gotAPP(itemx.AGENCYAPPID,itemx.AGENCYID) && e.value != gotAPP(itemx.PLAYERAPPID,itemx.PLAYERID) && itemx.APPID == e.appID && !Fnc.isNull(e?.value))   

    const newACCOUNTS = onData.name == 'PLAYER' ? newListPlayers : onData.name == 'UPLINE' ? newListUplines : onData.name == 'AGENCY' ? newListAgency : newListDownline

    const whatACCOUNT = onData.name == 'PLAYER' ? itemx.PLAYERID : onData.name == 'UPLINE' ? itemx.UPLINEID : onData.name == 'AGENCY' ? itemx.AGENCYID : itemx.DOWNLINEID

    const Ndx = newACCOUNTS.filter((e)=> e.value == itemx[onData.name+'ID']  )

    const [value, setValue]               = useState(null);
    const [changed, setChanged]           = useState(false);
    const [checkClub, setcheckClub]       = useState(false);
    const [checkPlayer, setcheckPlayer]   = useState(false);
    const [checkAccount, setcheckAccount] = useState(false);

    const handleChanged = (event, newValue) => {
      setValue(newValue);
      setChanged(newValue && newValue.accountID == itemx.accountID ? false : true)
    };
    

    const onSubmit =(i)=>{
      onReturn({
                ...value, 
                row:            itemx.ROW, 
                what:           onData.name, 
                applyClub:      checkClub, 
                applyPlayer:    checkPlayer,
                applyAccount:   checkAccount,
                subAppID:       itemx?.APPID,
                subClub:        itemx?.CLUBID,
                subPlayer:      itemx?.PLAYERID,
                subAccount:     itemx?.[onData?.name+'ID'],
              })
    }

    useEffect(() => {
      setValue(Ndx[0] ? Ndx[0] : null)
    }, [onData]);

  return (
    <>
        
        <DialogContent>

          <DialogContentText component="section">

            <Box component="section" sx={{ p: 1, border: '1px dashed grey', fontSize: onMobile ? '11px' : '12px' }}>
              {
                !Fnc.isNull(itemx.APPID,0)
                ?
                <>
                <p style={{marginTop:'-2px',color:'gray'}} >{itemx.APPNAME}</p>
                <p style={{marginTop:'-15px'}}>{itemx.CLUBNAME}</p>
                </>
                :
                <p style={{marginTop:'-2px',color:'orange'}} >Please select a club!</p>
              }


              <p style={{marginTop:'-5px', marginBottom:'-2px' }}>
              {itemx[onData.name+'RAKE']}%  {Fnc.wordCapital(onData.name)} Rakeback &nbsp;
                <i style={{fontSize:'10px',color:'gray'}}>(Click DEALS to change)</i>
              </p>
              {
             //JSON.stringify(itemx,null,2)
              }
            </Box>

            <Autocomplete
                value={value}
                onChange={handleChanged}
                options={newACCOUNTS}
                disableClearable
                style={{marginTop:'35px'}}
                getOptionLabel={(option) => option.label ? option.label : ''}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                filterOptions={Fnc.filterOptions}
                renderOption={(props, option) => (
                  <React.Fragment key={option.id}>
                          <span {...props} style={{ fontSize: '12px'}}>ID: {option.label}</span>
                          <span style={{ fontSize: '11px', color: 'gray', paddingLeft:'16px'}}>{option.description}</span>
                    {
                      option.accountUserName ? 
                      <span style={{ color: 'grey', fontSize: '0.70em'}}> ({option.accountUserName})</span>
                      : 
                      option.accountUserNickname ? 
                      <span style={{ color: 'grey', fontSize: '0.70em'}}> ({option.accountUserNickname})</span>
                      : 
                      null
                    }
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={ value ? ( value.accountUserName ? value.accountUserName : 'No '+onData.name.toLowerCase()+' user' ) : Fnc.isNull(itemx.APPID,0) ? 'Cannot select without a club' : "Select "+onData.name.toLowerCase()}
                    variant="outlined" 
                    fullWidth
                    sx={{ 
                      '& .MuiInputBase-input': { fontSize: onMobile ? '11px' : '', }, 
                      '& .MuiInputLabel-root': { fontSize: onMobile ? '12px' : '',   }, 
                    }}
                  />
                )}
              />

          {
            itemx?.[onData?.name+'ID'] != value?.value  &&
          <FormControlLabel
            control={
              <Checkbox
                size='small'
                checked={checkAccount}
                onChange={(e)=>setcheckAccount(e.target.checked)}
                name="acceptTerms"
                sx={{ '&.Mui-checked': { color: checkAccount ? 'violet' : '' } }}
              />
            }
            label={
                  <span style={{fontSize: onMobile ? '10px' : '12px', color:checkAccount ? 'violet' : ''}}>
                    Apply to all {whatACCOUNT ?<>{onData.name.toLowerCase()} ID: '{whatACCOUNT}'</> : 'blank '+onData.name.toLowerCase() }
                  </span>
                  }
          />
          }

          
          
          {
            !Fnc.isNull(itemx?.PLAYERID,0) && onData?.name != 'PLAYER' &&
            <>
            <br/>
            <FormControlLabel
            sx={{marginTop:'-10px'}}
              control={
                <Checkbox
                  size='small'
                  checked={checkPlayer}
                  onChange={(e)=>setcheckPlayer(e.target.checked)}
                  name="acceptTerms"
                  sx={{ '&.Mui-checked': { color: checkPlayer ? 'violet' : '' } }}
                />
              }
              label={<span style={{fontSize: onMobile ? '10px' : '12px', color:checkPlayer ? 'violet' : ''}}>Apply to all player ID: '{itemx?.PLAYERID}'</span>}
            />
            </>

          }
          {
            !Fnc.isNull(itemx?.CLUBID,0) &&
            <>
          <br/>
          <FormControlLabel
          sx={{marginTop:'-10px'}}
            control={
              <Checkbox
                size='small'
                checked={checkClub}
                onChange={(e)=>setcheckClub(e.target.checked)}
                name="acceptTerms"
                sx={{ '&.Mui-checked': { color: checkClub ? 'violet' : '' } }}
              />
            }
            label={<span style={{fontSize: onMobile ? '10px' : '12px', color:checkClub ? 'violet' : ''}}>Apply to all club '{itemx?.CLUBNAME}'</span>}
          />
            </>
          }

            
          </DialogContentText>

        </DialogContent>

        <DialogActions style={{paddingBottom:'30px',padding:'30px',display: 'flex', justifyContent: 'center', marginTop:'-30px'}}>

            {
              Fnc.isNull(value) || value?.accountID == itemx[onData.name+'ID'] && !checkClub && !checkPlayer
              ?
              null
              :
              <Button sx={{...Cs.buttonClass('contained','violet'), width:'50%',borderRadius:'0',fontSize: onMobile ? '11px' : '' }} variant='contained' onClick={()=>onSubmit()}>SUBMIT</Button>
            }

            <Button variant='standard' onClick={onClose} sx={{borderRadius:'0',width:'50%',fontSize: onMobile ? '11px' : ''}}>CANCEL</Button>

        </DialogActions>

    </>
  );
  
}
// DialogComponent.js
import React, {useEffect, useState} from 'react';
import {InputAdornment,Autocomplete,TextField,DialogContent,DialogContentText,DialogActions,Button,Box, Divider} from '@mui/material';

import * as Fn from '../functions/dialogs'
import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

import { Icon } from '@iconify/react';

export default function FormulaPlayers({ onClose, onData, onClubs, onAccounts, onFormula, onReturn }) {

    const itemx = onData
    const onMobile = Fnc.OnMobile()
    const [valAgencyAction, setvalAgencyAction]   = useState(null);
    const [valAgencyBonus, setvalAgencyBonus]     = useState(null);
    const [valPlayerResult, setvalPlayerResult]   = useState(null);
    const [club, setClub]                         = useState(null);
    const [player, setPlayer]                     = useState(null);
    const [remarks, setRemarks]                   = useState('');

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

    const seeACCOUNTS = onAccounts.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    idd:                  itemx.id,
                                                                    value:                e.accountID, 
                                                                    label:                e.accountID, 
                                                                    description:          e.accountNickname, 
                                                                    playerApp:            e.appID,
                                                                    playerID:             e.accountID,
                                                                    playerNick:           e.accountNickname,
                                                                    playerUserID:         e.userID,
                                                                    playerUserNick:       e.userNickname ? e.userNickname : '',
                                                                    playerUserName:       e.userFirstname ? e.userFirstname+' '+e.userLastname : ''  
                                                                  } 
                                                      } 
                                        )

    const seeFORMULA = onFormula.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    value:                e.id, 
                                                                    label:                e.name, 
                                                                    description:          e.formula, 
                                                                    type:                 e.type,
                                                                    formula:              e.formula, 
                                                                    note:                 e.note,
                                                                    name:                 e.name,
                                                                  } 
                                                      } 
                                        )



    const newACCOUNTS = seeACCOUNTS.filter((e)=> club ? club.appID  == e.playerApp : itemx.appID == e.playerApp)                       
    
    const ValueClub           = seeCLUBS.filter((e)=> e.value == itemx.clubID )
    const ValuePlayer         = newACCOUNTS.filter((e)=> e.value == itemx.playerID )

    const ValueAgencyAction   = seeFORMULA.filter((e)=> e.id == itemx.agency_action_ID )
    const ValueAgencyBonus    = seeFORMULA.filter((e)=> e.id == itemx.agency_bonus_ID )
    const ValuePlayerResult   = seeFORMULA.filter((e)=> e.id == itemx.player_result_ID )

    const AgencyAction  = seeFORMULA.filter((e)=> e.type == 'AGENCY ACTION' )
    const AgencyBonus   = seeFORMULA.filter((e)=> e.type == 'AGENCY BONUS' )
    const PlayerResult  = seeFORMULA.filter((e)=> e.type == 'PLAYER RESULT' )

    const handleChanged = (i,e) => {

      if(i == null){
        e(null);
      } else {
        if(e == setClub){
          const up = player && i.appID == player.playerApp ? player : null
          setPlayer(up)
          e(i)
        } else {
          e(i);
        }
      }

    };

    const isValid = () => {

      if( player && valAgencyAction && valAgencyBonus && valPlayerResult && club ){

        if(     itemx.playerID == player.playerID 
            &&  itemx.clubID == club.clubID
            &&  itemx.agency_action_ID == ValueAgencyAction[0]?.id
            &&  itemx.agency_bonus_ID == ValueAgencyBonus[0]?.id
            &&  itemx.player_result_ID == ValuePlayerResult[0]?.id
            &&  itemx.remarks == remarks){
          return false
        } else {
          return true
        }

      } else {
        return false
      }

    }

    const onSubmit =(i)=>{

        const newArr = {
                          id:               itemx ? itemx.id : null,
                          playerID:         player.playerID,
                          clubID:           club.clubID,
                          agency_action:    valAgencyAction.id,
                          agency_bonus:     valAgencyBonus.id,
                          player_result:    valPlayerResult.id,
                          remarks:          remarks ? remarks : '',
                          status:           0,
                          action:           'upsert',
                        }

        onReturn({...newArr, what: 'dealformula'})

    }

    useEffect(() => {
      setRemarks(itemx.remarks)
      setClub(ValueClub[0] ? ValueClub[0] : null)
      setPlayer(ValuePlayer[0] ? ValuePlayer[0] : null)
      setvalAgencyAction(ValueAgencyAction[0] ? ValueAgencyAction[0] : null)
      setvalAgencyBonus(ValueAgencyBonus[0] ? ValueAgencyBonus[0] : null)
      setvalPlayerResult(ValuePlayerResult[0] ? ValuePlayerResult[0] : null)
    }, [onData]);

  return (
    <>
        
        <DialogContent>

          <DialogContentText component="section">


            <br/>
            <Autocomplete
                        value={club}
                        size='small'
                        onChange={(event, newValue)=> handleChanged(newValue,setClub)}
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
                            label={ club ? ( club.clubID ? club.appName+': Club ID '+club.clubID : 'No club' ) : "Select a club"}
                            variant="outlined"
                            fullWidth
                            sx={{ '& .MuiInputBase-input': { fontSize: onMobile ? '11px' : '', }, '& .MuiInputLabel-root': { fontSize: onMobile ? '12px' : '',   }, }}
                          />
                        )}
                      />
                      
            <br/>

            <Autocomplete
                value={player} size='small'
                onChange={(event, newValue) =>handleChanged(newValue,setPlayer)}
                options={newACCOUNTS}
                getOptionLabel={(option) => option.label ? option.label : ''}
                isOptionEqualToValue={(option, player) => option.id === player?.id}
                filterOptions={Fn.filterOptions}
                renderOption={(props, option) => (
                  <React.Fragment key={option.id}>
                      <span {...props} style={{ fontSize: '12px'}}>ID: {option.label}</span>
                      <span style={{ fontSize: '11px', color: 'gray', paddingLeft:'16px'}}>{option.description}</span>
                    {
                      option.playerUserName ? 
                      <span style={{ color: 'grey', fontSize: '12px'}}> ({option.playerUserName})</span>
                      : 
                      option.playerUserNickname ? 
                      <span style={{ color: 'grey', fontSize: '0.12px'}}> ({option.playerUserNickname})</span>
                      : 
                      null
                    }

                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Fn.isNull(player) ? true : false}
                    label={ player ? ( player.playerUserName ? player.playerUserName : 'No player user' ) : "Select an player"}
                    variant="outlined"
                    fullWidth
                    sx={{ '& .MuiInputBase-input': { fontSize: onMobile ? '11px' : '', }, '& .MuiInputLabel-root': { fontSize: onMobile ? '12px' : '',   }, }}
                  />
                )}
              />
            <Divider style={{marginTop:'15px',marginBottom:'15px'}}/>

            <Autocomplete
                value={valAgencyAction} size='small'
                onChange={(event, newValue) =>handleChanged(newValue,setvalAgencyAction)}
                options={AgencyAction}
                getOptionLabel={(option) => option.name ? option.name : ''}
                isOptionEqualToValue={(option, value) => option.id === valAgencyAction.id}
                filterOptions={Fn.filterOptions}
                renderOption={(props, option) => (
                  <React.Fragment key={option.id}>
                      <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
                      <span style={{ fontSize: '11px', color: 'gray', paddingLeft:'16px'}}>{option.description}</span>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Fn.isNull(valAgencyAction) ? true : false}
                    label={ 'Agency Action Formula'}
                    variant="outlined"
                    fullWidth
                    sx={{ '& .MuiInputBase-input': { fontSize: onMobile ? '11px' : '', }, '& .MuiInputLabel-root': { fontSize: onMobile ? '12px' : '',   }, }}
                  />
                )}
              />
            <br/>
            <Autocomplete
                value={valAgencyBonus} size='small'
                onChange={(event, newValue) =>handleChanged(newValue,setvalAgencyBonus)}
                options={AgencyBonus}
                getOptionLabel={(option) => option.name ? option.name : ''}
                isOptionEqualToValue={(option, value) => option.id === valAgencyBonus.id}
                filterOptions={Fn.filterOptions}
                renderOption={(props, option) => (
                  <React.Fragment key={option.id}>
                      <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
                      <span style={{ fontSize: '11px', color: 'gray', paddingLeft:'16px'}}>{option.description}</span>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Fn.isNull(valAgencyBonus) ? true : false}
                    label={ 'Agency Bonus Formula'}
                    variant="outlined"
                    fullWidth
                    sx={{ '& .MuiInputBase-input': { fontSize: onMobile ? '11px' : '', }, '& .MuiInputLabel-root': { fontSize: onMobile ? '12px' : '',   }, }}
                  />
                )}
              />
            <br/>
            <Autocomplete
                value={valPlayerResult} size='small'
                onChange={(event, newValue) =>handleChanged(newValue,setvalPlayerResult)}
                options={PlayerResult}
                getOptionLabel={(option) => option.name ? option.name : ''}
                isOptionEqualToValue={(option, value) => option.id === valPlayerResult.id}
                filterOptions={Fn.filterOptions}
                renderOption={(props, option) => (
                  <React.Fragment key={option.id}>
                      <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
                      <span style={{ fontSize: '11px', color: 'gray', paddingLeft:'16px'}}>{option.description}</span>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Fn.isNull(valPlayerResult) ? true : false}
                    label={ 'Player Result Formula'}
                    variant="outlined"
                    fullWidth
                    sx={{ '& .MuiInputBase-input': { fontSize: onMobile ? '11px' : '', }, '& .MuiInputLabel-root': { fontSize: onMobile ? '12px' : '',   }, }}
                  />
                )}
              />
              <br/>
              <TextField  size='small'
                          label={"Remarks..."}
                          value={remarks ? remarks : ''}
                          fullWidth
                          onChange={(e)=>setRemarks( Fnc.textSanitize(e.currentTarget.value) )}
                          InputProps={{  ...Cs.IconPercent, sx: { fontSize: onMobile ? '12px' : '',  }, }}
                          InputLabelProps={{  sx: { fontSize: onMobile ? '11px' : '',  }, }}
                          />

            {
            // <pre>{JSON.stringify(itemx,null,2)}</pre>
            }
            
          </DialogContentText>

        </DialogContent>

        <DialogActions style={{paddingBottom:'30px',paddingRight:'30px',display: 'flex', justifyContent: 'center'}}>

            {
              !isValid()
              ?
              null
              :
            <Button sx={{...Cs.buttonClass('contained','violet'), width:'50%',borderRadius:'0',fontSize: onMobile ? '11px' : ''}} variant='contained' onClick={()=>onSubmit()}>SUBMIT</Button>
            }

            <Button variant='outlined' onClick={onClose} sx={{borderRadius:'0',width:'50%',fontSize: onMobile ? '11px' : ''}}>CANCEL</Button>
        </DialogActions>

    </>
  );
  
}
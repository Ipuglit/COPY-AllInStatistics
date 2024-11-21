// DialogComponent.js
import React, {useEffect, useState} from 'react';
import {InputAdornment,Autocomplete,TextField,DialogContent,DialogContentText,DialogActions,Button,Box,Grid,Divider,Chip} from '@mui/material';

import * as Fn from '../functions/dialogs'
import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

import { Icon } from '@iconify/react';

import OnMobileScreen from 'src/items/screen/resize';

export default function Players({ onClose, onData, onClubs, onAccounts, onFormula, onUpDeals, onReturn, onFormulaDeal }) {

    const itemx = onData
    const OnMobile= OnMobileScreen();

    const NEW = itemx.what == 'NEW' ? true : false

    const [player, setPlayer]       = useState(null);
    const [agency, setAgency]       = useState(null);
    const [downline, setDownline]   = useState(null);
    const [upline, setUpline]       = useState(null);
    const [club, setClub]           = useState(null);


    const [agency_action, setAgency_action]           = useState(null);
    const [agency_bonus, setAgency_bonus]             = useState(null);
    const [player_result, setPlayer_result]           = useState(null);

    const [newAppID, setnewAppID]           = useState(0);

    const [deals, setDeals]         = useState({
                                                  rakeback:               itemx.rakeback ? itemx.rakeback : 0,
                                                  rebate:                 itemx.rebate ? itemx.rebate : 0,
                                                  chiprate:               itemx.chiprate ? itemx.chiprate : 0,
                                                  currency:               itemx.currency ? itemx.currency : 'USD',
                                                  uplineRake:             itemx.uplineRake ? itemx.uplineRake : 0,
                                                  agencyRake:             itemx.agencyRake ? itemx.agencyRake : 0,
                                                  playerRake:             itemx.playerRake ? itemx.playerRake : 0,
                                                  downlineRake:           itemx.downlineRake ? itemx.downlineRake : 0,
                                                  playerChiprate:         itemx.playerChiprate ? itemx.playerChiprate : 0,
                                                  uplineChipcut:          itemx.uplineChipcut ? itemx.uplineChipcut : 0,
                                                  agencyChipcut:          itemx.agencyChipcut ? itemx.agencyChipcut : 0,
                                                  downlineChipcut:        itemx.downlineChipcut ? itemx.downlineChipcut : 0,
                                                  otherCut:               itemx.otherCut? itemx.otherCut : 0,
                                                  otherNote:              itemx.otherNote? itemx.otherNote : null,
                                                  remarks:                itemx.remarks ? itemx.remarks : null,
                                              });

    const [onSwitch, setonSwitch]    = useState('rake');

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

                                                                    appID:                e.appID,
                                                                    accountID:            e.accountID,
                                                                    accountNick:          e.accountNickname,
                                                                    userID:               e.userID,
                                                                    userNick:             e.userNickname ? e.userNickname : '',
                                                                    userName:             e.userFirstname ? e.userFirstname+' '+e.userLastname : '' ,
                                                                  } 
                                                      } 
                                        ) 

    const valueFormulaDeal = onFormulaDeal.filter((e)=> e.playerID == itemx.playerID ) 

    const seeFORMULA = onFormula.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    value:                e.id, 
                                                                    label:                e.name, 
                                                                    description:          e.formula, 
                                                                    type:                 e.type,
                                                                    name:                 e.name,
                                                                    statusLabel:          e.statusLabel,
                                                                    note:                 e.note,
                                                                  } 
                                                      } 
                                        ) 
                                        
    const newFormulaAGENCYACTION    = seeFORMULA.filter((e)=> e.type == 'AGENCY ACTION' )
    const newFormulaAGENCYBONUS     = seeFORMULA.filter((e)=> e.type == 'AGENCY BONUS' )
    const newFormulaPLAYERRESULT    = seeFORMULA.filter((e)=> e.type == 'PLAYER RESULT' )
    
    const newCLUBS      = seeCLUBS.filter((e)=> itemx.appID == e.appID)
    const newACCOUNTS   = seeACCOUNTS.filter((e)=> itemx.appID == e.appID)

    const addACCOUNTS   = seeACCOUNTS.filter((e)=> e.appID == newAppID ? newAppID : 0) 


    const handleInput = (i,ii,it) => {

        if(it == 'text'){

            setDeals({...deals, [ii]: i})

        } else if( it == 'decimal' ){

            setDeals({...deals, [ii]: Fn.numDecimal(i)})

        } else if( it == 'percent' ){

            const val = ii == 'playerRake' ? ( i <= deals?.rakeback && i != 100 ? i : 0 ) : i  

            const deal = {...deals, [ii]: Fn.numHundred(val)}

            const rback       = Fn.numCheck(deal.rakeback)
            const rbPlayer    = Fn.numCheck(deal.playerRake)
            const rbDownline  = Fn.numCheck(deal.downlineRake)
            
            const rbUpline    = 100 - rback

            const rbAgency    = Math.abs(100 - (rbUpline + rbPlayer))

            const summed = {...deal, uplineRake: rbUpline, agencyRake: rbAgency, playerRake: ii == 'rakeback' ? 0 : rbPlayer}

            setDeals(summed)

        }

    };

    const handleChanges = (i,ii) => {

      if(ii == 'player'){

        setPlayer(i)

        if( i != null && agency != null && i.accountID == agency.accountID ){
          setAgency(null)
        } else if( i != null && downline != null && i.accountID == downline.accountID){
          setDownline(null)
        } else if( i != null && upline != null && i.accountID == upline.accountID){
          setUpline(null)
        }

      } else if(ii == 'agency'){

        setAgency(i)

        if( i != null && player != null && i.accountID == player.accountID){
          setPlayer(null)
        } else if( i != null && downline != null && i.accountID == downline.accountID){
          setDownline(null)
        } else if( i != null && upline != null && i.accountID == upline.accountID){
          setUpline(null)
        }

      } else if(ii == 'downline'){

        setDownline(i)

        if( i != null && agency != null && i.accountID == agency.accountID){
          setAgency(null)
        } else if( i != null && player != null && i.accountID == player.accountID){
          setPlayer(null)
        } else if( i != null && upline != null && i.accountID == upline.accountID){
          setUpline(null)
        }

      } else if(ii == 'upline'){

        setUpline(i)

        if( i != null && agency != null && i.accountID == agency.accountID){
          setAgency(null)
        } else if( i != null && player != null && i.accountID == player.accountID){
          setPlayer(null)
        } else if( i != null && downline != null && i.accountID == downline.accountID){
          setDownline(null)
        }

      } else if(ii == 'club'){

        setClub(i)

        const cID = i ? i.clubID : 0
        const newUPDEALS    = onUpDeals.filter((e)=> cID == e.clubID && e.status == 0)

        if(i != null && newUPDEALS.length == 1){

          const setUP   = seeACCOUNTS.filter((e)=> newUPDEALS[0].uplineID == e.accountID)

          if(setUP.length > 0){
            setUpline(setUP[0])
            handleInput(newUPDEALS[0].rakeback,'rakeback','percent')
          }

        }

        if(NEW){

          setnewAppID(i ? i.appID : 0)

          if(Fn.isNull(i)){
            setPlayer(null)
            setUpline(null)
            setAgency(null)
            setDownline(null)
          } else {
            if(player && player.appID != i.appID || i == null){
                setPlayer(null)
            }
            if(upline && upline.appID != i.appID || i == null){
                setUpline(null)
            } 
            if(agency && agency.appID != i.appID || i == null){
                setAgency(null)
            } 
            if(downline && downline.appID != i.appID || i == null){
                setDownline(null)
            }
          }

        }

      } else if(ii == 'agency_action'){
        if(i){
          setAgency_action(i)
        } else {
          setAgency_action(null)
        }
      } else if(ii == 'agency_bonus'){
        if(i){
          setAgency_bonus(i)
        } else {
          setAgency_bonus(null)
        }
      } else if(ii == 'player_result'){
        if(i){
          setPlayer_result(i)
        } else {
          setPlayer_result(null)
        }
      }
    
    };


    const isValid = () => {

      if(club && upline && player && deals){

        const isYes = !Fn.isNull(club.clubID) 
                      && !Fn.isNull(upline.uplineID) 
                      && !Fn.isNull(player.playerID) 
                      && !Fn.isNull(deals?.playerRake,0) 
                      && !Fn.isNull(deals?.rakeback,0)
                      ? false : true

        return isYes
      } else {
        return false
      }

    }

    const onSubmit =(i)=>{
      //onClose(false)
      const newArr = {
                        playerID:         player?.accountID,
                        uplineID:         upline?.accountID ? upline?.accountID : '',
                        agencyID:         agency?.accountID ? agency?.accountID : '',
                        downlineID:       downline?.accountID ? downline?.accountID : '',

                        appID:            club?.appID,
                        clubID:           club?.clubID,

                        rakeback:         deals?.rakeback,
                        rebate:           deals?.rebate,
                        chiprate:         Fnc.isNull(deals?.chiprate,0) ? 1 : deals?.chiprate,
                        currency:         !Fn.isNull(deals?.currency,0) ? deals?.currency : 'USD',
                        remarks:          deals?.remarks,

                        playerRake:       deals?.playerRake ? deals?.playerRake : 0,
                        uplineRake:       deals?.uplineRake ? deals?.uplineRake : 0,
                        agencyRake:       deals?.agencyRake ? deals?.agencyRake : 0,
                        downlineRake:     deals?.downlineRake ? deals?.downlineRake : 0,

                        agency_action:    agency_action.id,
                        agency_bonus:     agency_bonus.id,
                        player_result:    player_result.id,
                        formulaID:        itemx.formulaID,

                        playerChiprate:     deals?.playerChiprate,
                        uplineChipcut:      deals?.uplineChipcut,
                        agencyChipcut:      deals?.agencyChipcut,
                        downlineChipcut:    deals?.downlineChipcut,
                        status: 0,
                        action: 'upsert',
                        id:   itemx.id ? itemx.id : 0,
                      }

     onReturn({...newArr, what: 'dealplayers'})

    }



    useEffect(() => {

      const Ndx_Player    = newACCOUNTS.filter((e)=> e.value == itemx.playerID )
      const Ndx_Agency    = newACCOUNTS.filter((e)=> e.value == itemx.agencyID )
      const Ndx_Downline  = newACCOUNTS.filter((e)=> e.value == itemx.downlineID )
      const Ndx_upline    = newACCOUNTS.filter((e)=> e.value == itemx.uplineID )
      const Ndx_club      = newCLUBS.filter((e)=> e.value == itemx.clubID )

      const Ndx_AGENCYACTION  = newFormulaAGENCYACTION.filter((e)=> e.id == valueFormulaDeal[0]?.agency_action_ID )
      const Ndx_AGENCYBONUS   = newFormulaAGENCYBONUS.filter((e)=> e.id == valueFormulaDeal[0]?.agency_bonus_ID )
      const Ndx_PLAYERRESULT  = newFormulaPLAYERRESULT.filter((e)=> e.id == valueFormulaDeal[0]?.player_result_ID )

      setPlayer(Ndx_Player[0] ? Ndx_Player[0] : null)
      setAgency(Ndx_Agency[0] ? Ndx_Agency[0] : null)
      setDownline(Ndx_Downline[0] ? Ndx_Downline[0] : null)

      setAgency_action(Ndx_AGENCYACTION[0] ? Ndx_AGENCYACTION[0] : null)
      setAgency_bonus(Ndx_AGENCYBONUS ? Ndx_AGENCYBONUS[0] : null)
      setPlayer_result(Ndx_PLAYERRESULT ? Ndx_PLAYERRESULT[0] : null)

      setUpline(Ndx_upline[0] ? Ndx_upline[0] : null)
      setClub(Ndx_club[0] ? Ndx_club[0] : null)

    }, [onData]);


  return (
    <>
        
        <DialogContent>

          <DialogContentText component="section" style={{minHeight:'500px'}}>



            <Grid container columns={{ xs: 12, sm: 12, md: 12 }} style={{marginTop:'7px'}}>

                <Grid item xs={6} sm={3} md={3} style={{padding:'5px'}}>
                    <TextField  sx={Cs.TextCenter}
                                label={"Rakeback"}
                                size='small'
                                value={deals ? deals?.rakeback : 0}
                                fullWidth
                                onChange={(e)=>handleInput(e.currentTarget.value,'rakeback','percent')}
                                InputProps={{  ...Cs.IconPercent, sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                                InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                                />
                </Grid>

                <Grid item xs={6} sm={3} md={3} style={{padding:'5px'}}>
                  <TextField  sx={Cs.TextCenter}
                              label={"Rebate"}
                              size='small'
                              value={deals ? Fn.numCheck(deals?.rebate) : 0}
                              fullWidth
                              onChange={(e)=>handleInput(e.currentTarget.value,'rebate','decimal')}
                              InputProps={{  ...Cs.IconChip, sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                              InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                              />
                </Grid>

                <Grid item xs={6} sm={3} md={3} style={{padding:'5px'}}>
                  <TextField  sx={Cs.TextCenter}
                              label={"Chip rate"}
                              size='small'
                              value={deals ? Fn.numCheck(deals?.chiprate) : 0}
                              fullWidth
                              onChange={(e)=>handleInput(e.currentTarget.value,'chiprate','decimal')}
                              InputProps={{  ...Cs.IconChip, sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                              InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                              />
                </Grid>

                <Grid item xs={6} sm={3} md={3} style={{padding:'5px'}}>
                    <TextField  label={"Currency"}
                                size='small'
                                error={deals ? (deals?.currency ? false : true) : true}
                                value={deals ? deals?.currency : 'USD'}
                                fullWidth
                                onChange={(e)=>handleInput(Fn.textCapital(e.currentTarget.value),'currency','text')}
                                InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                                InputProps={{
                                  style: { textAlign: 'center',  },
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      to USD
                                    </InputAdornment>
                                  ),
                                  sx: { fontSize: OnMobile ? '12px' : ''},
                                }}
                                />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                    <Divider style={{marginBottom:'20px', marginTop:'10px'}}/>
                </Grid>

                <Grid item xs={12} sm={12} md={12} style={{marginTop:'-10px'}}>

                  <Button variant={onSwitch == 'rake' ? "contained" : "outlined"} 
                          sx={{...Cs.buttonClass(onSwitch == 'rake' ? 'contained' : 'outlined','violet'), fontSize: OnMobile ? '11px' : '',borderRadius:'0',}}
                          onClick={()=>setonSwitch('rake')}
                          size='' >
                     {OnMobile ? 'Rakes' : 'Rakebacks'}
                  </Button>

                &nbsp;

                  <Button variant={onSwitch == 'chip' ? "contained" : "outlined"} 
                          sx={{...Cs.buttonClass(onSwitch == 'chip' ? 'contained' : 'outlined','violet'), fontSize: OnMobile ? '11px' : '',borderRadius:'0',}}
                          onClick={()=>setonSwitch('chip')}
                          size='' >
                    Chip rates
                  </Button>

                &nbsp;

                  <Button variant={onSwitch == 'formula' ? "contained" : "outlined"} 
                          sx={{...Cs.buttonClass(onSwitch == 'formula' ? 'contained' : 'outlined','violet'), fontSize: OnMobile ? '11px' : '',borderRadius:'0',}} 
                          onClick={()=>setonSwitch('formula')}
                          size='' >
                    Calculation
                  </Button>

                &nbsp;

                  <Button variant={onSwitch == 'remarks' ? "contained" : "outlined"} 
                          sx={{...Cs.buttonClass(onSwitch == 'remarks' ? 'contained' : 'outlined','violet'), fontSize: OnMobile ? '11px' : '',borderRadius:'0',}} 
                          onClick={()=>setonSwitch('remarks')}
                          size='' >
                    Remarks
                  </Button>

                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                    <Divider style={{marginBottom:'20px', marginTop:'10px'}}/>
                </Grid>

                {
                onSwitch == 'rake' || onSwitch == 'chip'

                ?

                <>


                <Grid item xs={12} sm={12} md={12} style={{padding:'5px'}}>
                    <Autocomplete
                        value={club}
                        size='small'
                        onChange={(event, newValue)=> handleChanges(newValue,'club')}
                        options={(NEW ? seeCLUBS : newCLUBS)}
                        getOptionLabel={(option) => option.label ? option.label : ''}
                        isOptionEqualToValue={(option, value) => value.clubID === club.clubID}
                        filterOptions={Fn.filterOptions}
                        renderOption={(props, option) => (
                          <React.Fragment key={option.id}>
                            <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
                            <span style={{ fontSize: '11px', color: 'gray', paddingLeft:'16px'}}>{option.clubID}</span>
                          </React.Fragment>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                            error={Fn.isNull(club) ? true : false}
                            label={ club ? ( club.clubID ? club.appName+' Club ID: '+club.clubID : 'No club' ) : "Select a club"}
                            sx={{ '& .MuiInputBase-input': { fontSize: OnMobile ? '11px' : '', }, '& .MuiInputLabel-root': { fontSize: OnMobile ? '12px' : '',   }, }}
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />

                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                    <Divider style={{marginBottom:'20px', marginTop:'20px'}}/>
                </Grid>


                <Grid item xs={8} sm={8} md={8} style={{padding:'5px'}}>

                    <Autocomplete
                        value={player}
                        size='small'
                        onChange={(event, newValue)=> handleChanges(newValue,'player')}
                        options={NEW ? addACCOUNTS : newACCOUNTS}
                        getOptionLabel={(option) => option.label ? option.label : ''}
                        isOptionEqualToValue={(option, value) => value.value == player.accountID}
                        filterOptions={Fn.filterOptions}
                        renderOption={(props, option) => (
                          <React.Fragment key={option.id}>
                          <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
                          <span style={{ fontSize: '11px', color: 'gray', paddingLeft:'16px'}}>{option.description}</span>
                            {
                              option.userName ? 
                              <span style={{ color: 'grey', fontSize: '0.70em'}}> ({option.userName})</span>
                              : 
                              option.userNick ? 
                              <span style={{ color: 'grey', fontSize: '0.70em'}}> ({option.userNick})</span>
                              : 
                              null
                            }
                          </React.Fragment>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Fn.isNull(player) ? true : false}
                            label={ 
                              player 
                              ? 
                              ( player.userName ? 'Player: '+player.userName : player.userNick ? 'Player: '+player.userNick : player.accountNick ? 'Player: '+player.accountNick : 'No player user' ) 
                              : 
                              "Select a player"
                            }
                            variant="outlined"
                            fullWidth
                            sx={{ '& .MuiInputBase-input': { fontSize: OnMobile ? '11px' : '', }, '& .MuiInputLabel-root': { fontSize: OnMobile ? '12px' : '',   }, }}
                          />
                        )}
                      />

                </Grid>

                {
                onSwitch == 'rake'
                ?
                <Grid item xs={4} sm={4} md={4} style={{padding:'5px'}}>
                    <TextField  sx={Cs.TextCenter}
                                label={"Player Rakeback"}
                                error={Fn.isNull(deals?.playerRake,0) ? true : false}
                                size='small'
                                value={deals ? deals?.playerRake : 0}
                                fullWidth
                                onChange={(e)=>handleInput(e.currentTarget.value,'playerRake','percent')}
                                InputProps={{  ...Cs.IconPercent,  sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                                InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                                />
                </Grid>
                :
                <Grid item xs={4} sm={4} md={4} style={{padding:'5px'}}>
                  <TextField  sx={Cs.TextCenter}
                              label={"Player chip rate"}
                              size='small'
                              value={deals ? Fn.numCheck(deals?.playerChiprate) : 0}
                              fullWidth
                              onChange={(e)=>handleInput(e.currentTarget.value,'playerChiprate','decimal')}
                              InputProps={{  ...Cs.IconChip,  sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                              InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                              />
                </Grid>
              }





                <Grid item xs={12} sm={12} md={12} style={{padding:'4px'}}></Grid>

                <Grid item xs={8} sm={8} md={8} style={{padding:'5px'}}>

                    <Autocomplete
                        value={upline}
                        size='small'
                        onChange={(event, newValue)=> handleChanges(newValue,'upline')}
                        options={NEW ? addACCOUNTS : newACCOUNTS}
                        getOptionLabel={(option) => option.label ? option.label : ''}
                        isOptionEqualToValue={(option, value) => value.value == upline.accountID}
                        filterOptions={Fn.filterOptions}
                        renderOption={(props, option) => (
                          <React.Fragment key={option.id}>
                          <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
                          <span style={{ fontSize: '11px', color: 'gray', paddingLeft:'16px'}}>{option.description}</span>
                            {
                              option.userName ? 
                              <span style={{ color: 'grey', fontSize: '0.70em'}}> ({option.userName})</span>
                              : 
                              option.userNick ? 
                              <span style={{ color: 'grey', fontSize: '0.70em'}}> ({option.userNick})</span>
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
                              ( upline.userName ? 'Upline: '+upline.userName : upline.userNick ? 'Upline: '+upline.userNick : upline.accountNick ? 'Upline: '+upline.accountNick : 'No upline user' ) 
                              : 
                              "Select an upline"
                            }
                            variant="outlined"
                            fullWidth
                            sx={{ '& .MuiInputBase-input': { fontSize: OnMobile ? '11px' : '', }, '& .MuiInputLabel-root': { fontSize: OnMobile ? '12px' : '',   }, }}
                          />
                        )}
                      />

                </Grid>
              {
                onSwitch == 'rake'
                ?
                <Grid item xs={4} sm={4} md={4} style={{padding:'5px'}}>
                    <TextField  sx={Cs.TextCenter} disabled
                                size='small'
                                label={"Upline Rakeback"}
                                value={deals ? deals?.uplineRake : 0}
                                fullWidth
                                onChange={(e)=>handleInput(e.currentTarget.value,'uplineRake','percent')}
                                InputProps={{  ...Cs.IconPercent,  sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                                InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                                />
                </Grid>
                :
                <Grid item xs={4} sm={4} md={4} style={{padding:'5px'}}>
                  <TextField  sx={Cs.TextCenter}
                              size='small'
                              label={"Upline chip cut"}
                              value={deals ? Fn.numCheck(deals?.uplineChipcut) : 0}
                              fullWidth
                              onChange={(e)=>handleInput(e.currentTarget.value,'uplineChipcut','decimal')}
                              InputProps={{  ...Cs.IconChip,  sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                              InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                              />
                </Grid>
              }


                <Grid item xs={8} sm={8} md={8} style={{padding:'5px'}}>

                  <Autocomplete
                      value={agency}
                      size='small'
                      onChange={(event, newValue)=> handleChanges(newValue,'agency')}
                      options={NEW ? addACCOUNTS : newACCOUNTS}
                      getOptionLabel={(option) => option.label ? option.label : ''}
                      isOptionEqualToValue={(option, value) => value.value == agency.accountID}
                      filterOptions={Fn.filterOptions}
                      renderOption={(props, option) => (
                        <React.Fragment key={option.id}>
                          <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
                          <span style={{ fontSize: '11px', color: 'gray', paddingLeft:'16px'}}>{option.description}</span>
                          {
                            option.userName ? 
                            <span style={{ color: 'grey', fontSize: '0.70em'}}> ({option.userName})</span>
                            : 
                            option.userNick ? 
                            <span style={{ color: 'grey', fontSize: '0.70em'}}> ({option.userNick})</span>
                            : 
                            null
                          }
                        </React.Fragment>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={Fn.isNull(agency) ? true : false}
                          label={ 
                            agency 
                            ? 
                            ( agency.userName ? 'Agency: '+agency.userName : agency.userNick ? 'Agency: '+agency.userNick : agency.accountNick ? 'Agency: '+agency.accountNick : 'No agency user' ) 
                            : 
                            "Select an agency"
                          }
                          variant="outlined"
                          fullWidth
                          sx={{ '& .MuiInputBase-input': { fontSize: OnMobile ? '11px' : '', }, '& .MuiInputLabel-root': { fontSize: OnMobile ? '12px' : '',   }, }}
                        />
                      )}
                    />

                </Grid>

                {
                onSwitch == 'rake'
                ?
                 <Grid item xs={4} sm={4} md={4} style={{padding:'5px'}}>
                    <TextField  sx={Cs.TextCenter} disabled
                                label={"Agency Rakeback"}
                                size='small'
                                value={deals ? deals?.agencyRake : 0}
                                fullWidth
                                onChange={(e)=>handleInput(e.currentTarget.value,'agencyRake','percent')}
                                InputProps={{  ...Cs.IconPercent,  sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                                InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                                />
                </Grid>
                :
                <Grid item xs={4} sm={4} md={4} style={{padding:'5px'}}>
                    <TextField  sx={Cs.TextCenter}
                                label={"Agency chip cut"}
                                size='small'
                                value={deals ? Fn.numCheck(deals?.agencyChipcut) : 0}
                                fullWidth
                                onChange={(e)=>handleInput(e.currentTarget.value,'agencyChipcut','decimal')}
                                InputProps={{  ...Cs.IconChip,  sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                                InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                                />
                </Grid>
              }


                <Grid item xs={12} sm={12} md={12} style={{padding:'4px'}}></Grid>


                <Grid item xs={8} sm={8} md={8} style={{padding:'5px'}}>

                  <Autocomplete
                      value={downline}
                      size='small'
                      onChange={(event, newValue)=> handleChanges(newValue,'downline')}
                      options={NEW ? addACCOUNTS : newACCOUNTS}
                      getOptionLabel={(option) => option.label ? option.label : ''}
                      isOptionEqualToValue={(option, value) => value.value == downline.accountID}
                      filterOptions={Fn.filterOptions}
                      renderOption={(props, option) => (
                        <React.Fragment key={option.id}>
                          <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
                          <span style={{ fontSize: '11px', color: 'gray', paddingLeft:'16px'}}>{option.description}</span>
                          {
                            option.userName ? 
                            <span style={{ color: 'grey', fontSize: '0.70em'}}> ({option.userName})</span>
                            : 
                            option.userNick ? 
                            <span style={{ color: 'grey', fontSize: '0.70em'}}> ({option.userNick})</span>
                            : 
                            null
                          }
                        </React.Fragment>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={Fn.isNull(downline) ? true : false}
                          label={ 
                                  downline 
                                  ? 
                                  ( downline.userName ? 'Downline: '+downline.userName : downline.userNick ? 'Downline: '+downline.userNick : downline.accountNick ? 'Downline: '+downline.accountNick : 'No downline user' ) 
                                  : 
                                  "Select a downline"
                                }
                          variant="outlined"
                          fullWidth
                          sx={{ '& .MuiInputBase-input': { fontSize: OnMobile ? '11px' : '', }, '& .MuiInputLabel-root': { fontSize: OnMobile ? '12px' : '',   }, }}
                        />
                      )}
                    />
                </Grid>
                {
                      onSwitch == 'down' 
                      ?
                      <>
                <Grid item xs={4} sm={4} md={4} style={{padding:'5px'}}>
                    <TextField  sx={Cs.TextCenter}
                                size='small'
                                label={"Downline Rakeback"}
                                value={deals ? deals?.downlineRake : 0}
                                fullWidth
                                onChange={(e)=>handleInput(e.currentTarget.value,'downlineRake','percent')}
                                InputProps={{  ...Cs.IconPercent,  sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                                InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                                />
                </Grid>

                <Grid item xs={4} sm={4} md={4} style={{padding:'5px'}}>
                  <TextField  sx={Cs.TextCenter}
                              size='small'
                              label={"Downline chip cut"}
                              value={deals ? Fn.numCheck(deals?.downlineChipcut) : 0}
                              fullWidth
                              onChange={(e)=>handleInput(e.currentTarget.value,'downlineChipcut','decimal')}
                              InputProps={{  ...Cs.IconChip,  sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                              InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                              />
                </Grid>
                      </>
                      : null
                    }
                  </>
                  :
                  onSwitch == 'remarks'
                  ?
                <Grid item xs={12} sm={12} md={12} style={{padding:'5px'}}>
                    <TextField  size='small'
                                label='Remarks'
                                multiline
                                rows={3}
                                value={deals ? (Fn.isNull(deals?.remarks) ? '' : deals?.remarks) : 0}
                                fullWidth
                                onChange={(e)=>handleInput(e.currentTarget.value,'remarks','text')}
                                InputProps={{  sx: { fontSize: OnMobile ? '12px' : '',  }, }}
                                InputLabelProps={{  sx: { fontSize: OnMobile ? '11px' : '',  }, }}
                                />
                </Grid>
                  :
                  onSwitch == 'formula'
                  ?
                <Grid item xs={12} sm={12} md={12} style={{padding:'5px'}}>

                    <Autocomplete
                        value={agency_action ? agency_action : null}
                        size='small'
                        onChange={(event, newValue)=> handleChanges(newValue,'agency_action')}
                        options={(newFormulaAGENCYACTION)}
                        getOptionLabel={(option) => option.description ? option.description : ''}
                        isOptionEqualToValue={(option, value) => value.id === agency_action?.id}
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
                            error={Fn.isNull(agency_action) ? true : false}
                            label={ agency_action ? ( agency_action.id ? 'Agency Action: '+agency_action.name : 'No formula' ) : "Select an agency action formula"}
                            variant="outlined"
                            fullWidth
                            sx={{ '& .MuiInputBase-input': { fontSize: OnMobile ? '10px' : '', }, '& .MuiInputLabel-root': { fontSize: OnMobile ? '12px' : '',   }, }}
                          />
                        )}
                      />

                    <br/>

                    <Autocomplete
                        value={agency_bonus ? agency_bonus : null}
                        size='small'
                        onChange={(event, newValue)=> handleChanges(newValue,'agency_bonus')}
                        options={(newFormulaAGENCYBONUS)}
                        getOptionLabel={(option) => option.description ? option.description : ''}
                        isOptionEqualToValue={(option, value) => value.id === agency_bonus?.id}
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
                            error={Fn.isNull(agency_bonus) ? true : false}
                            label={ agency_bonus ? ( agency_bonus.id ? 'Agency Bonus: '+agency_bonus.name : 'No formula' ) : "Select an agency bonus formula"}
                            variant="outlined"
                            fullWidth
                            sx={{ '& .MuiInputBase-input': { fontSize: OnMobile ? '10px' : '', }, '& .MuiInputLabel-root': { fontSize: OnMobile ? '12px' : '',   }, }}
                          />
                        )}
                      />

                    <br/>

                    <Autocomplete
                        value={player_result ? player_result : null}
                        size='small'
                        onChange={(event, newValue)=> handleChanges(newValue,'player_result')}
                        options={(newFormulaPLAYERRESULT)}
                        getOptionLabel={(option) => option.description ? option.description : ''}
                        isOptionEqualToValue={(option, value) => value.id === player_result?.id}
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
                            error={Fn.isNull(player_result) ? true : false}
                            label={ player_result ? ( player_result.id ? 'Player Result: '+player_result.name : 'No formula' ) : "Select an player result formula"}
                            variant="outlined"
                            fullWidth
                            sx={{ '& .MuiInputBase-input': { fontSize: OnMobile ? '11px' : '', }, '& .MuiInputLabel-root': { fontSize: OnMobile ? '12px' : '',   }, }}
                          />
                        )}
                      />

                </Grid>
                :
                  null
                }



            </Grid>

            {
             Fnc.JSONS(upline,false)
            }
            
          </DialogContentText>

        </DialogContent>

        <DialogActions style={{paddingBottom:'25px',paddingRight:'30px',display: 'flex', justifyContent: 'center'}}>

            {
              !isValid()
              ?
              null
              :
              <Button sx={{...Cs.buttonClass('contained','violet'), width:'50%',borderRadius:'0',fontSize: OnMobile ? '11px' : ''}} variant='contained' onClick={()=>onSubmit()}>SUBMIT</Button>
            }

            <Button variant='outlined' onClick={onClose} sx={{borderRadius:'0',width:'50%',fontSize: OnMobile ? '11px' : ''}}>CANCEL</Button>

        </DialogActions>

    </>
  );
  
}
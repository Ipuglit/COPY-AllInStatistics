// DialogComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {Dialog,DialogTitle,DialogContent,Alert,DialogActions,Button} from '@mui/material';

import * as Dia from '.'

import { UpsertDATA, UpsertLINK } from 'src/hooks/upsert/upsert-data'

export default function TheDialog({ onOpen, onClose, onName, onData, onItems, onSubmitted }) {
  
  const onReturned =(i)=>{

    if(i.what == 'CLUB'){
      onSubmitted({
                    ROW:                    i?.row,
                    WHAT:                   i?.what,
                    APPLY:                  i?.apply ? i?.apply : false,
                    CLUBID:                 i.clubID,
                    CLUBNAME:               i.clubName,
                    CLUBSUB:                i.sub ? i.sub : '',
                    CLUB:                   i.club,
                    APPID:                  i.appID,
                    APPNAME:                i.appName,
                  })

    } else if( i.what == 'PLAYER' || i.what == 'UPLINE' || i.what == 'AGENCY' || i.what == 'DOWNLINE' ){
      onSubmitted({
                    ROW:                    i?.row,
                    WHAT:                   i?.what,
                    APPLYCLUB:              i?.applyClub ? i?.applyClub : false,
                    APPLYPLAYER:            i?.applyPlayer ? i?.applyPlayer : false,
                    APPLYACCOUNT:           i?.applyAccount ? i?.applyAccount : false,
                    SUBCLUB:                i.subClub,
                    SUBPLAYER:              i.subPlayer,
                    SUBACCOUNT:             i.subAccount,
                    [i.what+'ID']:          i.accountID,
                    [i.what+'NICK']:        i.accountNick,
                    [i.what+'APPID']:       i.appID,
                    [i.what+'USERID']:      i.accountUserID,
                    [i.what+'USERNICK']:    i.accountUserNick,
                    [i.what+'USERNAME']:    i.accountUserName,
                    [i.what+'SUB']:         '',
                  })
    } else if(i.what == 'DATE'){
      onSubmitted({
                    ROW:                    i?.row,
                    WHAT:                   i?.what,
                    APPLYDATE:              i?.applyDate ? i?.applyDate : false,
                    APPLYCLUB:              i?.applyClub ? i?.applyClub : false,
                    APPLYPLAYER:            i?.applyPlayer ? i?.applyPlayer : false,
                    SUBDATE:                i.subDate ? i.subDate : '',
                    SUBCLUB:                i.subClub ? i.subClub : '',
                    SUBPLAYER:              i.subPlayer ? i.subPlayer : '',
                    DATEOPENNED:            i.dateopenned,
                    DATECLOSED:             i.dateclosed,
                    DATESUB:                '',
                  })
    } else if(i.what == 'DEAL'){
      onSubmitted({
                    ROW:                    i?.row,
                    WHAT:                   i?.what,
                    APPLYCLUB:              i?.applyClub ? i?.applyClub : false,
                    APPLYPLAYER:            i?.applyPlayer ? i?.applyPlayer : false,
                    SUBCLUB:                i.subClub ? i.subClub : '',
                    SUBPLAYER:              i.subPlayer ? i.subPlayer : '',
                    RAKEBACK:               i.rakeback,
                    REBATE:                 i.rebate,
                    CHIPRATE:               i.chiprate,
                    PLAYERRAKE:             i.playerrake,
                    UPLINERAKE:             i.uplinerake,
                    AGENCYRAKE:             i.agencyrake,
                    DOWNLINERAKE:           i.downlinerake,
                    PLAYERCHIP:             i.playerchip,
                    UPLINECHIP:             i.uplinechip,
                    AGENCYCHIP:             i.agencychip,
                    DOWNLINECHIP:           i.downlinechip,
                  })
    } else if(i.what == 'REMARKS'){
      onSubmitted({
                    ROW:                    i?.row,
                    WHAT:                   i?.what,
                    APPLY:                  i?.apply ? i?.apply : false,
                    REMARKS:                i.REMARKS,
                  })
    } else if(i.what == 'RATE'){
      onSubmitted({
                    ROW:                    i?.row,
                    WHAT:                   i?.what,
                    APPLYCLUB:              i?.applyClub ? i?.applyClub : false,
                    APPLYPLAYER:            i?.applyPlayer ? i?.applyPlayer : false,
                    SUBCLUB:                i.subClub ? i.subClub : '',
                    SUBPLAYER:              i.subPlayer ? i.subPlayer : '',
                    FXCURRENCY:             i?.FXCURRENCY,
                    FXDATE:                 i?.FXDATE,
                    FXPROVIDER:             i?.FXPROVIDER,
                    FXSUB:                  i?.FXSUB,
                    FXUSD:                  i?.FXUSD,
                  })
    } else if(i.what == 'AGENCYACTION' || i.what == 'AGENCYBONUS' || i.what == 'PLAYERRESULT'){
      console.log(i)
      onSubmitted({
                    ROW:                        i?.row,
                    WHAT:                       i?.what,
                    SUBCLUB:                    i.subClub ? i.subClub : '',
                    SUBPLAYER:                  i.subPlayer ? i.subPlayer : '',
                    APPLYCLUB:                  i?.applyClub ? i?.applyClub : false,
                    APPLYPLAYER:                i?.applyPlayer ? i?.applyPlayer : false,
                    REFRESH:                    i?.refresh,

                    FORMULA_AGENCYACTIONID:     i?.FORMULA_AGENCYACTIONID,
                    FORMULA_AGENCYACTION:       i?.FORMULA_AGENCYACTION,
                    FORMNAME_AGENCYACTION:      i?.FORMNAME_AGENCYACTION,

                    FORMULA_AGENCYBONUSID:      i?.FORMULA_AGENCYBONUSID,
                    FORMULA_AGENCYBONUS:        i?.FORMULA_AGENCYBONUS,
                    FORMNAME_AGENCYBONUS:       i?.FORMNAME_AGENCYBONUS,

                    FORMULA_PLAYERRESULTID:     i?.FORMULA_PLAYERRESULTID,
                    FORMULA_PLAYERRESULT:       i?.FORMULA_PLAYERRESULT,
                    FORMNAME_PLAYERRESULT:      i?.FORMNAME_PLAYERRESULT,
                  })
    } else if(i.what == 'POINTS' || i.what =='BONUS'){
      onSubmitted({
                    ROW:                      i?.row,
                    WHAT:                     i?.what,
                    APPLY:                    i?.apply ? i?.apply : false,
                    SUB:                      i?.sub,
                    BONUS_TOTAL:              i?.BONUS_TOTAL,
                    BONUS_SIX:                i?.BONUS_SIX,
                    BONUS_FLH:                i?.BONUS_FLH,
                    BONUS_FLOHI:              i?.BONUS_FLOHI,
                    BONUS_FLOHILO:            i?.BONUS_FLOHILO,
                    BONUS_MIXED:              i?.BONUS_MIXED,
                    BONUS_MTT:                i?.BONUS_MTT,
                    BONUS_NLH:                i?.BONUS_NLH,
                    BONUS_OFC:                i?.BONUS_OFC,
                    BONUS_PLOHI:              i?.BONUS_PLOHI,
                    BONUS_PLOHILO:            i?.BONUS_PLOHILO,
                    BONUS_SNG:                i?.BONUS_SNG,
                    BONUS_SPIN:               i?.BONUS_SPIN,
                    BONUS_OTHERS:             i?.BONUS_OTHERS,
                    WINLOSS_TOTAL:            i?.WINLOSS_TOTAL,
                    WINLOSS_WIN:              i?.WINLOSS_WIN,
                    WINLOSS_LOSS:             i?.WINLOSS_LOSS,
                    WINLOSS_SIX:              i?.WINLOSS_SIX,
                    WINLOSS_FLH:              i?.WINLOSS_FLH,
                    WINLOSS_FLOHI:            i?.WINLOSS_FLOHI,
                    WINLOSS_FLOHILO:          i?.WINLOSS_FLOHILO,
                    WINLOSS_MIXED:            i?.WINLOSS_MIXED,
                    WINLOSS_MTT:              i?.WINLOSS_MTT,
                    WINLOSS_NLH:              i?.WINLOSS_NLH,
                    WINLOSS_OFC:              i?.WINLOSS_OFC,
                    WINLOSS_PLOHI:            i?.WINLOSS_PLOHI,
                    WINLOSS_PLOHILO:          i?.WINLOSS_PLOHILO,
                    WINLOSS_SNG:              i?.WINLOSS_SNG,
                    WINLOSS_SPIN:             i?.WINLOSS_SPIN,
                    WINLOSS_OTHERS:           i?.WINLOSS_OTHERS,
                  })
    } else if(i.what == 'DELETE'){
      onSubmitted({
                    DATA:                   i?.row,
                    WHAT:                   i?.what,
                    APPLY:                  false,
                  })
    }
    onClose(false)
  }

 useEffect(()=>{

 },[])

  return (
    <Dialog open={onOpen} onClose={onClose} fullWidth>

      <DialogTitle style={{marginTop:'10px'}}>
         {onName == 'DELETE' ? 'DELETE RECORDS' : onName == 'POINTS' ||  onName == 'BONUS' ? 'EDIT POINTS AND BONUS' : onName == 'AGENCYBONUS' || onName == 'AGENCYACTION' || onName == 'PLAYERRESULT' ? 'EDIT FORMULA': 'EDIT '+onName}
      </DialogTitle>

      {
        onName == 'DATE'
        ?
        <Dia.DateRange onClose={onClose} onData={{data: onData, name: onName}} onItems={onItems} onReturn={onReturned}/>
        :
        onName == 'CLUB'
        ?
        <Dia.Club onClose={onClose} onData={{data: onData, name: onName}} onItems={onItems} onReturn={onReturned}/>
        :
        onName == 'PLAYER' || onName == 'UPLINE' || onName == 'AGENCY' || onName == 'DOWNLINE'
        ?
        <Dia.Account onClose={onClose} onData={{data: onData, name: onName}} onItems={onItems} onReturn={onReturned}/>
        :
        onName == 'DEAL'
        ?
        <Dia.Deal onClose={onClose} onData={{data: onData, name: onName}} onItems={onItems} onReturn={onReturned}/>
        :
        onName == 'POINTS' ||  onName == 'BONUS'
        ?
        <Dia.Points onClose={onClose} onData={{data: onData, name: onName}} onItems={onItems} onReturn={onReturned}/>
        :
        onName == 'AGENCYACTION' || onName == 'AGENCYBONUS' || onName == 'PLAYERRESULT'
        ?
        <Dia.Formula onClose={onClose} onData={{data: onData, name: onName}} onItems={onItems} onReturn={onReturned}/>
        :
        onName == 'RATE' 
        ?
        <Dia.Rates onClose={onClose} onData={{data: onData, name: onName}} onItems={onItems} onReturn={onReturned}/>
        :
        onName == 'REMARKS' 
        ?
        <Dia.Remarks onClose={onClose} onData={{data: onData, name: onName}} onReturn={onReturned}/>
        :
        onName == 'DELETE' 
        ?
        <Dia.DataDelete onClose={onClose} onData={{data: onData, name: onName}} onReturn={onReturned}/>
        :
        <DialogActions>
          <Button onClick={onClose}>
            Close
          </Button>
        </DialogActions>

      }


    </Dialog>
  );
}
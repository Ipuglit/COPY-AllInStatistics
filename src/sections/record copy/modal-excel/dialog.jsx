// DialogComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Calculate } from 'src/hooks/formula-calculations'

import {Dialog,DialogTitle,DialogContent,Alert,DialogActions,Button} from '@mui/material';

import * as Dia from '.'
import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

import { UpsertDATA, UpsertLINK } from 'src/hooks/upsert/upsert-data'

export default function ExcelDialog({ onOpen, onClose, onName, onData, onItems, onSubmitted }) {
  
  const onReturned =(i)=>{


   if(i.what == 'DATE'){

      onSubmitted({
                      ROW:                    i?.row,
                      WHAT:                   i?.what,
                      APPLYDATE:              i?.applyDate ? i?.applyDate : false,
                      APPLYCLUB:              i?.applyClub ? i?.applyClub : false,
                      APPLYPLAYER:            i?.applyPlayer ? i?.applyPlayer : false,
                      MATCH:                  {
                                                dateOpen:               i?.subDateOpen, 
                                                dateClose:              i?.subDateClose,
                                                club:                   i?.subClub,
                                                player:                 i?.subPlayer,
                                              },
                      DATA:                   {
                                                DATEOPENNED:            i.dateopenned,
                                                DATECLOSED:             i.dateclosed,
                                                DATESUB:                '',
                                              }
                  })

    } else if(i.what == 'CLUB'){

      onSubmitted({
                    ROW:                    i?.row,
                    WHAT:                   i?.what,
                    APPLYCLUB:              i?.apply ? i?.apply : false,
                    MATCH:                  {
                                              club:                   i?.subClub,
                                            },
                    DATA:                   {
                                              CLUBID:                 i.clubID,
                                              CLUBNAME:               i.clubName,
                                              CLUBSUB:                i.sub ? i.sub : '',
                                              CLUB:                   '',
                                              APPID:                  i.appID,
                                              APPNAME:                i.appName,
                                            }
                  })

    } else if( i.what == 'PLAYER' || i.what == 'UPLINE' || i.what == 'AGENCY' || i.what == 'DOWNLINE' ){

      onSubmitted({
                    ROW:                    i?.row,
                    WHAT:                   i?.what,
                    APPLYCLUB:              i?.applyClub ? i?.applyClub : false,
                    APPLYPLAYER:            i?.applyPlayer ? i?.applyPlayer : false,
                    APPLYACCOUNT:           i?.applyAccount ? i?.applyAccount : false,
                    MATCH:                  {
                                                club:                   i?.subClub,
                                                player:                 i?.subPlayer,
                                                account:                i?.subAccount,
                                                appID:                  i?.subAppID,
                                            },
                    DATA:                   {
                                              [i.what+'ID']:          i.accountID,
                                              [i.what+'NICK']:        i.accountNick,
                                              [i.what+'APPID']:       i.appID,
                                              [i.what+'USERID']:      i.accountUserID,
                                              [i.what+'USERNICK']:    i.accountUserNick,
                                              [i.what+'USERNAME']:    i.accountUserName,
                                              [i.what+'SUB']:         '',
                                            }
                  })

    } else if(i.what == 'DEAL'){
      onSubmitted({
                    ROW:                    i?.row,
                    WHAT:                   i?.what,
                    APPLYCLUB:              i?.applyClub ? i?.applyClub : false,
                    APPLYPLAYER:            i?.applyPlayer ? i?.applyPlayer : false,
                    MATCH:                  {
                                                club:                   i?.subClub,
                                                player:                 i?.subPlayer,
                                            },
                    DATA:                   {
                                                RAKEBACK:               i.rakeback,
                                                REBATE:                 i.rebate,
                                                CHIPRATE:               Fnc.isNull(i.chiprate,0) ? 1 : i.chiprate,
                                                PLAYERRAKE:             i.playerRake,
                                                UPLINERAKE:             i.uplineRake,
                                                AGENCYRAKE:             i.agencyRake,
                                                DOWNLINERAKE:           i.downlineRake,
                                                PLAYERCHIP:             i.playerChip,
                                                UPLINECHIP:             i.uplineChip,
                                                AGENCYCHIP:             i.agencyChip,
                                                DOWNLINECHIP:           i.downlineChip,
                                            }
                  })

    } else if(i.what == 'RATE'){
      onSubmitted({
                    ROW:                    i?.row,
                    WHAT:                   i?.what,
                    APPLYCLUB:              i?.applyClub ? i?.applyClub : false,
                    APPLYPLAYER:            i?.applyPlayer ? i?.applyPlayer : false,
                    MATCH:                  {
                                                club:                   i?.subClub,
                                                player:                 i?.subPlayer,
                                            },
                    DATA:                   {
                                                FXCURRENCY:             i?.FXCURRENCY,
                                                FXDATE:                 i?.FXDATE,
                                                FXPROVIDER:             i?.FXPROVIDER,
                                                FXUSD:                  i?.FXUSD,
                                                FXSUB:                  i?.FXSUB,
                                            }
                  })

    } else if(i.what == 'REMARKS'){
      onSubmitted({
                    ROW:                    i?.row,
                    WHAT:                   i?.what,
                    APPLYCLUB:              i?.applyClub ? i?.applyClub : false,
                    APPLYPLAYER:            i?.applyPlayer ? i?.applyPlayer : false,
                    MATCH:                  {
                                              club:                   i?.subClub,
                                              player:                 i?.subPlayer,
                                            },
                    DATA:                   {
                                              REMARKS:                i.REMARKS,
                                            }
                  })

    } else if(i.what == 'AGENCYACTION' || i.what == 'AGENCYBONUS' || i.what == 'PLAYERRESULT'){

      onSubmitted({
                    ROW:                    i?.row,
                    WHAT:                   i?.what,
                    REFRESH:                i?.refresh,
                    APPLYCLUB:              i?.applyClub ? i?.applyClub : false,
                    APPLYPLAYER:            i?.applyPlayer ? i?.applyPlayer : false,
                    MATCH:                  {
                                                club:                   i?.subClub,
                                                player:                 i?.subPlayer,
                                            },
                    DATA:                   {
                                                FORMULA_AGENCYACTIONID:           i?.FORMULA_AGENCYACTIONID,
                                                FORMULA_AGENCYACTION:             i?.FORMULA_AGENCYACTION,
                                                FORMULA_AGENCYACTIONNAME:         i?.FORMULA_AGENCYACTIONNAME,

                                                FORMULA_AGENCYBONUSID:            i?.FORMULA_AGENCYBONUSID,
                                                FORMULA_AGENCYBONUS:              i?.FORMULA_AGENCYBONUS,
                                                FORMULA_AGENCYBONUSNAME:          i?.FORMULA_AGENCYBONUSNAME,

                                                FORMULA_PLAYERRESULTID:           i?.FORMULA_PLAYERRESULTID,
                                                FORMULA_PLAYERRESULT:             i?.FORMULA_PLAYERRESULT,
                                                FORMULA_PLAYERRESULTNAME:         i?.FORMULA_PLAYERRESULTNAME,

                                                OVERRIDE_AGENCYACTION:            i?.OVERRIDE_AGENCYACTION,
                                                OVERRIDE_AGENCYBONUS:             i?.OVERRIDE_AGENCYBONUS,
                                                OVERRIDE_AGENCYACTIONVALUE:       i?.OVERRIDE_AGENCYACTIONVALUE,
                                                OVERRIDE_AGENCYBONUSVALUE:        i?.OVERRIDE_AGENCYBONUSVALUE,
                                              }

                  })
    } else if(i.what == 'POINTS' || i.what =='BONUS'){
      onSubmitted({
                    ROW:                      i?.row,
                    WHAT:                     i?.what,
                    DATA:                   {
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
                                                POINTS_TOTAL:            i?.POINTS_TOTAL,
                                                POINTS_WIN:              i?.POINTS_WIN,
                                                POINTS_LOSS:             i?.POINTS_LOSS,
                                                POINTS_SIX:              i?.POINTS_SIX,
                                                POINTS_FLH:              i?.POINTS_FLH,
                                                POINTS_FLOHI:            i?.POINTS_FLOHI,
                                                POINTS_FLOHILO:          i?.POINTS_FLOHILO,
                                                POINTS_MIXED:            i?.POINTS_MIXED,
                                                POINTS_MTT:              i?.POINTS_MTT,
                                                POINTS_NLH:              i?.POINTS_NLH,
                                                POINTS_OFC:              i?.POINTS_OFC,
                                                POINTS_PLOHI:            i?.POINTS_PLOHI,
                                                POINTS_PLOHILO:          i?.POINTS_PLOHILO,
                                                POINTS_SNG:              i?.POINTS_SNG,
                                                POINTS_SPIN:             i?.POINTS_SPIN,
                                                POINTS_OTHERS:           i?.POINTS_OTHERS,
                                              }
                  })
                  console.log(i)
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
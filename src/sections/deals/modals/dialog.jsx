// DialogComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {Dialog,DialogTitle,DialogContent,Alert,DialogActions,Button} from '@mui/material';

import * as Dia from './'

import { UpsertDATA, UpsertLINK } from 'src/hooks/upsert/upsert-data'

export default function DialogEdit({ onOpen, onClose, onData, onClubs, onAccounts, onSubmitted }) {
  
  async function onReturned(i) {

    var arrnew = {}

    if(i.what == 'club'){

      arrnew = { clubID: i.clubID, }

    } else if(i.what == 'player'){

      arrnew = { playerID: i.playerID, }

    } else if(i.what == 'upline'){

      arrnew = { uplineID: i.uplineID, }

    } else if(i.what == 'agency'){

      arrnew = { agencyID: i.agencyID, }

    } else if(i.what == 'downline'){

      arrnew = { downlineID: i.downlineID, }

    } else if(i.what == 'deals'){

      arrnew = { 
                rakeback:   i.rakeback,
                rebate:     i.rebate,
                playerRake: i.playerRake,
                uplineRake: i.uplineRake,
                agencyRake: i.agencyRake,
              }

    } else if(i.what == 'formula'){

      arrnew = { 
                  equation:               i.equation,
                  eq_agencyBonus:         i.eq_agencyBonus,
                  eq_agencyBonus_note:    i.eq_agencyBonus_note,
                  eq_agencyAction:        i.eq_agencyAction,
                  eq_agencyAction_note:   i.eq_agencyAction_note,
                  eq_playerResult:        i.eq_playerResult,
                  eq_playerResult_note:   i.eq_playerResult_note,

                }

    }

    const newData = [{
                          ...onData.data, 
                          id:       i.idd,
                          ...arrnew,
                     }]

    try {
        
        const response = await axios.post(UpsertLINK('deals','upload'),UpsertDATA({ JSONData: newData }));
        
        const feed =  response.data;

        if(feed.added > 0){

            onSubmitted({
                          status: 'added',
                          index: onData.index, 
                          name: onData.name, 
                          data: {...i, id: feed.id}
                        })

        } else if(feed.replaced > 0){

            onSubmitted({
                          status: 'replaced',
                          index: onData.index, 
                          name: onData.name, 
                          data: {...i, id: feed.id}
                        })

        } else if(feed.hits > 0){

            onSubmitted({
                          status: 'duplicate',
                          index: onData.index, 
                          name: onData.name, 
                          data: i
                        })

        } else {

            onSubmitted({
                          status: 'failed',
                          index: onData.index, 
                          name: onData.name, 
                          data: i
                        })

        }

      } catch (error) {

        onSubmitted({
                      status: 'failed',
                      index: onData.index, 
                      name: onData.name, 
                      data: i
                    })

      }

  }

  return (
    <Dialog open={onOpen} onClose={onClose} fullWidth>

      <DialogTitle style={{marginTop:'10px'}}>EDIT {onData.name}</DialogTitle>

      {
        onData.name == 'PLAYER'
        ?
        <Dia.Player onClose={onClose} onData={onData.data} onAccounts={onAccounts} onReturn={onReturned}/>
        :
        onData.name == 'CLUB'
        ?
        <Dia.Club onClose={onClose} onData={onData.data} onAccounts={onAccounts} onClubs={onClubs} onReturn={onReturned} />
        :
        onData.name == 'AGENCY'
        ?
        <Dia.Agency onClose={onClose} onData={onData.data} onAccounts={onAccounts} onReturn={onReturned} />
        :
        onData.name == 'UPLINE'
        ?
        <Dia.Upline onClose={onClose} onData={onData.data} onAccounts={onAccounts} onReturn={onReturned} />
        :
        onData.name == 'DOWNLINE'
        ?
        <Dia.Downline onClose={onClose} onData={onData.data} onAccounts={onAccounts} onReturn={onReturned} />
        :
        onData.name == 'DEALS'
        ?
        <Dia.Deals onClose={onClose} onData={onData.data} onAccounts={onAccounts} onReturn={onReturned} />
        :
        onData.name == 'FORMULA'
        ?
        <Dia.Formula onClose={onClose} onData={onData.data} onAccounts={onAccounts} onReturn={onReturned} />
        :
        <DialogActions>
          <Button onClick={onClose}>
            Close!
          </Button>
        </DialogActions>

      }


    </Dialog>
  );
}
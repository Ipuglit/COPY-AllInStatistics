// DialogComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {Dialog,DialogTitle,DialogContent,Alert,DialogActions,Button} from '@mui/material';

import * as Dia from './'

import { UpsertDATA, UpsertLINK } from 'src/hooks/upsert/upsert-data'

export default function DialogPlayer({ onOpen, onClose, onData, onClubs, onAccounts, onFormula, onFormulaDeal, onUpDeals, onSubmitted }) {

  async function onReturned(i) {
              console.log({ JSONData: [i] })
                try {
                  
                  const response = await axios.post(UpsertLINK(i.what,'upload'),UpsertDATA({ JSONData: [i] }));
                  
                  const feed =  response.data;

                  if(feed.added > 0){

                      onClose(false)
                      onSubmitted({
                                    status: 'added',
                                    index: onData.index, 
                                    name: onData.name, 
                                    data: {...i, id: feed.id}
                                  })

                  } else if(feed.replaced > 0){

                      onClose(false)
                      onSubmitted({
                                    status: 'replaced',
                                    index: onData.index, 
                                    name: onData.name, 
                                    data: {...i, id: feed.id}
                                  })

                  } else if(feed.removed > 0){

                      onClose(false)
                      onSubmitted({
                                    status: 'removed',
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
    <Dialog open={onOpen} onClose={onClose} fullWidth > 

      <DialogTitle style={{marginTop:'10px'}}>
        {onData.what == 'NEW' ? 'ADD' : onData.what == 'REMOVEP' || onData.what == 'REMOVEU' ? '' : 'UPDATE'} {onData.name == 'PLAYERS' ? 'PLAYER DEAL' : onData.name == 'DEALS' ? 'CLUB DEALS' : onData.name == 'REMOVEP' ? 'REMOVE PLAYER DEAL' : onData.name == 'REMOVEU' ? 'REMOVE UPLINE DEAL' : onData.name}
      </DialogTitle>

      {
        onData.name == 'PLAYERS'
        ?
        <Dia.Players onClose={onClose} onData={{...onData.data,what:onData.what}} onAccounts={onAccounts} onClubs={onClubs} onUpDeals={onUpDeals} onFormula={onFormula} onFormulaDeal={onFormulaDeal} onReturn={onReturned}/>
        :
        onData.name == 'REMOVEP'
        ?
        <Dia.Remove_Player onClose={onClose} onData={{...onData.data,what:onData.what}} onReturn={onReturned} />
        :
        onData.name == 'UPLINES'
        ?
        <Dia.Uplines onClose={onClose} onData={{...onData.data,what:onData.what}} onAccounts={onAccounts} onClubs={onClubs} onReturn={onReturned} />
        :
        onData.name == 'REMOVEU'
        ?
        <Dia.Remove_Upline onClose={onClose} onData={{...onData.data,what:onData.what}} onReturn={onReturned} />
        :
        onData.name == 'FORMULAS'
        ?
        <Dia.Formulas onClose={onClose} onData={{...onData.data,what:onData.what}} onReturn={onReturned} />
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
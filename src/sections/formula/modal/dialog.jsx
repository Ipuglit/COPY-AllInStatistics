// DialogComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {Dialog,DialogTitle,DialogContent,Alert,DialogActions,Button} from '@mui/material';

import * as Dia from './'
import * as Fnc from 'src/hooks/functions'

import { UpsertDATA, UpsertLINK } from 'src/hooks/upsert/upsert-data'

export default function DialogUpsert({ onOpen, onClose, onData, onList, onSubmitted }) {

  async function onReturned(i) {

                try {

                  const response = await axios.post(UpsertLINK(i.what,'upload'),UpsertDATA({ JSONData: [i] }));
                  
                  const feed =  response.data;
                  const submitted = Fnc.isSubmitted(feed,i)
                  console.log(submitted)
                  if(feed.hits > 0){

                    onSubmitted(submitted)

                  } else {

                    onClose(false)
                    onSubmitted(submitted)

                  }

                } catch (error) {
                    console.log('ERROR')
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

      <DialogTitle style={{marginTop:'10px'}}>
        {
          onData.what == 'EDIT' 
          ?
          'EDIT PLAYER FORMULA' 
          :
          onData.what == 'NEW' 
          ?
          'ADD PLAYER FORMULA' 
          :
          'REMOVE FORMULA '
        }
      </DialogTitle>

      {
        onData.name == 'FORMULAPLAYERS' && (onData.what == 'EDIT' || onData.what == 'NEW')
        ?
        <Dia.FormulaPlayers onClose={onClose} 
                            onData={{...onData.data,what:onData.what}} 
                            onAccounts={onList.Accounts} 
                            onClubs={onList.Clubs} 
                            onFormula={onList.Formula} 
                            onReturn={onReturned}/>
        :
        onData.name == 'FORMULA' && onData.what == 'EDIT'
        ?
        <Dia.Formulas onClose={onClose} 
                            onData={{...onData.data,what:onData.what}} 
                            onAccounts={onList.Accounts} 
                            onClubs={onList.Clubs} 
                            onFormula={onList.Formula} 
                            onReturn={onReturned}/>
        :
        onData.name == 'FORMULA' && onData.what == 'REMOVE'
        ?
        <Dia.Remove_Formula onClose={onClose} 
                            onData={onData.data} 
                            onReturn={onReturned}/>
        :
        onData.name == 'FORMULAPLAYERS' && onData.what == 'REMOVE'
        ?
        <Dia.Remove_FormulaPlayers  onClose={onClose} 
                                    onData={onData.data} 
                                    onReturn={onReturned}/>
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
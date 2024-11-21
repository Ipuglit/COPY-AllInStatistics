// DialogComponent.js
import React, { useState, useEffect } from 'react';

import { Calculate } from 'src/hooks/formula-calculations'

import {
        Dialog,
        Chip,
        DialogTitle,
        DialogContent,
        Alert,
        DialogActions,
        DialogContentText,
        Button,
        Box, 
        Table, 
        TableHead, 
        TableRow, 
        TableCell, 
        TableBody,
        Accordion,
        AccordionSummary,
        Typography,
        AccordionDetails,
        Tooltip,
        Divider
      } from '@mui/material';

import { RawFetch } from 'src/hooks/raw/';

import Loading_Skeletons from 'src/items/loaders/loadings'

import {DiaHistoryPlayer} from './dia-history-player'
import {DiaHistoryUpline} from './dia-history-upline'

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

export default function ModalDealHistory({ onData, onReturn }) {

const i           = onData?.data
const onMobile    = Fnc.OnMobile()

const [rawREFRESH,  setrawREFRESH]        = useState(0)
const [rawFETCH,  setrawFETCH_ACC]        = useState([]);

const fetchDATA    = RawFetch(rawFETCH,rawREFRESH, onData?.what == "PLAYER" ? 'dealplayers' : 'dealuplines')

const sortDATA = fetchDATA?.data?.sort((a, b) => new Date(b?.stated) - new Date(a?.stated));

 useEffect(()=>{
    setrawFETCH_ACC({
                      FOR:        'ALL',
                      SEARCH:     'ALL',
                      CLUB:       i?.clubID ? i?.clubID : '0',
                      PLAYER:     i?.playerID ? i?.playerID : '0',
                      UPLINE:     i?.uplineID ? i?.uplineID : '0',
                      STATUS:     'ALL',
                    })
    setrawREFRESH(Fnc.numRandom())
 },[i])

  return (
    <Dialog open={onData?.open} fullWidth maxWidth='sm'>

      <DialogTitle style={{marginTop:'5px'}}>
         <p style={{fontSize:'12px', color:'lightgray'}}>
          {onData?.what} DEAL HISTORY
         </p>

          <Box component="section" sx={{ p: 1, border: '1px dashed #97599A', fontSize: onMobile ? '11px' : '14px'}}>

                <p style={{marginTop:'-1px'}}>
                  <span style={{color:'darkgray'}}>
                  Application: 
                  </span>
                  &nbsp;
                  <span style={{float:'right', marginRight:'5px', color:'whitesmoke'}}>
                    {i?.appName}
                  </span>
                </p>

                <p style={{marginTop:'-5px'}}>
                  <span style={{color:'darkgray'}}>
                  Club <span style={{fontSize:'11px'}}>(ID: {i?.clubID})</span>: 
                  </span>
                  &nbsp;
                  <span style={{float:'right', marginRight:'5px',color:'whitesmoke'}}>
                    {i?.clubName}
                  </span>
                </p>

                <p style={{marginTop:'-5px', marginBottom:'-2px'}}>
                  <span style={{color:'darkgray'}}>
                    {
                    onData?.what == "PLAYER"
                    ?
                    <>Player <span style={{fontSize:'11px'}}>({i?.playerNick})</span>: </>
                    :
                    <>Upline <span style={{fontSize:'11px'}}>({i?.uplineNick})</span>: </>
                    }
                  </span>
                  &nbsp;
                  <span style={{float:'right', marginRight:'5px',color:'whitesmoke'}}>
                  {
                    onData?.what == "PLAYER"
                    ?
                    i?.playerID
                    :
                    i?.uplineID
                    }
                  </span>
                </p>

          </Box>


      </DialogTitle>

      <DialogContent>
        <DialogContentText component="section">
              {
                fetchDATA?.load && onData?.what == "PLAYER"
                ?
                <DiaHistoryPlayer onData={sortDATA} />
                :
                fetchDATA?.load && onData?.what == "UPLINE"
                ?
                <DiaHistoryUpline onData={sortDATA} />
                :
                <div style={{marginTop:'0px'}}>
                  <Loading_Skeletons type={'single'} />
                </div>
              }

        </DialogContentText>
              {Fnc.JSONS(fetchDATA,false)}
      </DialogContent>

      <DialogActions style={{paddingBottom:'30px',padding:'30px',display: 'flex', justifyContent: 'center'}}>

              <Button variant='standard' 
                      onClick={()=>onReturn({open: false, data: [], what: ''})} 
                      sx={{borderRadius:'0',width:'50%'}}
                      size='small'>
                CLOSE
              </Button>

      </DialogActions>

    </Dialog>
  );
}
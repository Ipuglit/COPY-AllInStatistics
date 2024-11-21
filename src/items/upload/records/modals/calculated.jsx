
import { useState, useEffect } from 'react';
import axios from 'axios';

import {
  Select,
  Autocomplete,
  Chip,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Grid,
  Typography,
} from '@mui/material';


import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

import {Compute} from '../hooks/calculations'

import {AlertSnack} from 'src/items/alert_snack'
import { nullFormat } from 'numeral';



export default function Calculated({dataReceived}) {
    

      const tableRows = dataReceived.map((i,index) => {

        const Calc = (e) => {
                                return Compute({ 
                                    what:   e,
                                    values: i,
                                })
                            } 

        const Total_WinLoss              = Calc('Total_WinLoss')
        const Total_Bonus                = Calc('Total_Bonus')
        const Total_WinLossBonus         = Calc('Total_WinLossBonus')
        const Upline_BonusRake           = Calc('Upline_BonusRake')
        const Agency_BonusRake           = Calc('Agency_BonusRake')
        const Agency_Action              = Calc('Agency_Action')

        return (
                    <tr key={index}>
                        <td>{i.DATEOPENNED}</td>
                        <td>{i.DATECLOSED}</td>
                        <td>
                          {i.APPNAME}
                          <br/>
                          {'ID: '+i.CLUBIDD}
                          <br/>
                          {i.CLUB}
                          <br/>
                          Deal: 70/10
                        </td>
                        <td>
                          {'ID: '+i.CLUBIDD}
                          <br></br>
                          {i.CLUBPERCENT}%
                        </td>
                        <td>
                          {'ID: '+i.PLAYERID}
                          <br></br>
                          {i.UPLINEPERCENT ? i.UPLINEPERCENT+'%' : null}
                        </td>
                        <td>
                          {'ID: '+i.UPLINEID}
                          <br></br>
                          {i.UPLINEPERCENT ? i.UPLINEPERCENT+'%' : null}
                        </td>
                        <td>${i.FXUSD}</td>

                        <td> {/* Win/Loss Total */}
                            {Total_WinLoss.base == Total_WinLoss.usd ? 
                              'USD '+Total_WinLoss.usd
                              : 
                              (<>
                                {i.FXCURRENCY+' '+ Total_WinLoss.base}
                                <br/>
                                {'USD ' + Total_WinLoss.usd}
                              </>)
                              }
                        </td>

                        <td> {/* Bonus Total */}
                            {Total_Bonus.base == Total_Bonus.usd ? 
                              'USD '+Total_Bonus.usd
                              : 
                              (<>
                                {i.FXCURRENCY+' '+ Total_Bonus.base}
                                <br/>
                                {'USD ' + Total_Bonus.usd}
                              </>)
                              }
                        </td>

                        <td> {/* Total */}
                            {Total_WinLossBonus.base == Total_WinLossBonus.usd ? 
                              'USD '+Total_WinLossBonus.usd
                              : 
                              (<>
                                {i.FXCURRENCY+' '+ Total_WinLossBonus.base}
                                <br/>
                                {'USD ' + Total_WinLossBonus.usd}
                              </>)
                              }
                        </td>

                        <td> {/* Agency Bonus */}
                            {Upline_BonusRake.base == Upline_BonusRake.usd ? 
                              'USD '+Upline_BonusRake.usd
                              : 
                              (<>
                                {i.FXCURRENCY+' '+ Upline_BonusRake.base}
                                <br/>
                                {'USD ' + Upline_BonusRake.usd}
                              </>)
                              }
                        </td>

                        <td> {/* Agency Action */}
                            {Agency_BonusRake.base == Agency_BonusRake.usd ? 
                              'USD '+Agency_BonusRake.usd
                              : 
                              (<>
                                {i.FXCURRENCY+' '+ Agency_BonusRake.base}
                                <br/>
                                {'USD ' + Agency_BonusRake.usd}
                              </>)
                              }
                        </td>

                        <td> {/* Player Result */}
                            {Agency_Action.base == Agency_Action.usd ?  //Agency_Action
                              'USD '+Agency_Action.usd
                              : 
                              (<>
                                {i.FXCURRENCY+' '+ Agency_Action.base}
                                <br/>
                                {'USD ' + Agency_Action.usd}
                              </>)
                              }
                        </td>

                    </tr>
                );
        })


  return (
        <>
        {
        //JSON.stringify(dataReceived,null,2)
        }
            <table id="sanpletabl" style={{marginTop:'20px'}}>
            <thead>
            <tr>
                                <th>Date Openned</th>
                                <th>Date Closed</th>
                                <th>Club</th>
                                <th>Upline</th>
                                <th>Player</th>
                                <th>Agency</th>
                                <th>USD</th>
                                <th>Total Points</th>
                                <th>Total Bonus</th>
                                <th>Total</th>
                                <th>Agency Bonus</th>
                                <th>Agency Action</th>
                                <th>Player Result</th>
            </tr>
            </thead>
            <tbody>
            { tableRows }
            </tbody>
            </table>

        </>
  );
}
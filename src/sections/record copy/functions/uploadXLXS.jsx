import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'
import axios from 'axios';

import { format,parse,isValid } from 'date-fns';

import * as XLSX from 'xlsx'; // Import XLSX library
import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

import * as Val from './values'

export default async function uploadXLXS(filed) {

    const data        = await filed.arrayBuffer();
    const workbook    = XLSX.read(data, { type: 'array', cellDates: true });
    const sheetName   = workbook.SheetNames[0];
    const worksheet   = workbook.Sheets[sheetName];
    const jsonData    = XLSX.utils.sheet_to_json(worksheet,{ header: 1, raw: false, blankrows: false });

    const dataBODY = jsonData.splice(2)

    if(jsonData[1][0] == 'DATE CLOSED' 
      && jsonData[1][1] == 'CLUB' 
      && jsonData[1][2] == 'PLAYER ID' 
      && jsonData[1][3] == 'WIN/LOSS' 
      && jsonData[1][4] == 'BONUS'
    ){
                        
      const dataHEADER = jsonData[1].map(i => i.replace(/[^a-zA-Z0-9]/g, "").toUpperCase());
            dataHEADER[3] = 'WINLOSS_TOTAL'
            dataHEADER[4] = 'BONUS_TOTAL'

      const ArrayJSON = dataBODY.map((rw) => {
          const e = {...Val.Default_Value};
          for (let i = 0; i < rw.length; i++) {
            e[dataHEADER[i]]      = rw[i];
            e['CLUBSUB']          = e['CLUB']
            e['WINLOSS_OTHERS']   = rw[3]
            e['BONUS_OTHERS']     = rw[4]
          }
          return e;
      });

      const checkClub = ArrayJSON.every(obj => {
        return obj['CLUBID'] == 0 && (obj['APPID'] == 0 || obj['APPID'] == null ||obj['APPID'] == '' )
      });

      const checkingClubs =()=>{
        if(checkClub){
          return ArrayJSON
        } else {
          return ArrayJSON
        }
      }

      return {   
                count:    dataBODY.length,
                status:   'VALID',
                title:    sheetName,
                values:   checkingClubs(),
                type:     'SHORT',
                failClub: checkClub,
            };
  //} else if(jsonData[1][0] == 'DATE CLOSED' && jsonData[1][1] == 'CLUB' && jsonData[1][2] == 'PLAYER ID' && jsonData[1][3] == 'NLH'){
  } else if(   Fnc.wordCapNoSpace(jsonData[1][0]) == 'DATEOPEN' 
            && Fnc.wordCapNoSpace(jsonData[1][1]) == 'DATECLOSED' 
            && Fnc.wordCapNoSpace(jsonData[1][2]) == 'CLUB' 
            && Fnc.wordCapNoSpace(jsonData[1][3]) == 'PLAYERID'
            && Fnc.wordCapNoSpace(jsonData[1][4]) == 'UPLINEID'
            && Fnc.wordCapNoSpace(jsonData[1][5]) == 'AGENCYID'
            && Fnc.wordCapNoSpace(jsonData[1][6]) == 'DOWNLINEID'
            && Fnc.wordCapNoSpace(jsonData[1][7]) == 'PLAYERRAKEBACK'
            && Fnc.wordCapNoSpace(jsonData[1][8]) == 'AGENCYRAKEBACK'
            && Fnc.wordCapNoSpace(jsonData[1][9]) == 'PLAYERCHIPRATE'
            && Fnc.wordCapNoSpace(jsonData[1][10]) == 'UPLINECHIPCUT'
            && Fnc.wordCapNoSpace(jsonData[1][11]) == 'AGENCYCHIPCUT'
            && Fnc.wordCapNoSpace(jsonData[1][12]) == 'DOWNLINECHIPCUT'
            && Fnc.wordCapNoSpace(jsonData[1][13]) == 'RAKEBACK'
            && Fnc.wordCapNoSpace(jsonData[1][14]) == 'REBATE'
            && Fnc.wordCapNoSpace(jsonData[1][15]) == 'CHIPRATE'
            && Fnc.wordCapNoSpace(jsonData[1][16]) == 'FXCURRENCY'
            && Fnc.wordCapNoSpace(jsonData[1][17]) == 'FXUSD'
            && Fnc.wordCapNoSpace(jsonData[1][44]) == 'REMARKS'
          ){

      const headerLONG = jsonData[1].map(i => i.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() );

      for (let i = 18; i <= 31; i++) {
          headerLONG[i] = 'WINLOSS_'+headerLONG[i];
      }

      for (let i = 32; i < 45; i++) {
          headerLONG[i] = 'BONUS_'+headerLONG[i];
      }

      const ArrayJSON = dataBODY.map((rw) => {
          const e = {...Val.Default_Value};
          for (let i = 0; i < rw.length; i++) {
            e[headerLONG[i]]      = rw[i];
            e['CLUBSUB']          = e['CLUB']
            e['WINLOSS_SIX']      = e['WINLOSS_6']
            e['BONUS_SIX']        = e['BONUS_6']
          }
          return e;
      });

      const checkClub = ArrayJSON.every(obj => {
        return obj['CLUBID'] == 0 && (obj['APPID'] == 0 || obj['APPID'] == null || obj['APPID'] == '' )
      });

      const checkingClubs =()=>{
        if(checkClub){
          return ArrayJSON
        } else {
          return ArrayJSON
        }
      }

      return {   
                count:    dataBODY.length,
                status:   'VALID',
                title:    sheetName,
                values:   checkingClubs(),
                type:     'LONG',
                failClub: checkClub,
            };

  } else {

    return {   
        count:    dataBODY.length,
        status:   'INVALID',
        title:    sheetName,
        values:   [],
        type:     'LONG',
        failClub: 'FAIL',
    };

  }


};
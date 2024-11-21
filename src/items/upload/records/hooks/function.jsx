import React, { useState, useEffect } from 'react';
import Papa from 'papaparse'
import axios from 'axios';

import { format,parse,isValid } from 'date-fns';

import * as XLSX from 'xlsx'; // Import XLSX library
import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'
import { RawClubs } from 'src/hooks/raw/clubs';


const Default_Short = {                      
                            CLUBIDD:          0,
                            CLUBSUB:          '',
                            CLUBPERCENT:      0,
                            APPID:            '',
                            APPNAME:          '',
                            PLAYERNAME:       '',
                            PLAYERSTATUS:     '',
                            PLAYERSUB:        '',
                            UPLINENAME:       '',
                            UPLINESTATUS:     '',
                            UPLINEPERCENT:    '',
                            UPLINESUB:        '',
                            FXCURRENCY:       'USD',
                            FXUSD:            1,
                            FXDATE:           '',
                            FXPROVIDER:       '',
                            BONUS_SIX:          0,
                            BONUS_FLH:        0,
                            BONUS_FLOHI:      0,
                            BONUS_FLOHILO:    0,
                            BONUS_MIXED:      0,
                            BONUS_MTT:        0,
                            BONUS_NLH:        0,
                            BONUS_OFC:        0,
                            BONUS_PLOHI:      0,
                            BONUS_PLOHILO:    0,
                            BONUS_SNG:        0,
                            BONUS_SPIN:       0,
                            WINLOSS_SIX:      0,
                            WINLOSS_FLH:      0,
                            WINLOSS_FLOHI:    0,
                            WINLOSS_FLOHILO:  0,
                            WINLOSS_MIXED:    0,
                            WINLOSS_MTT:      0,
                            WINLOSS_NLH:      0,
                            WINLOSS_OFC:      0,
                            WINLOSS_PLOHI:    0,
                            WINLOSS_PLOHILO:  0,
                            WINLOSS_SNG:      0,
                            WINLOSS_SPIN:     0,
                    }

const Default_Long = {                      
                            CLUBIDD:          0,
                            CLUBSUB:          '',
                            CLUBPERCENT:      0,
                            APPID:            '',
                            APPNAME:          '',
                            PLAYERNAME:       '',
                            PLAYERSTATUS:     '',
                            PLAYERSUB:        '',
                            UPLINENAME:       '',
                            UPLINESTATUS:     '',
                            UPLINEPERCENT:    '',
                            UPLINESUB:        '',
                            FXCURRENCY:       'USD',
                            FXUSD:            1,
                            FXDATE:           '',
                            FXPROVIDER:       '',
                            BONUS_SIX:          0,

                    }
                    
function DateSlash(i) {

      const today = new Date();
      const e = new Date(i);
      e.setDate(e.getDate());
      const year = e.getFullYear();
      const month = String(e.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
      const day = String(e.getDate()).padStart(2, '0');

      const o = { weekday: 'long'};
      const wkday = e.toLocaleDateString('en-US', o);

      if(isNaN(year)){
        return {value: '', state: 'FORMAT'}
      } else if(e > today){
        return {value: year+'-'+month+'-'+day, state:'FUTURE'}
      }
      return {value: year+'-'+month+'-'+day, state:wkday}

}


function lastSunday(i) {
  const ddate = new Date(i);
  const numDay = ddate.getDay();
  const Sun = new Date(ddate);
  Sun.setDate(ddate.getDate() - numDay);
  const sunday = Sun.toDateString()
  return DateSlash(sunday).value;
}


function numHas(value) {
  return /\d/.test(value);
}

function NumForce(i,e) {
  const val = !numHas(i) || i == undefined || i == null || i == '' ? 0 : i
    const num = String(val).replace(/[^0-9.-]/g, ''); // Replace any character that is not a number
    if ( num.includes('.') && /\d(?=\.)/.test(num) ) {
        const fix       = parseFloat(num).toFixed(e ? e : 2)
        const fixs      = fix.split('.')[0] + '.' + fix.split('.')[1].slice(0, e ? e : 2);
        const fixed     = fixs.replace(/\.0+$/, '');
        return parseFloat(fixed)
    } else {
        return parseFloat(num)
    }
}

function numUnpure(i,e) {
  //check if number else return as zero
  const val = isNaN(i) || i == undefined || i == null || i == '' ? 0 : i
  const pureNumberString = String(val).replace(/[^0-9.-]/g, '');
  const pureNumber = parseFloat(pureNumberString).toFixed(e ? e : 2);
  return pureNumber;
}

  const updateDataWinLoss = (arrData) => {

    const cleanNumbers = arrData.map( ii => {
      //console.log(arrData)
      const modifiedObj = Object.entries(ii).reduce((acc, [key, value]) => {

        const lowerKey = key.toUpperCase();

        if (lowerKey.startsWith('WINLOSS_') || lowerKey.startsWith('BONUS_')) {
            acc[key] = NumForce(value);
        } else {
            acc[key] = value;
        }

        return acc;
        
      }, {});

      return modifiedObj;

     })

    return cleanNumbers;

  };

  export const sumPosi = (arr) => {
    return arr.reduce((accumulator, currentValue) => {
        if (currentValue > 0) {
            return accumulator + currentValue;
        }
        return accumulator;
    }, 0);
  }
  
  export const sumNega = (arr) => {
    return arr.reduce((accumulator, currentValue) => {
        if (currentValue < 0) {
            return accumulator + currentValue;
        }
        return accumulator;
    }, 0);
  }

  export const sumValues = (io) => {
    let sum = 0;
    for (const number of io) {
      sum += parseFloat(number);
    }
    return NumForce(sum)
  }

  const updateSumTotal = (arrData) => {
    let counting = 1;
    const updatedArr = arrData.map((i,index) => {

      const arr = { ...i };
      const winloss = [arr['WINLOSS_SIX'],arr['WINLOSS_FLH'],arr['WINLOSS_FLOHI'],arr['WINLOSS_FLOHILO'],arr['WINLOSS_MIXED'],arr['WINLOSS_MTT'],arr['WINLOSS_NLH'],arr['WINLOSS_OFC'],arr['WINLOSS_PLOHI'],arr['WINLOSS_PLOHILO'],arr['WINLOSS_SNG'],arr['WINLOSS_SPIN'],arr['WINLOSS_OTHERS']]
      arr['WINLOSS_TOTAL']  = sumValues(winloss)
      arr['WINLOSS_WIN']    = sumPosi(winloss)
      arr['WINLOSS_LOSS']   = sumNega(winloss)
      arr['BONUS_TOTAL']    = sumValues([arr['BONUS_SIX'],arr['BONUS_FLH'],arr['BONUS_FLOHI'],arr['BONUS_FLOHILO'],arr['BONUS_MIXED'],arr['BONUS_MTT'],arr['BONUS_NLH'],arr['BONUS_OFC'],arr['BONUS_PLOHI'],arr['BONUS_PLOHILO'],arr['BONUS_SNG'],arr['BONUS_SPIN'],arr['BONUS_OTHERS']])
      arr['ROW']            = 'M' + counting++ +'J';

      return arr;

    });

    return updatedArr

  };

  const updateDataClub = (arrData, listData) => {

    const updatedArr = arrData.map((i,index) => {

      const arr = { ...i };
      arr['DATEOPENNED']      = lastSunday( arr['DATECLOSED'] )
      arr['DATECLOSED']       = DateSlash(arr['DATECLOSED']).value
      arr['DATECLOSEDDAY']    = DateSlash(arr['DATECLOSED']).state

      Object.keys(arr).forEach( ii => {
        listData.forEach(list => {

            if( String(arr['CLUB']).toUpperCase() == String(list['name']).toUpperCase() || String(arr['CLUB']).toUpperCase() == String(list['idd']).toUpperCase() ){
                arr['CLUB']            = list['name']
                arr['CLUBIDD']         = list['idd']
                arr['CLUBPERCENT']     = list['percent']
                arr['APPID']           = list['appID']
                arr['APPNAME']         = list['appName']
            }
            
        });

      });

      return arr;

    });

    return updatedArr

  };


  const updateDataPlayer = (arrData, listData) => {

    const updatedArr = arrData.map(i => {

      const arr = { ...i };

      Object.keys(arr).forEach( ii => {
        listData.forEach(list => {

            if( String(arr['PLAYERID']).toUpperCase() == String(list['accountID']).toUpperCase() ){
               arr['RECORD']              = 'NEW'
               arr['PLAYERID']            = list['accountID']
               arr['PLAYERNAME']          = list['accountNickname']
               arr['PLAYERSTATUS']        = list['statusLabel']
               arr['PLAYERAPPID']         = list['appID']
            }
            
        });
      });

      return arr;

    });

    return updatedArr

  };


  const updateDataUpline = (arrData, listData) => {

    const updatedArr = arrData.map(i => {

      const arr = { ...i };

      Object.keys(arr).forEach( ii => {
        listData.forEach(list => {

            if( String(arr['PLAYERID']).toUpperCase() == String(list['playerID']).toUpperCase() && String(arr['CLUBIDD']).toUpperCase() == String(list['clubIDD']).toUpperCase() ){
               arr['UPLINEID']          = list['uplineID']
               arr['UPLINENAME']        = list['uplineNickname']
               arr['UPLINEPERCENT']     = list['percentage']
               arr['UPLINESTATUS']      = list['uplineStatusLabel']
               arr['UPLINEAPPID']       = list['appID']
               arr['UPLINECLUBIDD']     = list['clubIDD']
            }
            
        });
      });

      return arr;

    });

    return updatedArr

  };

export const importXLXS = (file,rawClubs,rawPlayers,rawUplines) => {

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {

                    const data        = new Uint8Array(e.target.result);
                    const workbook    = XLSX.read(data, { type: 'array', cellDates: true});
                    const sheetName   = workbook.SheetNames[0]; // assuming we are reading from the first sheet
                    const sheet       = workbook.Sheets[sheetName];
                    const jsonData    = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, blankrows: false });



                    if(jsonData[1][0] == 'DATE CLOSED' && jsonData[1][1] == 'CLUB' && jsonData[1][2] == 'PLAYER ID' && jsonData[1][3] == 'WIN/LOSS' && jsonData[1][4] == 'BONUS'){
                        
                        const dataHEADER = jsonData[1].map(i => i.replace(/[^a-zA-Z0-9]/g, "").toUpperCase());
                              dataHEADER[3] = 'WINLOSS_TOTAL'
                              dataHEADER[4] = 'BONUS_TOTAL'

                        const dataBODY = jsonData.splice(2)

                        const ArrayJSON = dataBODY.map((rw) => {
                          const e = {...Default_Short};
                          for (let i = 0; i < rw.length; i++) {
                            e[dataHEADER[i]]            = rw[i];
                            e['WINLOSS_OTHERS']   = rw[3]
                            e['BONUS_OTHERS']       = rw[4]
                          }
                          return e;
                      });
                      

                        const SendingArray =()=> {

                          const cleanNumbers      = updateDataWinLoss(ArrayJSON)

                          const cleanSummed      = updateSumTotal(cleanNumbers)

                          const cleanClubs        = updateDataClub(cleanSummed,rawClubs)

                          const cleanPlayers      = updateDataPlayer(cleanClubs,rawPlayers)
                        
                          const cleanUpline       = updateDataUpline(cleanPlayers,rawUplines)
                        
                          return cleanUpline
                        
                        }

                        const checkClub = SendingArray().every(obj => {
                          return obj['CLUBIDD'] == 0 && (obj['APPID'] == 0 || obj['APPID'] == null ||obj['APPID'] == '' )
                        });

                        const checkingClubs =()=>{
                          if(checkClub){
                            return SendingArray()
                          } else {
                            return SendingArray()
                          }
                        }

                        resolve({   
                            count:    dataBODY.length,
                            status:   'VALID',
                            title:    sheetName,
                            values:   checkingClubs(),
                            type:     'SHORT',
                            failClub: checkClub,
                        });
    
                    } else if(jsonData[1][0] == 'DATE CLOSED' && jsonData[1][1] == 'CLUB' && jsonData[1][2] == 'PLAYER ID' && jsonData[1][3] == 'NLH'){
                        const headerLONG = jsonData[1].map(i => i.replace(/[^a-zA-Z0-9]/g, "").toUpperCase());
                        const dataBODY = jsonData.splice(2)

                        for (let i = 3; i <= 15; i++) {
                          const headed = headerLONG[i] == '6'? 'SIX' : headerLONG[i]
                          headerLONG[i] = 'WINLOSS_'+headed;
                        }

                        for (let i = 16; i < headerLONG.length; i++) {
                          const headed = headerLONG[i] == '6'? 'SIX' : headerLONG[i]
                          headerLONG[i] = 'BONUS_'+headed;
                        }

                        const ArrayJSON = dataBODY.map((rw) => {
                            const e = {...Default_Long};
                            for (let i = 0; i < rw.length; i++) {
                              e[headerLONG[i]]      = rw[i];
                            }
                            return e;
                        });
                        
                        const SendingArray =()=> {

                          const cleanNumbers      = updateDataWinLoss(ArrayJSON)

                          const cleanSummed      = updateSumTotal(cleanNumbers)

                          const cleanClubs        = updateDataClub(cleanSummed,rawClubs)

                          const cleanPlayers      = updateDataPlayer(cleanClubs,rawPlayers)
                        
                          const cleanUpline       = updateDataUpline(cleanPlayers,rawUplines)
                        
                          return cleanUpline
                        
                        }

                        const checkClub = SendingArray().every(obj => {
                          return obj['CLUBIDD'] == 0 && (obj['APPID'] == 0 || obj['APPID'] == null ||obj['APPID'] == '' )
                        });

                        const checkingClubs =()=>{
                          if(checkClub){
                            return SendingArray()
                          } else {
                            return SendingArray()
                          }
                        }

                        resolve({   
                            count:    dataBODY.length,
                            status:   'VALID',
                            title:    sheetName,
                            values:   checkingClubs(),
                            type:     'LONG',
                            failClub: checkClub,
                        });

                    }

      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });

  };


  export const uploadXLXS = async (filed,rawClubs,rawPlayers,rawUplines) => {

    const isValidFile = filed.name.endsWith('.csv') || filed.type === 'text/csv' || filed.name.endsWith('.xls') || filed.type === 'application/vnd.ms-excel' || filed.name.endsWith('.xlsx') || filed.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if(!isValidFile){
      return {   
                  count:    0,
                  status:   'INVALID',
                  title:    '',
                  values:   [],
                  type:     '',
                  failClub: '',
              };
    }


    const data        = await filed.arrayBuffer();
    const workbook    = XLSX.read(data, { type: 'array', cellDates: true });
    const sheetName   = workbook.SheetNames[0];
    const worksheet   = workbook.Sheets[sheetName];
    const jsonData    = XLSX.utils.sheet_to_json(worksheet,{ header: 1, raw: false, blankrows: false });

    const dataBODY = jsonData.splice(2)

    if(jsonData[1][0] == 'DATE CLOSED' && jsonData[1][1] == 'CLUB' && jsonData[1][2] == 'PLAYER ID' && jsonData[1][3] == 'WIN/LOSS' && jsonData[1][4] == 'BONUS'){
                        
      const dataHEADER = jsonData[1].map(i => i.replace(/[^a-zA-Z0-9]/g, "").toUpperCase());
            dataHEADER[3] = 'WINLOSS_TOTAL'
            dataHEADER[4] = 'BONUS_TOTAL'

      const ArrayJSON = dataBODY.map((rw) => {
          const e = {...Default_Short};
          for (let i = 0; i < rw.length; i++) {
            e[dataHEADER[i]]            = rw[i];
            e['WINLOSS_OTHERS']   = rw[3]
            e['BONUS_OTHERS']       = rw[4]
          }
          return e;
      });
      
      const SendingArray =()=> {

                                    const cleanNumbers      = updateDataWinLoss(ArrayJSON)

                                    const cleanSummed      = updateSumTotal(cleanNumbers)

                                    const cleanClubs        = updateDataClub(cleanSummed,rawClubs)

                                    const cleanPlayers      = updateDataPlayer(cleanClubs,rawPlayers)
                                  
                                    const cleanUpline       = updateDataUpline(cleanPlayers,rawUplines)
                                  
                                    return cleanUpline
                                  
                                }

      const checkClub = SendingArray().every(obj => {
        return obj['CLUBIDD'] == 0 && (obj['APPID'] == 0 || obj['APPID'] == null ||obj['APPID'] == '' )
      });

      const checkingClubs =()=>{
        if(checkClub){
          return SendingArray()
        } else {
          return SendingArray()
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

  } else if(jsonData[1][0] == 'DATE CLOSED' && jsonData[1][1] == 'CLUB' && jsonData[1][2] == 'PLAYER ID' && jsonData[1][3] == 'NLH'){
      const headerLONG = jsonData[1].map(i => i.replace(/[^a-zA-Z0-9]/g, "").toUpperCase());

      for (let i = 3; i <= 15; i++) {
          headerLONG[i] = 'WINLOSS_'+headerLONG[i];
      }

      for (let i = 16; i < headerLONG.length; i++) {
          headerLONG[i] = 'BONUS_'+headerLONG[i];
      }

      const ArrayJSON = dataBODY.map((rw) => {
          const e = {...Default_Long};
          for (let i = 0; i < rw.length; i++) {
            e[headerLONG[i]]      = rw[i];
          }
          return e;
      });
     
      const SendingArray =()=> {

                                    const cleanNumbers      = updateDataWinLoss(ArrayJSON)

                                    const cleanSummed      = updateSumTotal(cleanNumbers)
                                
                                    const cleanClubs        = updateDataClub(cleanSummed,rawClubs)

                                    const cleanPlayers      = updateDataPlayer(cleanClubs,rawPlayers)
                                  
                                    const cleanUpline       = updateDataUpline(cleanPlayers,rawUplines)
                                  
                                    return cleanUpline
                                  
                                }

      const checkClub = SendingArray().every(obj => {
        return obj['CLUBIDD'] == 0 && (obj['APPID'] == 0 || obj['APPID'] == null ||obj['APPID'] == '' )
      });

      const checkingClubs =()=>{
        if(checkClub){
          return SendingArray()
        } else {
          return SendingArray()
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

  }


};



  export const fillOutDetails = (jsonDatas,rawClubs,rawPlayers,rawUplines) => {

    const updatedArr = jsonDatas.values.map((i,index) => {

      const arr = { ...i };

      arr['DATECLOSED'] =           DateSlash(arr['DATECLOSED']).value


      Object.keys(arr).forEach( ii => {
        rawClubs.forEach(list => {

            if( String(arr['CLUB']).toUpperCase() == String(list['name']).toUpperCase() || String(arr['CLUB']).toUpperCase() == String(list['idd']).toUpperCase() ){
                arr['CLUB']            = list['name']
                arr['CLUBIDD']         = list['idd']
                arr['CLUBPERCENT']     = list['percent']
                arr['APPID']           = list['appID']
                arr['APPNAME']         = list['appName']
            }
            
        });

      });

      return arr;

    });

    return updatedArr


  };
  
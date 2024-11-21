import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';

import numeral from 'numeral';

import {LinearProgress,Box,Button,Autocomplete,Chip,Divider,TextField,Badge,InputAdornment,Tooltip,FormControl,Typography,Avatar,ListItemAvatar,List,ListItem,ListItemText,ListItemIcon } from '@mui/material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { RawClubs } from 'src/hooks/raw/clubs'
import { RawAccounts } from 'src/hooks/raw/accounts'
import { RawFXRates } from 'src/hooks/raw/'

import { RawUplines } from 'src/hooks/raw/uplines'

import { UpsertDATA, LinkUPLOAD } from 'src/hooks/upsert/upsert-data'

import { UpdateDateClosed, UpdateClub, UpdateUPPlayer, UpdateGames, UpdateFXRate, Results, Calculated } from './modals/'

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

import {importXLXS } from './hooks/function'

import Loading_Skeletons from 'src/items/loaders/loadings'

import { Icon } from '@iconify/react';

import { AlertSnack } from 'src/items/alert_snack'


// ----------------------------------------------------------------------

export default function UploadRecords({onView, ReData}) {

    const rawClubs                                = RawClubs('ALL').data;
    const rawAccounts                             = RawAccounts('ALL','ALL').data;
    const rawUplines                              = RawUplines('ALL','ACTIVE').data;
    const rawFXRates                              = RawFXRates('ALL','ALL').data;

    const [UpFILE, setUpFILE]                     = useState(null);

    const [JSONFound, setJSONFound]               = useState(true)
    const [JSONSending, setJSONSending]           = useState(false);
    const [JSONEditing, setJSONEditing]           = useState(false);
    const [JSONSent, setJSONSent]                 = useState('');

    const [JSONCalculate, setJSONCalculate]       = useState([]);
    const [JSONRendering, setJSONRendering]       = useState([]);
    
    const [onAlert, setonAlert]                   = useState({open:false,type:'',message:''});

    const [sumWINLOSS, setsumWINLOSS]             = useState(0);
    const [sumBONUS, setsumBONUS]                 = useState(0);
    const [sumChanges, setsumChanges]             = useState(0);

    const [COUNTUploaded, setCOUNTUploaded]       = useState(0);

    const [JSONDateClosed, setJSONDateClosed]     = useState([]);
    const [JSONWinLossBon, setJSONWinLossBon]     = useState([]);
    const [JSONClub, setJSONClub]                 = useState([]);
    const [JSONUPPlayer, setJSONUPPlayer]         = useState([]);
    const [JSONFXRates, setJSONFXRates]           = useState([]);

    const toDay                                   = new Date();
    var COUNTRender = 0

    const OnAlerting =(open,type,message,time)=>{

        setonAlert({open:open, type:type, message:message})

        const T = setTimeout(() => {
            setonAlert({open:false,type:'',message:''})
        }, time ? time : 2500);
        return () => clearTimeout(T);

    }


    async function submitJSONData(i,ii) {

        const csvdatas = {
                            JSONType: 'RECORDS',
                            JSONData: i,
                        }

      try {

        const response = await axios.post(LinkUPLOAD(ii),UpsertDATA(csvdatas));

        const feed =  response.data;

        if( feed.hits > 0 ){
             const hits = i.filter(e => feed.rows.includes(e.ROW));
             setJSONCalculate(hits)
             setJSONRendering(hits)
             setJSONSent('hits')

             if(feed.newaccount > 0){
              OnAlerting(true,'success',feed.newaccount > 1 ? feed.newaccount+' new accounts added!' : 'New account added!')
             }
             if(feed.newupline > 0){
              OnAlerting(true,'success',feed.newupline > 1 ? feed.newupline+' new uplines added!' : 'New upline added!')
             }
             if(feed.newclubpercent > 0){
              OnAlerting(true,'success',feed.newclubpercent+' club percent added!')
             }
             if(feed.newrecord > 0){
              OnAlerting(true,'success',feed.newrecord > 1 ? feed.newrecord+' new records added!' : 'New record added!')
             }
             if(feed.updrecord > 0){
              OnAlerting(true,'success',feed.updrecord > 1 ? feed.updrecord+' records updated!' : 'Record updated!')
             }
             if(feed.hits > 0){
              OnAlerting(true,'error',feed.hits > 1 ? feed.hits+' record duplicates found!' : 'Record duplicate found!')
             }
        } else {

            resetJSONData()
            setJSONSent('')
            if(feed.newaccount > 0){
              OnAlerting(true,'success',feed.newaccount > 1 ? feed.newaccount+' new accounts added!' : 'New account added!')
             }
             if(feed.newupline > 0){
              OnAlerting(true,'success',feed.newupline > 1 ? feed.newupline+' new uplines added!' : 'New upline added!')
             }
             if(feed.newclubpercent > 0){
              OnAlerting(true,'success',feed.newclubpercent+' club percent added!')
             }
             if(feed.newrecord > 0){
              OnAlerting(true,'success',feed.newrecord > 1 ? feed.newrecord+' new records added!' : 'New record added!')
             }
             if(feed.updrecord > 0){
              OnAlerting(true,'success',feed.updrecord > 1 ? feed.updrecord+' records updated!' : 'Record updated!')
             }
        }

      } catch (error) {
        alert("FAILED CSV ! "+error)
      }

    }
  

    const submitCalculation = (i) => {

        const x = i.find((u) => ( !u.DATECLOSED && !u.APPID && !u.CLUBIDD && u.DATECLOSED < toDay ) ); 
        if(x){
          console.log('INCOMPLETE')
        } else {
          setJSONCalculate(i)
        }
        setJSONSent('')

    };

    const onFileGoUploading = async (e) => {
      const filed = e.target.files[0];
      setUpFILE(filed)
      setCOUNTUploaded(2)
      setJSONFound(true)
    };

    var reSending = 0
    const onFileReUploading = async (data) => {
      setJSONSending(true)
      try {

        const xlxsData = await importXLXS(data,rawClubs,rawAccounts,rawUplines); 
        const checksClub = xlxsData.values.every(obj => {
            return obj['CLUBIDD'] == 0 && obj['APPNAME'] == ''
        });

        reSending = reSending + 1
        console.log('Tried '+reSending)

        if(!checksClub){
              setCOUNTUploaded(xlxsData.count)
              setJSONRendering(xlxsData.values)
              setsumChanges(9)
              setJSONFound(false)
        } else {
              setJSONFound(true)
        }

      } catch (error) {

        setJSONRendering([])
        console.error('Error parsing XLSX file:', error);

      }
    };

    const resetJSONData = () => {
      setJSONFound(true)
      setUpFILE(null)
      setCOUNTUploaded(0)
      setJSONRendering([])
      setJSONCalculate([])
      setJSONSending(false)
    };

    const deleteRow = (index) => {
        if(COUNTRender == 1){
          resetJSONData()
        } else {
          const updatedData = [...JSONRendering]; // Create array copy 
          updatedData.splice(index, 1);
          setJSONRendering(updatedData);
        }
       // ReData(updatedData)

    };
    



    const Returned_DateClosed = (i) =>{

          const e = i.values

          const updatedData = [...JSONRendering]; // Create array copy 
          updatedData[i.index]['DATEOPENNED']     = Fnc.lastSunday(e.dateClosed)
          updatedData[i.index]['DATECLOSED']      = e.dateClosed;
          updatedData[i.index]['DATECLOSEDDAY']   = e.dateClosedDay;

          setJSONRendering(updatedData);
         // ReData(updatedData)

          OnAlerting(true,'success','Date closed details saved!')

    }

    const Returned_Club = (i) =>{

          const e = i.values
         // console.log(i)
          const updatedData = [...JSONRendering]; // Create array copy 
          updatedData[i.index]['APPID']         = e.appID;
          updatedData[i.index]['APPNAME']       = e.appName;
          updatedData[i.index]['CLUBIDD']       = e.clubIDD;
          updatedData[i.index]['CLUB']          = e.clubName;
          updatedData[i.index]['CLUBPERCENT']   = e.uplineRake;
          updatedData[i.index]['playeridxx']    = "909090";

          setJSONRendering(updatedData);
          //ReData(updatedData)

          OnAlerting(true,'success','Club details saved!')

    }


    const Returned_UPPlayer = (i) =>{

          const e = i.values

          const updatedData = [...JSONRendering]; // Create array copy 
          updatedData[i.index]['PLAYERID']          = e.playerID;
          updatedData[i.index]['PLAYERNAME']        = e.playerName;
          updatedData[i.index]['PLAYERAPPID']       = e.playerAppID;
          updatedData[i.index]['UPLINEID']          = e.uplineID;
          updatedData[i.index]['UPLINENAME']        = e.uplineName;
          updatedData[i.index]['UPLINEPERCENT']     = e.agencyRake;
          updatedData[i.index]['UPLINEAPPID']       = e.uplineAppID;
          updatedData[i.index]['UPLINECLUBIDD']     = e.uplineClubIDD;

          setJSONRendering(updatedData);
         // ReData(updatedData)

          OnAlerting(true,'success','Player details saved!')

    }

    const Returned_WinLossBon = (i) =>{

        const updatedData = [...JSONRendering]; // Create array copy 
        updatedData[i.index][i.type+'_TOTAL'] = i.total;
        updatedData[i.index][i.type+'_WIN'] = i.win;
        updatedData[i.index][i.type+'_LOSS'] = i.loss;
        i.values.map((e,index) => {
          if(e.title == 'OTHER'){
            updatedData[i.index][i.type+'_OTHER'+i.type] = e.value;
          } else {
            updatedData[i.index][i.type+'_'+e.title] = e.value;
          }
        })

        setJSONRendering(updatedData);
       // ReData(updatedData)

        OnAlerting(true,'success',i.type == 'WINLOSS' ? 'Win/Loss saved!' : 'Bonus saved!')

        setsumChanges(i.total)

    }

    const Returned_FXRate = (i) =>{

      const updatedData = [...JSONRendering]; 

      const iAppID      = i['values']['appID']
      const iClubIDD    = i['values']['clubIDD']
      const iPlayerID   = i['values']['playerID']
      const iDateClosed = i['values']['dateClosed']

      if( i['values']['fxApplyTo'] == 'Applications' ){

          const updateMore = updatedData.map( e => ({
                                  ...e,           
                                  FXUSD:          e.APPID == iAppID ? Fnc.NumForce(i['values']['fxUSD']) : Fnc.NumForce(e.FXUSD),
                                  FXCURRENCY:     e.APPID == iAppID ? i['values']['fxCurrency'] : e.FXCURRENCY,
                                  FXDATE:         e.APPID == iAppID ? i['values']['fxDate'] : e.FXDATE,
                                  FXPROVIDER:     e.APPID == iAppID ? i['values']['fxProvider'] : e.FXPROVIDER,
                              }))
                              
          setJSONRendering(updateMore);
          //ReData(updateMore)
          OnAlerting(true,"success","FX Rates of "+i['values']['appName']+" saved!")

      } else if ( i['values']['fxApplyTo'] == 'Clubs' ){

          const updateMore = updatedData.map( e => ({
                                  ...e,           
                                  FXUSD:          e.CLUBIDD == iClubIDD ? i['values']['fxUSD'] : e.FXUSD,
                                  FXCURRENCY:     e.CLUBIDD == iClubIDD ? i['values']['fxCurrency'] : e.FXCURRENCY,
                                  FXDATE:         e.CLUBIDD == iClubIDD ? i['values']['fxDate'] : e.FXDATE,
                                  FXPROVIDER:     e.CLUBIDD == iClubIDD ? i['values']['fxProvider'] : e.FXPROVIDER,
                              }))
                              
          setJSONRendering(updateMore);
          //ReData(updateMore);
          OnAlerting(true,"success","FX Rates of "+i['values']['clubName']+" saved!");

      } else if ( i['values']['fxApplyTo'] == 'Players' ){

          const updateMore = updatedData.map( e => ({
                                  ...e,           
                                  FXUSD:          e.PLAYERID == iPlayerID ? i['values']['fxUSD'] : e.FXUSD,
                                  FXCURRENCY:     e.PLAYERID == iPlayerID ? i['values']['fxCurrency'] : e.FXCURRENCY,
                                  FXDATE:         e.PLAYERID == iPlayerID ? i['values']['fxDate'] : e.FXDATE,
                                  FXPROVIDER:     e.PLAYERID == iPlayerID ? i['values']['fxProvider'] : e.FXPROVIDER,
                              }))
                              
          setJSONRendering(updateMore);

          OnAlerting(true,"success","FX Rates of "+iPlayerID+" saved!")

      } else if ( i['values']['fxApplyTo'] == 'Date Closed' ){

          const updateMore = updatedData.map( e => ({
                                  ...e,           
                                  FXUSD:          e.DATECLOSED == iDateClosed ? i['values']['fxUSD'] : e.FXUSD,
                                  FXCURRENCY:     e.DATECLOSED == iDateClosed ? i['values']['fxCurrency'] : e.FXCURRENCY,
                                  FXDATE:         e.DATECLOSED == iDateClosed ? i['values']['fxDate'] : e.FXDATE,
                                  FXPROVIDER:     e.DATECLOSED == iDateClosed ? i['values']['fxProvider'] : e.FXPROVIDER,
                              }))
                              
          setJSONRendering(updateMore);

          OnAlerting(true,"success","FX Rates of closing date "+iDateClosed+" saved!")

      } else if ( i['values']['fxApplyTo'] == 'All' ){

          const updateMore = updatedData.map( e => ({
                                  ...e,           
                                  FXUSD:          i['values']['fxUSD'],
                                  FXCURRENCY:     i['values']['fxCurrency'],
                                  FXDATE:         i['values']['fxDate'],
                                  FXPROVIDER:     i['values']['fxProvider'],
                              }))
                              
          setJSONRendering(updateMore);

          OnAlerting(true,"success","FX Rates applied to all!")

      } else {

          updatedData[i.index]['FXUSD']           = i['values']['fxUSD'];
          updatedData[i.index]['FXCURRENCY']      = i['values']['fxCurrency'];
          updatedData[i.index]['FXDATE']          = i['values']['fxDate'];
          updatedData[i.index]['FXPROVIDER']      = i['values']['fxProvider'];
          setJSONRendering(updatedData);

          OnAlerting(true,'success','FX Rates saved!')

      }
      setsumChanges(17)
    }
    

    useEffect(() => {

        let WL = 0;
        let BN = 0;

        JSONRendering.forEach( num => {
            WL += parseFloat(num.WINLOSS_TOTAL);
            BN += parseFloat(num.BONUS_TOTAL);
          })
          
          setsumWINLOSS(numeral(WL).format('0,0.000'))
          setsumBONUS(numeral(BN).format('0,0.000'))
          
      }, [sumChanges]);

      useEffect(() => {

        if(ReData != 'new'){
          setJSONEditing(true)
          setCOUNTUploaded(2)
          setJSONFound(false)
          setJSONRendering(ReData == 'new' ? [] : ReData)
        }
         
      }, [ReData]);


  // --- RENDERING   // --- RENDERING   // --- RENDERING


  const RenderItems = (ndx,prim,seco,subs) => {

    return (
                  <Box display="flex" alignItems="center" >
                        <ListItem disablePadding >
                          <ListItemText primary={prim} 
                                        secondary={subs == 'NONE' ? 'NOT FOUND!' 
                                                    : subs == 'WRONG' ? 'WRONG GAME!' 
                                                    : subs == 'NEW' ? 'NEW PLAYER?' 
                                                    : subs == 'FORMAT' ? 'WRONG DATE FORMAT!' 
                                                    : subs == 'FUTURE' ? 'ADVANCED DATE!' 
                                                    : subs == '' && seco == '' ? '' : seco }
                                        primaryTypographyProps={(subs == 'NONE' || subs == 'WRONG' || subs == 'FUTURE') && seco  ?  
                                                                    { fontSize: 13,marginTop:'-6px' }  
                                                                :   { fontSize: 13 } }
                                        secondaryTypographyProps={subs == 'NONE' || subs == 'WRONG' || subs == 'FUTURE' || subs == 'FORMAT'?
                                                                        { fontSize: 11,color:'#ff2f1c',marginTop:'-6px',marginBottom:'-8px',fontWeight:'bold' }
                                                                      :
                                                                      subs == 'NEW' ?
                                                                        { fontSize: 11,color:'orange',marginTop:'-6px',marginBottom:'-8px',fontWeight:'bold'}
                                                                      :
                                                                        {fontSize: 11,marginTop:'-6px',marginBottom:'-8px',fontWeight:'bold' }
                                                                  } />
                        </ListItem>
                  </Box>
    )
  }

  
  const editDateClosed = (i,ndx) => {

      setJSONDateClosed({
                      DIALOG:       true,
                      INDEX:        ndx,
                      ITEMS:       {
                                      dateOpenned:    i['DATEOPENNED'] ? i['DATEOPENNED'] : '',
                                      dateClosed:     i['DATECLOSED'] ? i['DATECLOSED'] : '',
                                      dateClosedDay:  i['DATECLOSEDDAY'] ? i['DATECLOSEDDAY'] : '',
                                      playerID:       i['PLAYERID'] ? i['PLAYERID'] : 0,
                                      clubName:       i['CLUB'] ? i['CLUB'] : '',
                                      clubIDD:        i['CLUBIDD'] ? i['CLUBIDD'] : '',
                                      appID:          i['APPID'] ? i['APPID'] : 0,
                                      appName:        i['APPNAME'] ? i['APPNAME'] : '',
                                    },
      })

  }

  const editClub = (i,ndx) => {

    setJSONClub({
                    DIALOG:       true,
                    INDEX:        ndx,
                    CLUBS:        rawClubs,
                    ITEMS:       {
                                    dateClosed:     i['DATECLOSED'] ? i['DATECLOSED'] : '',
                                    clubName:       i['CLUB'] ? i['CLUB'] : '',
                                    clubIDD:        i['CLUBIDD'] ? i['CLUBIDD'] : '',
                                    uplineRake:    i['CLUBPERCENT'] ? i['CLUBPERCENT'] : '',
                                    appID:          i['APPID'] ? i['APPID'] : 0,
                                    appName:        i['APPNAME'] ? i['APPNAME'] : '',
                                  },
    })

  }

  const editUPPlayer = (i,ndx) => {

    setJSONUPPlayer({
                    DIALOG:       true,
                    INDEX:        ndx,
                    ACCOUNTS:     rawAccounts,
                    UPLINES:      rawUplines,
                    ITEMS:       {
                                    dateClosed:     i['DATECLOSED'] ? i['DATECLOSED'] : '',
                                    playerID:       i['PLAYERID'] ? i['PLAYERID'] : 0,
                                    playerName:     i['PLAYERNAME'] ? i['PLAYERNAME'] : '',
                                    playerAppID:    i['PLAYERAPPID'] ? i['PLAYERAPPID'] : 0,
                                    uplineID:       i['UPLINEID'] ? i['UPLINEID'] : '0',
                                    uplineName:     i['UPLINENAME'] ? i['UPLINENAME'] : '',
                                    agencyRake:  i['UPLINEPERCENT'] ? i['UPLINEPERCENT'] : '0',
                                    uplineAppID:    i['UPLINEAPPID'] ? i['UPLINEAPPID'] : 0,
                                    uplineClubIDD:  i['UPLINECLUBIDD'] ? i['UPLINECLUBIDD'] : 0,
                                    clubIDD:        i['CLUBIDD'] ? i['CLUBIDD'] : '',
                                    clubName:       i['CLUB'] ? i['CLUB'] : '',
                                    appID:          i['APPID'] ? i['APPID'] : 0,
                                    appName:        i['APPNAME'] ? i['APPNAME'] : '',
                                  },
    })

  }

  const ediTotal_WinLossBonus = (i,ndx,type) => {

    setJSONWinLossBon({
                        DIALOG:   true,
                        INDEX:    ndx,
                        TYPE:     type,
                        PLAYER:   'Player ID: '+i['PLAYERID']+(i['PLAYERNAME'] ? ' ('+i['PLAYERNAME']+')' : '' ),
                        CLUB:     i['CLUB'],
                        DATE:     i['DATECLOSED'],
                        TOTAL:    i[type +'_'+ 'TOTAL'],
                        GAMES:    [{
                                    id:     1,
                                    title: 'OTHER',
                                    syn:    "Others",
                                    value:  i[type +'_'+ 'OTHER'+type],
                                  },{
                                    id:     2,
                                    title:  "NLH",
                                    syn:    "NLH (No-Limit Hold'em)",
                                    value:  i[type +'_'+ 'NLH'],
                                  },{
                                    id:     3,
                                    title: 'FLH',
                                    syn:    "FLH (Fixed Limit Hold'em)",
                                    value:  i[type +'_'+ 'FLH'],
                                  },{
                                    id:     4,
                                    title: 'SIX',
                                    syn:    "6+ (Six-Plus Poker)",
                                    value:  i[type +'_'+ 'SIX'],
                                  },{
                                    id:     5,
                                    title: 'PLOHI',
                                    syn:    "PLO Hi (Pot Limit Omaha Hi)",
                                    value:  i[type +'_'+ 'PLOHI'],
                                  },{
                                    id:     6,
                                    title: 'PLOHILO',
                                    syn:    "PLO Hi/Lo (Pot Limit Omaha Hi-Lo)",
                                    value:  i[type +'_'+ 'PLOHILO'],
                                  },{
                                    id:     7,
                                    title: 'FLOHI',
                                    syn:    "FLO Hi (Fixed Limit Omaha Hi)",
                                    value:  i[type +'_'+ 'FLOHI'],
                                  },{
                                    id:     8,
                                    title: 'FLOHILO',
                                    syn:    "FLO Hi-Lo (Fixed Limit Omaha Hi-Lo)",
                                    value:  i[type +'_'+ 'FLOHILO'],
                                  },{
                                    id:     9,
                                    title: 'MIXED',
                                    syn:    "Mixed (Mix Poker)",
                                    value:  i[type +'_'+ 'MIXED'],
                                  },{
                                    id:     10,
                                    title: 'OFC',
                                    syn:    "OFC (Open-face Chinese Poker)",
                                    value:  i[type +'_'+ 'OFC'],
                                  },{
                                    id:     11,
                                    title: 'MTT',
                                    syn:    "MTT (Multi-Table Tournaments)",
                                    value:  i[type +'_'+ 'MTT'],
                                  },{
                                    id:     12,
                                    title: 'SNG',
                                    syn:    "SNG (Sit'n Gos)",
                                    value:  i[type +'_'+ 'SNG'],
                                  },{
                                    id:     13,
                                    title: 'SPIN',
                                    syn:    "SPIN (Spin-and-Go)",
                                    value:  i[type +'_'+ 'SPIN'],
                                  },],
                      })
    };


    const editFXRate = (i,ndx) => {

        setJSONFXRates({
                        DIALOG:       true,
                        INDEX:        ndx,
                        ITEMS:       {
                                        dateClosed:     i['DATECLOSED'] ? i['DATECLOSED'] : '',
                                        playerID:       i['PLAYERID'] ? i['PLAYERID'] : '',
                                        clubIDD:        i['CLUBIDD'] ? i['CLUBIDD'] : '',
                                        clubName:       i['CLUB'] ? i['CLUB'] : '',
                                        appID:          i['APPID'] ? i['APPID'] : 0,
                                        appName:        i['APPNAME'] ? i['APPNAME'] : '',
                                        player:         'Player ID: '+i['PLAYERID']+(i['PLAYERNAME'] ? ' ('+i['PLAYERNAME']+')' : '' ),
                                        fxUSD:          i['FXUSD'] ? i['FXUSD'] : 0,
                                        fxCurrency:     i['FXCURRENCY'] ? i['FXCURRENCY'] : 'USD',
                                        fxProvider:     i['FXPROVIDER'] ? i['FXPROVIDER'] : '',
                                        fxDate:         i['FXDATE'] ? i['FXDATE'] : '',
                                        fxApplyTo:      'This',
                                      },
                        FXRATES:      rawFXRates,
        })

    }

  // --- STARTS
  // --- STARTS
    var countErrDates = 0
    var countErrPlayers = 0
    var countNewPlayers = 0
    var countErrClubs = 0

    const RenderTableRows = JSONRendering.map((i,index) => { 

        if(Fnc.isNull(i.DATECLOSED) || i.DATECLOSEDDAY =='FORMAT' || i.DATECLOSEDDAY =='FUTURE' ){
          countErrDates  = countErrDates+1
        }

        const checkCLUB =()=>{
            if(i.APPID == 0 || i.APPID == null || i.APPID == '' || i.APPID == undefined ){
                countErrClubs = countErrClubs + 1
                return 'NONE'
            } else {
                return 'FOUND'
            }
        }

        const checkPLAYER =()=>{
            if( Fnc.isNull(i.PLAYERAPPID,'Num') ){
                countNewPlayers = countNewPlayers + 1
                return 'NEW'
            }else if(i.APPID == i.PLAYERAPPID ){
                return 'FOUND'
            } else if(i.APPID != i.PLAYERAPPID ){
                countErrPlayers = countErrPlayers + 1
                return 'WRONG'
            } else {
                return ''
            }
        }

        COUNTRender = COUNTRender+1

        return (
          <TableRow key={index}>
              <TableCell sx={{width:10}}>    
                {COUNTRender}
              </TableCell>
              <TableCell sx={{'&:hover': { cursor: 'pointer' },minWidth:130}} onClick={()=>{editDateClosed(i,index)}}>    
                { RenderItems(index,i.DATECLOSED,i.DATECLOSEDDAY,i.DATECLOSEDDAY) }
              </TableCell>

              <TableCell sx={{'&:hover': { cursor: 'pointer' },minWidth:130}} onClick={(e)=>editClub(i,index)}>
                { RenderItems(index,i.CLUB,i.APPNAME,checkCLUB()) }
              </TableCell>

              <TableCell sx={{'&:hover': { cursor: 'pointer' },minWidth:130}} onClick={(e)=>editUPPlayer(i,index)}>
                { RenderItems(index,i.PLAYERID,i.PLAYERNAME,checkPLAYER()) }
              </TableCell>

              <TableCell sx={{'&:hover': { cursor: 'pointer' },minWidth:80}} onClick={(e)=>ediTotal_WinLossBonus(i,index,'WINLOSS')} >
                { RenderItems(index,i.WINLOSS_WIN,'','') }
              </TableCell>
              
              <TableCell sx={{'&:hover': { cursor: 'pointer' },minWidth:80}} onClick={(e)=>ediTotal_WinLossBonus(i,index,'WINLOSS')} >
                { RenderItems(index,i.WINLOSS_LOSS,'','') }
              </TableCell>

              <TableCell sx={{'&:hover': { cursor: 'pointer' },minWidth:80}} onClick={(e)=>ediTotal_WinLossBonus(i,index,'BONUS')} >
                { RenderItems(index,i.BONUS_TOTAL,'','') }
              </TableCell>

              <TableCell sx={{'&:hover': { cursor: 'pointer' },minWidth:70}} onClick={(e)=>editFXRate(i,index)}>
                { RenderItems(index,i.FXCURRENCY =='USD'? '$'+i.FXUSD : '$'+i.FXUSD+' per '+i.FXCURRENCY,i.FXDATE,'') }
              </TableCell>

              <TableCell align="right" sx={{'&:hover': { cursor: 'pointer' },maxWidth:90}}>
                <Button color="error" onClick={() => deleteRow(index)}>
                    Remove
                </Button>
              </TableCell>
            </TableRow>
        )
        
    }) // --- ENDS

  return (
    <>

  {
    JSONCalculate.length == 0 || JSONSending  ?
    <>
    {
      JSONFound && !JSONSending?
      <>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '5px' }}>
            <Chip
              size='small'
              label="Short Template"
              onDelete={()=>{}}
              onClick={()=>Fnc.downloadFile('/csv/','template_records_short.xlsx')}
              sx={{'&:hover': { cursor: 'pointer' },border: '1px none violet'}}
              deleteIcon={<Icon icon="line-md:download-outline-loop" color='violet' width={'25'} />}
              variant="outlined"
            />

            <Chip
              size='small'
              label="Long Template"
              onDelete={()=>{}}
              onClick={()=>Fnc.downloadFile('/csv/','template_records_long.xlsx')}
              sx={{'&:hover': { cursor: 'pointer' },border: '1px none violet'}}
              deleteIcon={<Icon icon="line-md:download-outline-loop" color='violet' width={'25'} />}
              variant="outlined"
            />
        </Box>

        <Box component="section" style={{color:'violet'}} sx={{ p: 2, border: '1px dashed grey',color: 'primary.main' }}>
          <input type="file" accept=".xlsx, .xlsm, .xlsb, .csv" className='InputFile' onChange={onFileGoUploading} />
        </Box>
      </>
      : null
    }

    {
      COUNTUploaded > 0 && !JSONEditing?
      <>
      
            <Button variant="contained"
                    size='small'
                    sx={Cls.buttonClass('contained','violet')}
                    style={{marginTop:'10px'}}
                    onClick={()=>onFileReUploading(UpFILE)}
                    startIcon={<Icon icon="line-md:upload-outline-loop"/>}  >
                         { !JSONFound ? ' Re-submit File' : 'Submit File' }
            </Button>
            &nbsp;&nbsp;
            <Button variant="outlined"
                    size='small'
                    sx={Cls.buttonClass('outlined')}
                    style={{marginTop:'10px'}}
                    onClick={()=>resetJSONData()}
                    startIcon={<Icon icon="mdi:cancel-bold"/>}  >
                          Cancel
            </Button>

      </>
    :
    null
    }

    </>
    : null
  }

    { JSONSending && COUNTRender == 0 ?  <Loading_Skeletons type='records' /> : null }
    { JSONCalculate.length > 0 && countErrDates == 0 && countErrClubs == 0 && countErrPlayers == 0 ?
    <>
          { /* <Results dataReceived={JSONCalculate} /> */ }
          <Calculated dataReceived={JSONCalculate} />
          
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop:'25px' }}>

            <Button onClick={()=>setJSONCalculate([])}
                    variant="outlined"
                    style={{ minWidth: '130px' }}
                    startIcon={<Icon icon="fluent:ios-arrow-left-24-filled" color='purple' />}  >
                          RETURN TO EDIT
            </Button>

            &nbsp;&nbsp;&nbsp;&nbsp;

            {JSONSent == '' ?
              <Button onClick={()=>submitJSONData(JSONCalculate,'records')}
                      variant="contained"
                      style={{ backgroundColor: '#8E44AD', minWidth: '130px' }}
                      endIcon={<Icon icon="fluent:ios-arrow-right-24-filled" color='purple' />}  >
                            PROCEED SUBMIT
              </Button>
              : 
              <Button onClick={()=>(resetJSONData())}
                      variant="outlined"
                      style={{ minWidth: '130px' }}
                      startIcon={<Icon icon="pajamas:clear" color='purple' />}  >
                            CLEAR
              </Button>
            }

          </Box>
    </>

    : COUNTUploaded > 0 && !JSONFound && COUNTRender > 0 ?

    <Box sx={{ width: '100%', padding: 0}}>

        <TableContainer sx={{ maxHeight: 530, marginTop:5, marginBottom:5, width: '100%',padding:0 }} size='small'>
            <Table stickyHeader aria-label="sticky table" size='small'>

                <TableHead >
                    <TableRow >
                        <TableCell style={{paddingBottom:'20px',paddingTop:'15px'}} >#</TableCell>
                        <TableCell style={{paddingBottom:'20px',paddingTop:'15px'}}>
                          { countErrDates != 0 ?
                          <Badge badgeContent={countErrDates} color="error" sx={{ '& .MuiBadge-badge': { marginLeft: '10px' } }}>
                            <span>CLOSED&nbsp;&nbsp;&nbsp;</span>
                          </Badge>
                          : 'CLOSED' }
                        </TableCell>
                        <TableCell style={{paddingBottom:'20px',paddingTop:'15px'}}>
                          { countErrClubs != 0 ?
                          <Badge badgeContent={countErrClubs} color="error" sx={{ '& .MuiBadge-badge': { marginLeft: '10px' } }}>
                            <span>CLUB&nbsp;&nbsp;&nbsp;</span>
                          </Badge>
                          : 'CLUB' }
                        </TableCell>
                        <TableCell style={{paddingBottom:'20px',paddingTop:'15px'}}>
                          { countErrPlayers != 0 ?
                          <Badge badgeContent={countErrPlayers} color="error" sx={{ '& .MuiBadge-badge': { marginLeft: '10px' } }}>
                            <span>PLAYER&nbsp;&nbsp;&nbsp;</span>
                          </Badge>
                          : 'PLAYER' }
                        </TableCell>
                        <TableCell style={{paddingBottom:'20px',paddingTop:'15px'}}>WIN</TableCell>
                        <TableCell style={{paddingBottom:'20px',paddingTop:'15px'}}>LOSS</TableCell>
                        <TableCell style={{paddingBottom:'20px',paddingTop:'15px'}}>BONUS</TableCell>
                        <TableCell style={{paddingBottom:'20px',paddingTop:'15px'}}>USD</TableCell>
                        <TableCell style={{paddingBottom:'20px',paddingTop:'15px'}}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {RenderTableRows}
                </TableBody>
            </Table>

        </TableContainer>
        
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Chip label={"TOTAL WIN/LOSS: "+sumWINLOSS} variant="outlined" style={{fontSize: '11px'}}  />
              &nbsp;&nbsp;
              <Chip label={"TOTAL BONUS: "+sumBONUS} variant="outlined" style={{fontSize: '11px'}} />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop:'25px' }}>
          {
          JSONRendering.length > 0 && countErrDates == 0 && countErrClubs == 0 && countErrPlayers == 0 ?
            <Button onClick={()=>submitCalculation(JSONRendering)}
                    variant="contained"
                    style={{ backgroundColor: '#8E44AD', minWidth: '130px' }}
                    endIcon={<Icon icon="fluent:ios-arrow-right-24-filled" color='purple' />}  >
                          CALCULATE 
            </Button>
          : !JSONFound ?
            <Button variant="outlined"
                    sx={Cls.buttonClass('outlined','red')}
                    style={{ minWidth: '130px' }}
                    startIcon={<Icon icon="carbon:warning"/>}  >
                          PLEASE COMPLETE ALL DETAILS 
            </Button>
          : null
        }

          </Box>
    </Box>
    : null
    }

    <UpdateDateClosed     dataReceived={JSONDateClosed}   dataSubmitted={Returned_DateClosed}/>
    <UpdateClub           dataReceived={JSONClub}         dataSubmitted={Returned_Club}/>
    <UpdateUPPlayer       dataReceived={JSONUPPlayer}     dataSubmitted={Returned_UPPlayer}/>
    <UpdateGames          dataReceived={JSONWinLossBon}   dataSubmitted={Returned_WinLossBon}/>
    <UpdateFXRate         dataReceived={JSONFXRates}      dataSubmitted={Returned_FXRate}/>
{
      //<pre> {JSON.stringify(JSONRendering,null,2)}  </pre>
}
    {
      onAlert.open ? 
      AlertSnack(onAlert.type,onAlert.message)
      :
      null
    }
    {
        //<pre>{JSON.stringify(JSONCalculate,null,2)}</pre>
        //<pre>{JSON.stringify(JSONRendering,null,2)}</pre>
    }
    </>
  );
}


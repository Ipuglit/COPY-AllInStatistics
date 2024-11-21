import React,{ useEffect, useState } from 'react';
import axios from 'axios';
import {FormControlLabel,Checkbox,Chip,TextField,Autocomplete,Grid,DialogContent,DialogContentText,DialogActions,Button,Box,Table,TableHead,TableRow,TableCell,TableBody, Divider, Paper} from '@mui/material';

import { Calculate } from 'src/hooks/formula-calculations'

import { UpsertDATA, UpsertLINK } from 'src/hooks/upsert/upsert-data'

import { Icon } from '@iconify/react';
import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

export default function Formula({ onClose, onData, onItems, onReturn }) {
    
    const onMobile    = Fnc.OnMobile()

    const itemx = onData.data
    const listDDown = onItems.FORMULA.data

    const seeFORMULA = listDDown.map( (e, index)=> { 
                                                          return {  id:                   e.id,  
                                                                    value:                e.clubID, 
                                                                    label:                e.name, 
                                                                    description:          e.formula, 
                                                                    formulaID:            e.id,
                                                                    formula:              e.formula,
                                                                    type:                 e.type,
                                                                    note:                 e.note,
                                                                    name:                 e.name,
                                                                  } 
                                                      } 
                                        )

    const list_AGENCYACTION  = seeFORMULA.filter((e)=> e.type == 'AGENCY ACTION' )
    const list_AGENCYBONUS   = seeFORMULA.filter((e)=> e.type == 'AGENCY BONUS' )
    const list_PLAYERRESULT  = seeFORMULA.filter((e)=> e.type == 'PLAYER RESULT' )
                                        
    const Ndx_AGENCYACTION  = list_AGENCYACTION.filter((e)=>    e.id == itemx?.FORMULA_AGENCYACTIONID )
    const Ndx_AGENCYBONUS   = list_AGENCYBONUS.filter((e)=>     e.id == itemx?.FORMULA_AGENCYBONUSID )
    const Ndx_PLAYERRESULT  = list_PLAYERRESULT.filter((e)=>    e.id == itemx?.FORMULA_PLAYERRESULTID )

    const auto_AGENCYACTION  = seeFORMULA.filter((e)=> e.type == 'AGENCY ACTION' && e.name == 'outlined' )
    const auto_AGENCYBONUS   = seeFORMULA.filter((e)=> e.type == 'AGENCY BONUS' && e.name == 'outlined' )
    const auto_PLAYERRESULT  = seeFORMULA.filter((e)=> e.type == 'PLAYER RESULT' && e.name == 'outlined' )    

    const toCalculate = {
                            bonus:        itemx?.BONUS_TOTAL,
                            points:       itemx?.WINLOSS_TOTAL,
                            pointsWin:    itemx?.WINLOSS_WIN,
                            pointsLoss:   itemx?.WINLOSS_LOSS,

                            rakeback:     itemx?.RAKEBACK,
                            rebate:       itemx?.REBATE,
                            chiprate:     itemx?.CHIPRATE,
                            fxCurrency:   /^[A-Za-z]+$/.test(itemx?.FXCURRENCY) ? itemx?.FXCURRENCY : 'USD',
                            fxUSD:        Fnc.numCheck(itemx?.FXCURRENCY == 'USD' ? 1 : (itemx?.FXUSD > 0 ? itemx?.FXUSD : 1)),

                            playerRake:   itemx?.PLAYERRAKE,
                            uplineRake:   itemx?.UPLINERAKE,
                            agencyRake:   itemx?.AGENCYRAKE,
                            downlineRake: itemx?.DOWNLINERAKE,

                            playerRebate: itemx?.PLAYERREBATE,
                            uplineRebate: itemx?.UPLINEREBATE,
                            agencyRebate: itemx?.AGENCYREBATE,
                            downlineRebate: itemx?.DOWNLINEREBATE,

                            playerChip:   itemx?.PLAYERCHIP,
                            uplineChip:   itemx?.UPLINECHIP,
                            agencyChip:   itemx?.AGENCYCHIP,
                            downlineChip: itemx?.DOWNLINECHIP,
                        }

    const [onSwitch, setonSwitch]                   = useState('AGENCYBONUS');

    const [agencyAction, setagencyAction]           = useState(null);
    const [agencyBonus, setagencyBonus]             = useState(null);
    const [playerResult, setplayerResult]           = useState(null);

    const [checkedClub, setcheckedClub]             = useState(false);
    const [checkedPlayer, setcheckedPlayer]         = useState(false);
    const [checkedOverride, setcheckedOverride]     = useState(false)

    const [formulaValue, setformulaValue]           = useState('');
    const [formulaTitle, setformulaTitle]           = useState('');

    const [formulaResult, setformulaResult]           = useState('');

    const [formulaSave, setformulaSave]             = useState(false);
    const [formulaSubmit, setformulaSubmit]         = useState(false);


    const handleChanged = (i, e) => {
        e(i);
        setformulaValue(i?.formula)
      };

    const handleEdit = () => {
        setformulaSave(formulaSave ? false : true)
        setformulaTitle('')
      };

    const handleSubmit=(i)=>{
        if(formulaSave ==  true){
            onSubmitFormula()
        } else {
            onSubmitReturn()
        }
    }

    const onSubmitReturn =(i)=>{
        onReturn({
                    row:                        itemx.ROW, 
                    what:                       onData.name,
                    checkedClub:                checkedClub, 
                    applyClub:                  checkedClub,
                    applyPlayer:                checkedPlayer,
                    subClub:                    itemx.CLUBID,
                    subPlayer:                  itemx.PLAYERID,
                    refresh:                    false,

                    FORMULA_AGENCYACTIONID:     agencyAction?.formulaID,
                    FORMULA_AGENCYACTION:       agencyAction?.formula,
                    FORMNAME_AGENCYACTION:      agencyAction?.name,

                    FORMULA_AGENCYBONUSID:      agencyBonus?.formulaID,
                    FORMULA_AGENCYBONUS:        agencyBonus?.formula,
                    FORMNAME_AGENCYBONUS:       agencyBonus?.name,

                    FORMULA_PLAYERRESULTID:     playerResult?.formulaID,
                    FORMULA_PLAYERRESULT:       playerResult?.formula,
                    FORMNAME_PLAYERRESULT:      playerResult?.name,

                    FORMULA_RESULT:             Fnc.isEmptyThenZero(Calculate(toCalculate,formulaValue)?.result),
                })
      }

    const checkSubmit =()=>{
        if(     agencyAction?.formulaID        == itemx?.FORMULA_AGENCYACTIONID 
            &&  agencyBonus?.formulaID         == itemx?.FORMULA_AGENCYBONUSID
            &&  playerResult?.formulaID        == itemx?.FORMULA_PLAYERRESULTID
 
        ){
            return true
        } else {
            return false
        }
    }


    async function onSubmitFormula(i) {  
        setformulaSubmit(true)
        const newJSON = {    
                            id:         0,
                            type:       onSwitch == 'AGENCYACTION' ? 'AGENCY ACTION' : onSwitch == 'AGENCYBONUS' ? 'AGENCY BONUS' : 'PLAYER RESULT',
                            name:       formulaTitle,
                            formula:    formulaValue,
                            oldFormula: '',
                            note:       '',
                            status:     0,
                            action:     'upsert',
                            what:       'formula',
                        }
        try {
          
          const response = await axios.post(UpsertLINK('formula','upload'),UpsertDATA({ JSONData: [newJSON] }));
          const feed =  response.data;

           if(feed?.added > 0){
            onReturn({
                        row:                        itemx.ROW, 
                        what:                       onData.name,
                        checkedClub:                checkedClub, 
                        applyClub:                  checkedClub,
                        applyPlayer:                checkedPlayer,
                        subClub:                    itemx.CLUBID,
                        subPlayer:                  itemx.PLAYERID,
                        refresh:                    true,

                        FORMULA_AGENCYACTIONID:     onSwitch == 'AGENCYACTION' ? feed?.id       : agencyAction?.formulaID,
                        FORMULA_AGENCYACTION:       onSwitch == 'AGENCYACTION' ? formulaValue   : agencyAction?.formula,
                        FORMNAME_AGENCYACTION:      onSwitch == 'AGENCYACTION' ? formulaTitle   : agencyAction?.name,

                        FORMULA_AGENCYBONUSID:      onSwitch == 'AGENCYBONUS' ? feed?.id        : agencyBonus?.formulaID,
                        FORMULA_AGENCYBONUS:        onSwitch == 'AGENCYBONUS' ? formulaValue    : agencyBonus?.formula,
                        FORMNAME_AGENCYBONUS:       onSwitch == 'AGENCYBONUS' ? formulaTitle    : agencyBonus?.name,

                        FORMULA_PLAYERRESULTID:     onSwitch == 'PLAYERRESULT' ? feed?.id       : playerResult?.formulaID,
                        FORMULA_PLAYERRESULT:       onSwitch == 'PLAYERRESULT' ? formulaValue   : playerResult?.formula,
                        FORMNAME_PLAYERRESULT:      onSwitch == 'PLAYERRESULT' ? formulaTitle   : playerResult?.name,

                        FORMULA_RESULT:             Fnc.isEmptyThenZero(Calculate(toCalculate,formulaValue)?.result),
                    })
           }

          setformulaSubmit(false)
        } catch (error) {
            setformulaSubmit(false)
        }

    } 

    useEffect(() => {

        setagencyAction(Ndx_AGENCYACTION ? Ndx_AGENCYACTION[0] : auto_AGENCYACTION[0])
        setagencyBonus(Ndx_AGENCYBONUS ? Ndx_AGENCYBONUS[0] : auto_AGENCYBONUS[0])
        setplayerResult(Ndx_PLAYERRESULT ? Ndx_PLAYERRESULT[0] : auto_PLAYERRESULT[0])
        setonSwitch(onData.name)
        setcheckedClub(false)
        setcheckedPlayer(false)
        setformulaResult()
    }, [onData]);

    useEffect(()=>{
        setformulaValue(onSwitch == 'AGENCYACTION' ? itemx?.FORMULA_AGENCYACTION : onSwitch == 'AGENCYBONUS' ? itemx?.FORMULA_AGENCYBONUS : itemx?.FORMULA_PLAYERRESULT)
    },[onSwitch])

  return (
    <>

    <DialogContent>
        <DialogContentText component="section">

        <Box component="section" sx={{ p: 1, border: '1px dashed grey', fontSize:'12px' }}>
            {
            !Fnc.isNull(itemx.APPID,0)
            ?
            <>
            <p style={{marginTop:'-2px',color:'gray'}} >{itemx.APPNAME}</p>
            <p style={{marginTop:'-15px', marginBottom:'-2px'}}>{itemx.CLUBNAME}</p>
            </>
            :
            <p style={{marginTop:'-2px',color:'orange', marginBottom:'-2px'}} >Please select a club!</p>
            }
            {
                //JSON.stringify(agencyAction,null,2)
            }
        </Box>

        <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 12, sm: 12, md: 12 }} style={{marginTop:'15px'}}>

            <Grid item xs={12} sm={12} md={12} style={{marginTop:'-10px'}}>

                <Button variant={onSwitch == 'AGENCYBONUS' ? "contained" : "outlined"} 
                          sx={{...Cs.buttonClass(onSwitch == 'AGENCYBONUS' ? 'contained' : 'outlined','violet'), fontSize:onMobile ? '11px' : '13px',borderRadius:'0',width:'32.1%'}}
                          onClick={()=>setonSwitch('AGENCYBONUS')}
                          size='small' >
                    Agency Bonus
                </Button>
                &nbsp;
                <Button variant={onSwitch == 'AGENCYACTION' ? "contained" : "outlined"} 
                          sx={{...Cs.buttonClass(onSwitch == 'AGENCYACTION' ? 'contained' : 'outlined','violet'), fontSize:onMobile ? '11px' : '13px',borderRadius:'0',width:'32.1%'}}
                          onClick={()=>setonSwitch('AGENCYACTION')}
                          size='small' >
                    Agency Action
                </Button>
                &nbsp;
                <Button variant={onSwitch == 'PLAYERRESULT' ? "contained" : "outlined"} 
                          sx={{...Cs.buttonClass(onSwitch == 'PLAYERRESULT' ? 'contained' : 'outlined','violet'), fontSize:onMobile ? '11px' : '13px',borderRadius:'0',width:'32.1%'}}
                          onClick={()=>setonSwitch('PLAYERRESULT')}
                          size='small' >
                    Player Result
                </Button>

            </Grid>

            <Grid item xs={9} sm={9} md={9}>
                {
                !formulaSave 
                ?
                <Autocomplete
                    disableClearable
                    size='small'
                    value={ onSwitch == 'AGENCYACTION' ? agencyAction : onSwitch == 'AGENCYBONUS' ? agencyBonus : onSwitch == 'PLAYERRESULT' ? playerResult : null}
                    onChange={(event, newValue)=> handleChanged(newValue,  onSwitch == 'AGENCYACTION' ? setagencyAction : onSwitch == 'AGENCYBONUS' ? setagencyBonus : setplayerResult)}
                    options={onSwitch == 'AGENCYACTION' ? list_AGENCYACTION : onSwitch == 'AGENCYBONUS' ? list_AGENCYBONUS : list_PLAYERRESULT }
                    getOptionLabel={(option) => option.label ? option.label : ''}
                    isOptionEqualToValue={(option, value) => onSwitch == 'AGENCYACTION' ? option.id === agencyAction?.formulaID : onSwitch == 'AGENCYBONUS' ? option.id === agencyBonus?.formulaID : option.id === playerResult?.formulaID }
                    filterOptions={Fnc.filterOptions}
                    renderOption={(props, option) => (
                        <React.Fragment key={option.id}>
                            <span {...props} style={{ fontSize: onMobile ? '11px' : '12px' }}>{option.label}</span>
                            <span style={{ color: 'grey', fontSize: onMobile ? '10px' : '11px' }}> &nbsp;&nbsp;&nbsp;&nbsp;{option.description}</span>
                        </React.Fragment>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            //label={'Formula Name'}
                            variant="outlined"
                            fullWidth
                        />
                    )}
                />
                :
                    <TextField  
                        required
                        autoComplete='off'
                        error={formulaTitle?.length < 3}
                        label={"Title"} size='small'
                        value={formulaTitle}
                        fullWidth variant="outlined"
                        onChange={(e)=>setformulaTitle(Fnc.textNickname(e.currentTarget.value))}
                        onBlur={(e)=>setformulaTitle(Fnc.textSanitize(e.currentTarget.value))}
                        sx={{...Cs.TextCenter,
                            '& .MuiInputBase-input': { fontSize: onMobile ? '12px' : '' }, 
                            '& .MuiInputLabel-root': { fontSize: onMobile ? '13px' : ''   }, 
                        }}
                        />
                }
                </Grid>

                <Grid item xs={3} sm={3} md={3}>
                    <Button variant='outlined' 
                            sx={{height:'40px',borderRadius:'0',fontSize: onMobile ? '11px' : ''}}
                            fullWidth
                            onClick={()=>handleEdit()}>
                        {!formulaSave ? (onMobile ? 'ADD' : 'ADD NEW') : 'RETURN'}
                    </Button>
                </Grid>

                <Grid item  xs={12} sm={12} md={12}>
                <TextField  
                        multiline
                        autoComplete='off'
                        error={formulaValue?.length < 5}
                        disabled={!formulaSave}
                        label={formulaSave ? "Formula" : null} size='small'
                        value={formulaValue}
                        fullWidth variant="outlined"
                        onChange={(e)=>setformulaValue(Fnc.textSanitizeFormula(e.currentTarget.value),'chiprate')}
                        onBlur={(e)=>setformulaValue(Fnc.wordEquateCase(e.currentTarget.value),'chiprate')}
                        sx={{...Cs.TextCenter,
                            '& .MuiInputBase-input': { fontSize: onMobile ? '10px' : '12px' }, 
                            '& .MuiInputLabel-root': { fontSize: onMobile ? '11px' : '12px'   }, 
                        }}
                        />
                </Grid>
                        
               <Grid item xs={12} sm={12} md={12} sx={{marginTop:'-5px'}}>


                <Paper elevation={1} sx={{padding:'1px 15px 5px 15px'}} >

                <p style={{fontSize:'13px'}}>Formula calculation:</p>

                <Chip   label={<><b style={{color:'lightgray'}}>{Calculate(toCalculate,formulaValue)?.operation }</b></>} 
                        color="default" 
                        variant="outlined" 
                        size='small' 
                        sx={{fontSize: onMobile ? '11px' : '13px',color:'gray',marginTop:'-15px', borderWidth:'0px'}}/>

                <br/>

                <Chip   label={<>&nbsp; <b style={{color:'lightgray', float:'right'}}>= &nbsp;{Calculate(toCalculate,formulaValue)?.result}</b></>} 
                        color="default" 
                        variant="outlined" 
                        size='small' 
                        sx={{fontSize: onMobile ? '11px' : '13px',color:'gray',marginTop:'-10px', borderWidth:'0px'}}/>
                
                {
                onSwitch == 'AGENCYBONUS' || onSwitch == 'AGENCYACTION' 
                ?
                <>
                    <Divider />
                    <FormControlLabel
                        control={
                        <Checkbox
                            size='small'
                            checked={checkedOverride}
                            onChange={(e)=>setcheckedOverride(e.target.checked)}
                            name="acceptTerms"
                            sx={{ '&.Mui-checked': { color: checkedOverride ? 'violet' : '' } }}
                        />
                        }
                        label={<span style={{fontSize: onMobile ? '10px' : '11px', color:checkedOverride ? 'violet' : ''}}>Override values</span>}
                    />
                </>
                :
                null
                }
                </Paper>
      
            </Grid>


        </Grid>

        {
        !Fnc.isNull(itemx?.PLAYERID,0) &&  itemx?.APPID == itemx?.PLAYERAPPID &&
        <FormControlLabel
            control={
              <Checkbox
                size='small'
                checked={checkedPlayer}
                onChange={(e)=>setcheckedPlayer(e.target.checked)}
                name="acceptTerms"
                sx={{ '&.Mui-checked': { color: checkedPlayer ? 'violet' : '' } }}
              />
            }
            label={<span style={{fontSize: onMobile ? '10px' : '11px', color:checkedPlayer ? 'violet' : ''}}>Apply to all player ID: '{itemx.PLAYERID}'</span>}
          />
        }

        {
        !Fnc.isNull(itemx?.CLUBID,0) && 
        <>
        <br/>
        <FormControlLabel
            sx={{marginTop:'-10px'}}
            control={
              <Checkbox
                size='small'
                checked={checkedClub}
                onChange={(e)=>setcheckedClub(e.target.checked)}
                name="acceptTerms"
                sx={{ '&.Mui-checked': { color: checkedClub ? 'violet' : '' } }}
              />
            }
            label={<span style={{fontSize: onMobile ? '10px' : '11px', color:checkedClub ? 'violet' : ''}}>Apply to all club: {itemx.CLUB}</span>}
          />
        </>
        }

        {Fnc.JSONS(onData,false)}
        </DialogContentText>
    </DialogContent>
    
    <DialogActions style={{paddingBottom:'30px',padding:'30px',display: 'flex', justifyContent: 'center', marginTop:'-30px'}}>

            {
              checkSubmit() && !checkedPlayer && !checkedClub && (formulaSave && (formulaValue?.length < 5 || formulaTitle?.length < 3 || Calculate(toCalculate,formulaValue)?.operation == 'Invalid'))
              ?
              null
              :
              <Button sx={{...Cs.buttonClass('contained','violet'), width:'50%',borderRadius:'0',}} variant='contained' onClick={()=>handleSubmit()}>SUBMIT</Button>
            }

            <Button variant='outlined' onClick={onClose} sx={{borderRadius:'0',width:'50%'}}>CANCEL</Button>

    </DialogActions>
    </>
  );
}
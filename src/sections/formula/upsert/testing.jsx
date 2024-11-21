import React, { useState, useEffect } from 'react';

import { 
            Container,
            TextField,
            Divider,
            Chip,
            Paper,
            Grid
        } from '@mui/material';

import { Calculate } from 'src/hooks/formula-calculations'

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

// ----------------------------------------------------------------------

const defaultVal = {
                        points: 0,
                        bonus: 0,
                        rakeback: 0,
                        rebate: 0,
                        chiprate: 0,
                        playerRake: 0,
                        uplineRake: 0,
                        agencyRake: 0,
                        playerChip: 0,
                        uplineChip: 0,
                        agencyChip: 0,
                        fxUSD: 0,
                        valueA: 0,
                        valueB: 0,
                    }

export default function Testing({ RECEIVE, TYPE, EDIT, SWITCH }) {

    const onMobile = Fnc.OnMobile()
    const equate = RECEIVE
    const [numero, setNumero]                           = useState(defaultVal)
    const [equation, setEquation]                       = useState('')

    const handleInput =(i,e)=>{

        const val = e == 'rakeback' || e == 'rebate' || e == 'playerRake' || e == 'uplineRake' || e == 'agencyRake' || e == 'downlineRake' ? Fnc.numberHundred(i) : Fnc.numberDecNegatives(i)
        
        if(e == 'rakeback'){
            const upline = 100 - val
            const newArr = {...numero, [e]: val, uplineRake: upline }
            setNumero(newArr)
            localStorage.setItem('slk-formula-sample', JSON.stringify(newArr));
        } else  {
            const newArr = {...numero, [e]: val }
            setNumero(newArr)
            localStorage.setItem('slk-formula-sample', JSON.stringify(newArr));
        }

    }

    const handleBlur =(i,e)=>{

        const val = ['','-','.'].includes(i) ? 0 : i
        setNumero({...numero, [e]: val})
        localStorage.setItem('slk-formula-sample', JSON.stringify({...numero, [e]: val}));
    }


    useEffect(() => {

        const stry = JSON.parse( localStorage.getItem('slk-formula-sample') );
        setNumero(stry)

    }, [RECEIVE]);

    const inputSX = {  style: { fontSize: onMobile ? '11px' : '12px', textAlign:'center', height:'13px'} }
    const labelSX = {  style: { fontSize: onMobile ? '10px' : '12px'} }

  return (
    
    <Container>

                <Paper elevation={2} component="section" sx={{  border: '0px dashed grey', padding:'15px' }}>

                    <p style={{fontSize: onMobile ? '13px' : '16px', marginTop:'-2px', marginBottom:'5px'}}>
                        TEST VALUES:
                    </p>

                    <Divider/>

                    <Grid container spacing={{ sm: 2, md:2 }} sx={{p:2,marginTop:'3px'}} columns={{ xs:15, sm: 15, md: 15 }}>

                        <Grid item xs={5} sm={5} md={3} sx={{p:1}}>
                            <TextField  label={"POINTS"} 
                                        size='small'
                                        autoComplete='off'
                                        value={numero && !Fnc.isNull(numero.points) ? numero.points : ''}
                                        onChange={(e)=>handleInput(e.currentTarget.value,'points')} 
                                        onBlur={(e)=>handleBlur(e.currentTarget.value,'points')}
                                        inputProps={inputSX}
                                        InputLabelProps={labelSX}
                                        />
                        </Grid>

                        <Grid item xs={5} sm={5} md={3} sx={{p:1}}>
                            <TextField  label={"BONUS"} 
                                        size='small'
                                        autoComplete='off'
                                        value={numero && !Fnc.isNull(numero.bonus) ? numero.bonus: ''}
                                        onChange={(e)=>handleInput(e.currentTarget.value,'bonus')}
                                        onBlur={(e)=>handleBlur(e.currentTarget.value,'bonus')}
                                        inputProps={inputSX}
                                        InputLabelProps={labelSX}
                                         />
                        </Grid>

                        <Grid item xs={5} sm={5} md={3}  sx={{p:1}}>
                            <TextField  label={"RAKEBACK DEAL"} 
                                        size='small'
                                        autoComplete='off'
                                        value={numero && !Fnc.isNull(numero.rakeback) ? numero.rakeback: ''}
                                        onChange={(e)=>handleInput(e.currentTarget.value,'rakeback')}
                                        onBlur={(e)=>handleBlur(e.currentTarget.value,'rakeback')}
                                        inputProps={inputSX}
                                        InputLabelProps={labelSX}
                                         />
                        </Grid>

                        <Grid item xs={5} sm={5} md={3} sx={{p:1}}>
                            <TextField  label={"REBATE DEAL"} 
                                        size='small'
                                        autoComplete='off'
                                        value={numero && !Fnc.isNull(numero.rebate) ? numero.rebate: ''}
                                        onChange={(e)=>handleInput(e.currentTarget.value,'rebate')}
                                        onBlur={(e)=>handleBlur(e.currentTarget.value,'rebate')}
                                        inputProps={inputSX}
                                        InputLabelProps={labelSX}
                                         />
                        </Grid>

                        <Grid item xs={5} sm={5} md={3} sx={{p:1}}>
                            <TextField  label={"FX RATE (USD)"} 
                                        size='small'
                                        autoComplete='off'
                                        value={numero && !Fnc.isNull(numero.fxUSD) ? numero.fxUSD: ''}
                                        onChange={(e)=>handleInput(e.currentTarget.value,'fxUSD')}
                                        onBlur={(e)=>handleBlur(e.currentTarget.value,'fxUSD')}
                                        inputProps={inputSX}
                                        InputLabelProps={labelSX}
                                         />
                        </Grid>

                        <Grid item xs={5} sm={5} md={3} sx={{p:1}}>
                            <TextField  label={"PLAYER RAKEBACK"} 
                                        size='small'
                                        autoComplete='off'
                                        value={numero && !Fnc.isNull(numero.playerRake) ? numero.playerRake: ''}
                                        onChange={(e)=>handleInput(e.currentTarget.value,'playerRake')}
                                        onBlur={(e)=>handleBlur(e.currentTarget.value,'playerRake')}
                                        inputProps={inputSX}
                                        InputLabelProps={labelSX}
                                         />
                        </Grid>

                        <Grid item xs={5} sm={5} md={3} sx={{p:1}}>
                            <TextField  label={"AGENCY RAKEBACK"} 
                                        size='small'
                                        autoComplete='off'
                                        value={numero && !Fnc.isNull(numero.agencyRake) ? numero.agencyRake: ''}
                                        onChange={(e)=>handleInput(e.currentTarget.value,'agencyRake')}
                                        onBlur={(e)=>handleBlur(e.currentTarget.value,'agencyRake')}
                                        inputProps={inputSX}
                                        InputLabelProps={labelSX}
                                         />
                        </Grid>

                        <Grid item xs={5} sm={5} md={3} sx={{p:1}}>
                            <TextField  label={"UPLINE RAKEBACK"} 
                                        size='small' 
                                        autoComplete='off'
                                        value={numero && !Fnc.isNull(numero.uplineRake) ? numero.uplineRake: ''} 
                                        onChange={(e)=>handleInput(e.currentTarget.value,'uplineRake')}
                                        onBlur={(e)=>handleBlur(e.currentTarget.value,'uplineRake')}
                                        inputProps={inputSX}
                                        InputLabelProps={labelSX}
                                         />
                        </Grid>

                        <Grid item xs={0} sm={0} md={6} sx={{p:1}}> </Grid>

                        <Grid item xs={5} sm={5} md={3} sx={{p:1}}>
                            <TextField  label={"CHIPRATE"} 
                                        size='small'
                                        autoComplete='off'
                                        value={numero && !Fnc.isNull(numero.chiprate) ? numero.chiprate: ''}
                                        onChange={(e)=>handleInput(e.currentTarget.value,'chiprate')}
                                        onBlur={(e)=>handleBlur(e.currentTarget.value,'chiprate')}
                                        inputProps={inputSX}
                                        InputLabelProps={labelSX}
                                         />
                        </Grid>

                        <Grid item xs={5} sm={5} md={3} sx={{p:1}}>
                            <TextField  label={"PLAYER CHIP RATE"} 
                                        size='small'
                                        autoComplete='off'
                                        value={numero && !Fnc.isNull(numero.playerChip) ? numero.playerChip: ''}
                                        onChange={(e)=>handleInput(e.currentTarget.value,'playerChip')}
                                        onBlur={(e)=>handleBlur(e.currentTarget.value,'playerChip')}
                                        inputProps={inputSX}
                                        InputLabelProps={labelSX}
                                         />
                        </Grid>

                        <Grid item xs={5} sm={5} md={3} sx={{p:1}}>
                            <TextField  label={"AGENCY CHIP CUT"} 
                                        size='small'
                                        autoComplete='off'
                                        value={numero && !Fnc.isNull(numero.agencyChip) ? numero.agencyChip: ''}
                                        onChange={(e)=>handleInput(e.currentTarget.value,'agencyChip')}
                                        onBlur={(e)=>handleBlur(e.currentTarget.value,'agencyChip')}
                                        inputProps={inputSX}
                                        InputLabelProps={labelSX} />
                        </Grid>

                        <Grid item xs={5} sm={5} md={3} sx={{p:1}}>
                            <TextField  label={"UPLINE CHIP CUT"} 
                                        size='small' 
                                        autoComplete='off'
                                        value={numero && !Fnc.isNull(numero.uplineChip) ? numero.uplineChip: ''} 
                                        onChange={(e)=>handleInput(e.currentTarget.value,'uplineChip')}
                                        onBlur={(e)=>handleBlur(e.currentTarget.value,'uplineChip')}
                                        inputProps={inputSX}
                                        InputLabelProps={labelSX} />
                        </Grid>

                        <Grid item xs={0} sm={0} md={3} sx={{p:1}}> </Grid>

                        <Grid item xs={5} sm={5} md={3} sx={{p:1}}>
                            <TextField  label={"VALUE A"} 
                                        size='small' 
                                        autoComplete='off'
                                        value={numero && !Fnc.isNull(numero.valueA) ? numero.valueA: ''} 
                                        onChange={(e)=>handleInput(e.currentTarget.value,'valueA')}
                                        onBlur={(e)=>handleBlur(e.currentTarget.value,'valueA')}
                                        inputProps={inputSX}
                                        InputLabelProps={labelSX} />
                        </Grid>

                        <Grid item xs={5} sm={5} md={3} sx={{p:1}}>
                            <TextField  label={"VALUE B"} 
                                        size='small' 
                                        autoComplete='off'
                                        value={numero && !Fnc.isNull(numero.valueB) ? numero.valueB: ''} 
                                        onChange={(e)=>handleInput(e.currentTarget.value,'valueB')}
                                        onBlur={(e)=>handleBlur(e.currentTarget.value,'valueB')}
                                        inputProps={inputSX}
                                        InputLabelProps={labelSX} />
                        </Grid>

                        <Grid item xs={15} sm={15} md={15} sx={{  border: '1px solid  grey', marginTop:'10px', fontSize: onMobile ? '12px' : '15px'}} p={2}>
                            


                            <span style={{color:'lightgray'}}>
                            Operation:
                            </span> 
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <b style={{color:'green', }}>
                                {Calculate(numero,equate).operation  != 'Invalid' ? Calculate(numero,equate).operation : 'Invalid! Please check formula.'}
                            </b>

                            <Divider style={{marginTop:'5px', marginBottom:'5px'}} />

                            <span style={{color:'lightgray'}}>
                            Result:
                            </span> 
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Chip   label={Calculate(numero,equate).result ? Calculate(numero,equate).result: ''} 
                                    variant="filled" color={Calculate(numero,equate).formula  != 'Invalid' ? 'success' : 'default'} 
                                    style={{fontSize: onMobile ? '13px' : '16px',fontWeight:'700',minWidth:'100px',borderRadius:'2px'}} 
                                    size='small' />
    
                        </Grid>

                    </Grid>
                </Paper>

    {
   // <pre>{JSON.stringify(numero,null,2)}</pre>
    }

    </Container>
  );
}


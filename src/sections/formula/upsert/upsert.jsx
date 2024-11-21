import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { UpsertDATA, UpsertLINK } from 'src/hooks/upsert/upsert-data'

import Grid from '@mui/material/Unstable_Grid2';
import { Box,Stack,Container,Button,TextField,InputAdornment,Fade,IconButton, Divider,Chip,Autocomplete,Paper } from '@mui/material';
import { Icon } from '@iconify/react';
import { evaluate,parse } from 'mathjs';
import {Alerting} from 'src/items/alert_snack/'
import { Calculate } from 'src/hooks/formula-calculations'
import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'
// ----------------------------------------------------------------------

const DDownType =   [
                        {id: 0, value: 'AGENCY BONUS', label: 'AGENCY BONUS'},
                        {id: 1, value: 'AGENCY ACTION', label: 'AGENCY ACTION'},
                        {id: 2, value: 'PLAYER RESULT', label: 'PLAYER RESULT'}
                    ]

export default function UpsertFormula({ DATA, EDIT, RETURN, REFRESH, SWITCH}) {

    const onMobile = Fnc.OnMobile()

    const [onSubmitting, setonSubmitting]                   = useState(false)
    const [onEditing, setonEditing]                         = useState('')
    const [data, setData]                                   = useState({})
    const [formulas, setFormulas]                           = useState(null)

    const [equate, setEquate]                                   = useState('')
    const [oldEquate, setoldEquate]                             = useState('')
    const [type, setType]                                       = useState(null)
    const [remarks, setRemarks]                                 = useState('')
    const [title, setTitle]                                     = useState('')
    const [IDD, setIDD]                                         = useState('')

    const [onAlert, setonAlert]   = useState({onOpen: 0, severity: '', message: ''});

    const seeFORMULA = DATA.data.map( (e, index)=> { 
                                            return {    id:                     e.id,  
                                                        value:                  e.id, 
                                                        label:                  e.name, 
                                                        description:            e.type, 
                                                        formula:                e.formula,
                                                        type:                   e.type,
                                                        name:                   e.name,
                                                        note:                   e.note,
                                                        } 
                                        } 
                                    )

    const changeFormula =(i)=>{
        if(i){
            setFormulas(i)
            setEquate(i?.formula)
            setoldEquate(i?.formula)
            RETURN(i?.formula)
            setIDD(i?.id)
            setTitle(i?.name)
            setRemarks(i?.note)
            setType(DDownType?.find((e)=>e?.value == i?.type))
        } else {
            setFormulas(null)  
            RETURN(equate ? equate : '')
        }
    }

    const onModifying =(i)=>{
        if(i){
            setonEditing('old')
            setFormulas(i)
            setEquate(i?.formula)
            setoldEquate(i?.formula)
            RETURN(i?.formula)
            setIDD(i?.id)
            setTitle(i?.name)
            setRemarks(i?.note)
            setType(DDownType?.find((e)=>e?.value == i?.type)) 
        }
    }

    const onAdding =()=>{
        setonEditing('new')
        setTitle('')
        setRemarks('')
        setType('')
        setIDD('')
        setoldEquate('')
    }

    const isValid = Calculate(data,equate).formula  != 'Invalid' ? true : false

    const checkBlanks = title.length > 0 && !Fnc.isNull(type?.value) && equate?.length > 0 && isValid ? true : false

    const onChecking =(i,e)=>{

        const newArr = {    
                            id:         IDD,
                            type:       type ? type.value : '',
                            name:       title,
                            formula:    equate,
                            oldFormula: oldEquate,
                            note:       remarks,
                            status:     0,
                            action:     'upsert',
                            what:       'formula',
                        }

        if(checkBlanks){
            onSubmit(newArr)
        }

    }


    async function onSubmit(i) {  
        setonSubmitting(true)
        try {
          
          const response = await axios.post(UpsertLINK(i.what,'upload'),UpsertDATA({ JSONData: [i] }));
          
          const feed =  response.data;
          const submitted = Fnc.isSubmitted(feed,i)

          const isSuccess = submitted.status == 'Added' || submitted.status == 'Replaced' || submitted.status == 'Removed' ? true : false

          if(isSuccess){
              setonAlert({onOpen: Fnc.numRandom(), severity: 'success', message: submitted.status})
              onReset()
              REFRESH(Fnc.numRandom)
          } else {
              setonAlert({onOpen: Fnc.numRandom(), severity: 'error', message: submitted.status})
          }
          setonSubmitting(false)
        } catch (error) {
            setonAlert({onOpen: Fnc.numRandom(), severity: 'error', message: 'Something went wrong'})
            setonSubmitting(false)
        }

    }   

    const onReset =(i)=>{
        setIDD('')
        setTitle('')
        setRemarks('')
        setType(null)
        setonEditing('')
        setFormulas(null)
        setEquate('')
        setoldEquate('')
    }

    useEffect(() => {

        if(!Fnc.isNull(EDIT)){
            setFormulas(seeFORMULA?.find((e)=>e?.id == EDIT?.id))
            setTitle(EDIT?.name)
            setRemarks(EDIT?.note)
            setEquate(EDIT?.formula)
            setoldEquate(EDIT?.formula)
            setIDD(EDIT?.id)
            setType(DDownType?.filter((e)=>e?.value == EDIT?.type))
        }

        if(SWITCH == 'add_formula'){
            setonEditing('new')
            setTitle('')
            setRemarks('')
            setType('')
            setIDD('')
            setoldEquate('')
            setEquate('')
            console.log('sa')
        } else {
            setonEditing('')
        }

        const stry = JSON.parse( localStorage.getItem('slk-formula-sample') );
        setData(stry)
        setonSubmitting(false)

    }, [EDIT,SWITCH]);


    const inputSX = { 
                        '& .MuiInputBase-input': { fontSize: onMobile ? '11px' : '13px' }, 
                        '& .MuiInputLabel-root': { fontSize: onMobile ? '12px' : '',   }, 
                    }

    const enableEdit = Fnc.isNull(formulas?.id) ? true : formulas?.label == 'STANDARD' ? true : false



  return (
    
    <Container>

        <Grid container spacing={{ sx: 1, sm: 2, md:2 }} padding={{sx: 1, sm: 1, md: 2}} columns={{ xs:12, sm: 12, md: 12 }}>

            {
            onEditing == '' 
            ?
            <Grid xs={12} sm={12} md={12} p={1} >

                <Autocomplete
                    value={formulas} 
                    size='small'
                    onChange={(event, newValue) =>changeFormula(newValue)}
                    options={seeFORMULA}
                    getOptionLabel={(option) => option.label ? option.label : ''}
                    isOptionEqualToValue={(option, player) => option.id === player?.id}
                    filterOptions={Fnc.filterOptions}
                    fullWidth
                    renderOption={(props, option) => (
                    <React.Fragment key={option.id}>
                        <span {...props} style={{fontSize:'12px'}}>
                            {option.label}
                            &nbsp; &nbsp;
                            <Chip label={option.description} size='small' sx={{color:'lightgray',fontSize:'10px',}}/>  
                        </span>
                        <i style={{ fontSize: '11px', color: 'gray', paddingLeft:'16px'}}>{option.formula}</i>
                    </React.Fragment>
                    )}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label={ formulas ? Fnc.wordTitleCase(formulas.type)+' Formula' :"Select a formula to test"}
                        variant="outlined"
                        sx={{...inputSX, width:'100%'}}
                    />
                    )}
                />
 

            </Grid>
            : 
            <>
            <Grid xs={6} sm={6} md={3} p={1}>
                <TextField  label={"Title"} 
                            size='small' 
                            autoComplete='off'
                            error={!title || title == 'STANDARD' ? true : false}
                            value={title} 
                            fullWidth
                            onChange={(e)=>setTitle(Fnc.textSanitize(e.currentTarget.value))} 
                            sx={inputSX}/>
            </Grid>

            <Grid xs={6} sm={6} md={4} p={1}>
            <Autocomplete
                value={type ? type : null} 
                size='small'
                onChange={(event, newValue) =>setType(newValue)}
                options={DDownType}
                getOptionLabel={(option) => option.label ? option.label : ''}
                isOptionEqualToValue={(option, type) => option.id === type.id}
                filterOptions={Fnc.filterOptions}
                renderOption={(props, option) => (
                    <React.Fragment key={option.id}>
                      <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
                    </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Fnc.isNull(type) ? true : false}
                    label={ "Type"}
                    variant="outlined"
                    fullWidth
                    sx={inputSX}
                  />
                )}
              />
            </Grid>

            <Grid xs={12} sm={12} md={5} p={1}>
                <TextField  label={"Remarks"}
                            size='small' 
                            autoComplete='off'
                            value={remarks} 
                            fullWidth
                            onChange={(e)=>setRemarks(Fnc.textSanitize(e.currentTarget.value))} 
                            sx={inputSX}/>
            </Grid>
            </>
            
            }
            <Grid xs={12} sm={12} md={12} p={1}>
                <TextField  label={"Formula"} 
                            autoComplete='off'
                            error={!equate ? true : false}
                            value={equate} 
                            fullWidth
                            onChange={(e)=>{setEquate(e.currentTarget.value),RETURN(e.currentTarget.value)}}
                            onBlur={(e)=>{setEquate(Fnc.wordEquateCase(e.currentTarget.value)),RETURN(Fnc.wordEquateCase(e.currentTarget.value))}}
                            sx={inputSX}
                            />
            </Grid>

            <Grid xs={12} sm={12} md={12} p={1}>
            {
            onEditing == '' ? 
            <>
                    <Button variant='outlined' 
                            disabled={enableEdit}
                            onClick={()=>onModifying(formulas)}
                            sx={{...Cls.buttonClass('outlined','violet'),borderRadius:'0', minWidth:'100px'}}>Edit</Button>
                    &nbsp;
                    <Button variant='outlined' 
                            disabled={equate?.length == 0}
                            onClick={()=>onAdding()}
                            sx={{...Cls.buttonClass('outlined','violet'),borderRadius:'0', minWidth:'100px'}}>Add as New</Button>
            </>
            :
            <>
                    <Button variant='contained' 
                            sx={{...Cls.buttonClass("contained",'violet'), fontSize: onMobile ? '11px' : '',borderRadius:'0'}}
                            disabled={!checkBlanks || onSubmitting} 
                            onClick={()=>onChecking()}>
                    { onSubmitting ? 'Submitting...': !checkBlanks ? 'Incomplete' : onEditing =='old' ? 'Update Formula' : "Save New Formula"}
                    </Button>

                    &nbsp;

                    <Button variant='filled' 
                            color='default' 
                            sx={{fontSize: onMobile ? '11px' : '',borderRadius:'0'}} 
                            onClick={()=>setonEditing('')}>
                        Cancel
                    </Button>
            </>
            }

            </Grid>

            <Alerting onOpen={onAlert.onOpen} severity={onAlert.severity} title={onAlert.title} message={onAlert.message} />

        </Grid>
    {
    //<pre>{JSON.stringify(EDIT,null,2)}</pre>
    }

    </Container>
  );
}


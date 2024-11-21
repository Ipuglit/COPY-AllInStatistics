import React, { useEffect, useState, useRef  } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { 
            Button, 
            TextField,
            Dialog,
            DialogTitle,
            DialogContent,
            DialogActions,
            Grid,
            Typography,
            Box,
            Alert,
            Table,
            TableHead,
            TableCell,
            TableBody,
            TableRow,
            Collapse,
            Chip,
            Tooltip,
            IconButton
        } from '@mui/material';



import { UpsertDATA, LinkUPLOAD } from 'src/hooks/upsert/upsert-data'

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'
import { TableBar } from '@mui/icons-material';

const expectedKeys = ['NICKNAME', 'USERNAME','PASSWORD','STATUS', 'FIRSTNAME', 'LASTNAME','EMAIL','TELEGRAM','ROLE'];

export default function UploadingExcel({DATA,ITEMS,ALERT}) {
    const fileInputRef                              = useRef(null);
    const onMobile                                  = Fnc.OnMobile()
    const today                                     = new Date().toISOString().split('T')[0];;
    const [open,setOpen]                            = useState(false)
    const [onSubmitLoad,setonSubmitLoad]            = useState(false)
    const [onUploading,setonUploading]             = useState(false)
    const [onAlert,setonAlert]                      = useState(false)

    const [jsonData, setJsonData]                   = useState(null);
    const [error, setError]                         = useState(null);
    const [keyError, setKeyError]                   = useState(null);
    const [fieldError, setfieldError]               = useState(null);
  
    const checkData     = !Fnc.isNull(jsonData,0)

    const resetUpload =()=>{
        setJsonData(null)
        setError(null)
        setKeyError(null)
        setfieldError(null)
        setOpen(false)
        setonSubmitLoad(false)
    }

    const reUpload =()=>{
        setJsonData(null)
        setError(null)
        setKeyError(null)
        setfieldError(null)
        setonSubmitLoad(false)
        setonUploading(false)
    }

    const resetInput = () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };

    const hideAlert =(i)=>{
        setonAlert(true)
        setonUploading(false)
        const T = setTimeout(() => {
            setonAlert(false)
        }, 2500);
        return () => clearTimeout(T);
    }

    const handleRemove = (index) => {
        const newTableData = [...jsonData];
        newTableData.splice(index, 1);
        setJsonData(newTableData);
      };

    const handleFileChange = (event) => {
      setonUploading(true)
      const file = event.target.files[0];
      if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1});
          const keys = json[0]; // First row as keys
          const result = json.slice(1).map(row => {
            return keys.reduce((acc, key, index) => {
              acc[key] = row[index];
              return acc;
            }, {});
          });

          const isValidKeys     = keys.every(key => expectedKeys.includes(key));
          const filteredResult  = result.filter(item => item['NICKNAME'] && item['USERNAME'] && item['PASSWORD']);
          const reFill = filteredResult?.map((i)=>{
            return {
                        ...i,
                        USERNAME:   i.USERNAME ? Fnc.wordPassword(i.USERNAME) : '',
                        PASSWORD:   i.PASSWORD ? Fnc.wordPassword(i.PASSWORD) : '',
                        FIRSTNAME:  i.FIRSTNAME ? i.FIRSTNAME : '',
                        LASTNAME:   i.LASTNAME ? i.LASTNAME : '',
                        EMAIL:      i.EMAIL ? i.EMAIL : '',
                        TELEGRAM:   i.TELEGRAM ? i.TELEGRAM : '',
                        ROLE:       ['PLAYER', 'CASH ADMIN', 'CLIENT'].includes(String(i.ROLE).toUpperCase()) ? i.ROLE : 'PLAYER',
                        STATUS:     i.STATUS?.toUpperCase() == 'ACTIVE' ? '0' : i.STATUS?.toUpperCase() == 'PENDING' ? '1' : '2',
                    }
            })

        if (!isValidKeys) {
            setKeyError(`Invalid template.`);
            setJsonData(null)
            hideAlert()
            const T = setTimeout(() => {
                setJsonData(null)
                setError(null)
                setKeyError(null)
                setfieldError(null)
            }, 3000);
            return () => clearTimeout(T);
        } else if (reFill?.length == 0) {
                setKeyError(`Empty template.`);
                setJsonData(null)
                hideAlert()
                const T = setTimeout(() => {
                    setJsonData(null)
                    setError(null)
                    setKeyError(null)
                    setfieldError(null)
                }, 3000);
                return () => clearTimeout(T);
        } else if (reFill.length < result.length) {
            setfieldError('Excluded empty "NICKNAME", "USERNAME" or "PASSWORD".');
            hideAlert()
        } else {
            setfieldError(null);
            setKeyError(null);
        }
            
          setJsonData(reFill);
          setError(null);
        };
        reader.readAsArrayBuffer(file);
      } else {
        setError('Please upload a valid Excel file.');
        hideAlert()
        setJsonData(null);
        setKeyError(null);
        setfieldError(null);
      }
    };

    async function onSubmitting() {
    
        setonSubmitLoad(true)
        
        const newDATA = jsonData?.map((i)=>{
            return {
                        id:                 '0',
                        userNick:           Fnc.textSanitize(i.NICKNAME),
                        userFirstName:      Fnc.textSanitize(i.FIRSTNAME),
                        userLastName:       Fnc.textSanitize(i.LASTNAME),
                        userUsername:       Fnc.textSanitize(i.USERNAME),
                        userPassword:       Fnc.textSanitize(i.PASSWORD),
                        userEmail:          Fnc.textSanitize(i.EMAIL),
                        userTelegram:       Fnc.textSanitize(i.TELEGRAM),
                        userRoleID:         i.ROLE == 'CASH ADMIN' ? '4' : i.ROLE == 'CLIENT' ? '5' : '1',
                        status:             i.STATUS,
                    }
            })

        try {
  
          const response = await axios.post(LinkUPLOAD('users'),UpsertDATA({JSONData: newDATA}));
          const feed =  response.data;
            console.log(feed)
          if(feed?.hitsList?.length > 0){
            const dupData = jsonData?.filter(ii => feed?.hitsList?.includes(ii.USERNAME));
            setJsonData(dupData)
            setonSubmitLoad(false)
          }

          if( feed.added >= 1 && feed.hits == 0 ){
            
            ALERT( 'success', feed?.added+' Added!', false )
            const T = setTimeout(() => {
                resetUpload()
            }, 2500);
            return () => clearTimeout(T);

          } else if( feed.added >= 1 && feed.hits > 0 ){
            
            ALERT( 'success', feed?.added+' Added! '+(feed?.hits > 1 ? feed?.hits+' Duplicate usernames' : feed?.hits+' Duplicate usernames'), false )

          } else if( feed.added == 0 && feed.hits > 0 ){
            
            ALERT( 'warning', feed?.hits > 1 ? feed?.hits+' Duplicate usernames!' : feed?.hits+' Duplicate username!', false )

          } else {
  
            ALERT( 'error', 'Please try again', true )
            setonSubmitLoad(false)

          }
  
        } catch (error) {
  
          ALERT( 'error', 'Please try again', true )
          setonSubmitLoad(false)

        }
      }

    const handledInput =(i,ndx,set)=>{
        setJsonData((e) =>
            e.map((x, z) =>
              z === ndx ? { ...x, [set]: i } : x
            )
          );
    }
    
    const handledStatus =(i,ndx,set)=>{
        const val = i == 0 ? 1 : i == 1 ? 2 : 0
        setJsonData((e) =>
            e.map((x, z) =>
              z === ndx ? { ...x, [set]: val } : x
            )
          );
    }

    const checkUsernames = jsonData?.every(w => w.USERNAME.length > 4 && w.NICKNAME.length > 4 && w.PASSWORD.length > 4)

    const checkThis =(i) => jsonData?.every(w => w?.[i]?.length > 4 )

    useEffect(()=>{
        setOpen(DATA?.modal ? DATA?.modal : false)
    },[DATA])

    return (
    <Dialog open={open} fullWidth maxWidth='md'>

        {
            checkData &&
        <DialogTitle sx={{ m: 1, p: 1 }} id="customized-dialog-title">
          <Typography variant="h6" component="div" margin={1}>
            CONVERTED FILE
            <span style={{}}  onClick={()=>reUpload()}>
                <Tooltip title='Re-upload excel'>
                    <Icon icon="entypo:upload" color='violet' width={30} style={{marginBottom:'-3px',float:'right'}}/>
                </Tooltip>
            </span>
          </Typography>
        </DialogTitle>
        }

        <DialogContent>

        <Grid container  padding={{ xs: 1, sm: 2, md: 3 }} spacing={{ xs: 2, sm: 2, md: 2 }}>

            <Grid item xs={12} sm={12} md={12} hidden={!checkData ? false : true}>
                <Box  component="form"
                        sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: 4,
                        marginBottom: '-30px',
                        marginTop: '-30px',
                        }} >
                <input
                accept=".xlsx, .xls"
                style={{ display: 'none' }}
                id="excel-upload"
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef}
                />
                <label htmlFor="excel-upload">
                <Button variant="contained" 
                        component="span" 
                        onClick={resetInput}
                        sx={{fontSize:'13px',height:'120px', width:'120px',borderRadius:'100%',...Cs.buttonClass('contained','violet')}}>
                    <span style={{marginBottom:'-10px'}}>
                        Upload File
                    </span>
                </Button>
                </label>

                <Chip   size='small'
                        label="Template"
                        onDelete={()=>{}}
                        onClick={()=>Fnc.downloadFile('/csv/','Users-Template.xlsx')}
                        sx={{'&:hover': { cursor: 'pointer' },border: '1px none violet', marginTop:'10px', marginBottom:'-15px'}}
                        deleteIcon={<Icon icon="line-md:download-outline-loop" color='violet' width={'25'} />}
                        variant="outlined"
                        />

                </Box>
                    
            </Grid>

                <Grid item xs={12} sm={12} md={12}>
                    <Collapse in={onAlert} > 
                    {error && 
                        <Alert severity="error" sx={{fontSize: onMobile ? '11px' : '', width:'100%',textAlign: 'center'}}>
                            {error}
                        </Alert>}
                    {keyError && 
                        <Alert severity="warning" sx={{fontSize: onMobile ? '11px' : '', width:'100%',textAlign: 'center'}}>
                            {keyError}
                        </Alert>}
                    {fieldError && 
                        <Alert severity="warning" sx={{fontSize: onMobile ? '11px' : '', width:'100%',textAlign: 'center'}}>
                            {fieldError}
                        </Alert>}

                        </Collapse>
                </Grid>

            { checkData && !keyError && !error &&
            <Grid item xs={12} sm={12} md={12}  sx={{marginTop:'-20px'}}>
                <Table size='small'>
                    <TableHead >
                        <TableRow >
                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px', width:'20px'}}>
                                
                            </TableCell>
                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px', width:'20px'}}>
                                
                            </TableCell>
                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px', minWidth:'140px', color: !checkThis('NICKNAME') ? '#ff4554' : '',fontWeight: !checkThis('NICKNAME') ? '700' : ''}}>
                                NICKNAME *
                            </TableCell>
                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px', minWidth:'140px', color: !checkThis('USERNAME') ? '#ff4554' : '',fontWeight: !checkThis('USERNAME') ? '700' : ''}}>
                                USERNAME *
                            </TableCell>
                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px', minWidth:'140px', color: !checkThis('PASSWORD') ? '#ff4554' : '',fontWeight: !checkThis('PASSWORD') ? '700' : ''}}>
                                PASSWORD *
                            </TableCell>
                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px', minWidth:'130px'}}>
                                NAME
                            </TableCell>
                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px', minWidth:'100px'}}>
                                CONTACTS
                            </TableCell>
                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px', minWidth:'100px'}}>
                                STATUS
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            jsonData?.map((i,index)=>{
                                const sxxs = {fontSize: onMobile ? '10px' : '11px',minWidth:'78px'};

                                return  <TableRow key={index}>

                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px',maxWidth:'10px',}}> 
                                                <Icon   icon={'ep:remove-filled'} 
                                                        width={20} 
                                                        color='#ff4554' 
                                                        style={{cursor:'pointer', marginBottom:'-5px'}}
                                                        onClick={()=>handleRemove(index)}
                                                        /> 
                                            </TableCell>

                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px'}}> 
                                                {index+1}
                                            </TableCell>

                                            <TableCell sx={sxxs}> 
                                                <TextField
                                                    value={i.NICKNAME}
                                                    onChange={(e)=>handledInput(Fnc.wordNickname(e.target.value),index,'NICKNAME')}
                                                    variant="outlined"
                                                    size='small'
                                                    inputProps={{  maxLength: 20, style: { 
                                                                                            fontSize: onMobile ? '11px' : '11.5px',
                                                                                            border: 'none',
                                                                                            color:          i.NICKNAME.length < 5 ? '#ff4554' : '',
                                                                                            fontWeight:     i.NICKNAME.length < 5 ? '700':'100'
                                                                                          } }}
                                                    sx={{'& .MuiOutlinedInput-notchedOutline': { border: 'none'},maxWidth: !onMobile ?  '110px' : '100%'}}
                                                />
                                            </TableCell>

                                            <TableCell sx={sxxs}> 
                                                <TextField
                                                    value={i.USERNAME}
                                                    onChange={(e)=>handledInput(Fnc.wordPassword(e.target.value),index,'USERNAME')}
                                                    variant="outlined"
                                                    size='small'
                                                    inputProps={{  maxLength: 20, style: { 
                                                                                            fontSize: onMobile ? '11px' : '11.5px',
                                                                                            border: 'none',
                                                                                            color:          i.USERNAME.length < 5 ? '#ff4554' : '',
                                                                                            fontWeight:     i.USERNAME.length < 5 ? '700':'100',
                                                                                          } }}
                                                    sx={{'& .MuiOutlinedInput-notchedOutline': { border: 'none'},maxWidth: !onMobile ?  '110px' : '100%'}}
                                                />
                                            </TableCell>
                                            <TableCell sx={sxxs}>  
                                                <TextField
                                                    value={i.PASSWORD}
                                                    onChange={(e)=>handledInput(Fnc.wordPassword(e.target.value),index,'PASSWORD')}
                                                    variant="outlined"
                                                    size='small'
                                                    inputProps={{  maxLength: 20, style: { 
                                                                                            fontSize: onMobile ? '11px' : '11.5px',
                                                                                            border: 'none',
                                                                                            color:          i.PASSWORD.length < 5 ? '#ff4554' : '',
                                                                                            fontWeight:     i.PASSWORD.length < 5 ? '700':'100'
                                                                                          } }}
                                                    sx={{'& .MuiOutlinedInput-notchedOutline': { border: 'none'},maxWidth: !onMobile ?  '110px' : '100%'}}
                                                />
                                            </TableCell>
                                            <TableCell sx={sxxs}>  
                                                {i.FIRSTNAME}  {i.LASTNAME} 
                                            </TableCell>
                                            <TableCell sx={sxxs}>  
                                                <Tooltip title={i.EMAIL ? i.EMAIL : 'No email'}>
                                                    <Icon icon="basil:gmail-outline" color= {i.EMAIL ? 'orange' : 'gray'} width={25}/>
                                                </Tooltip>
                                                &nbsp;&nbsp;
                                                <Tooltip title={i.TELEGRAM ? i.TELEGRAM : 'No telegram'}>
                                                    <Icon icon="lineicons:telegram" color= {i.TELEGRAM ?'#0088cc' : 'gray'} width={25}/>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell sx={sxxs} onClick={()=>handledStatus(i.STATUS,index,'STATUS')} style={{cursor:'pointer'}}>  
                                                {i.STATUS == 0 ? 'Active' : i.STATUS == 1 ? 'Pending' : 'Inactive'}
                                            </TableCell>
                                        </TableRow>
                            })
                        }

                    </TableBody>
                </Table>

            </Grid>
            }

        </Grid>

        <div>





      </div>
      {Fnc.JSONS(jsonData,false)}

        </DialogContent>

        <DialogActions style={{padding:'20px', marginTop:'-15px',display: 'flex', justifyContent: 'center'}}>
                {
                    checkData && checkUsernames &&
                  <Button onClick={()=>onSubmitting()} 
                          disabled={onSubmitLoad}
                          sx={{...Cs.buttonClass('contained','violet'), width:onSubmitLoad ? '100%': '50%',borderRadius:'0',fontSize: onMobile ? '11px' : ''}} 
                          startIcon={!onSubmitLoad ? '' : <Icon icon="eos-icons:loading"/>}
                          variant='contained'>
                          {onSubmitLoad ? 'SUBMITTING' : 'SUBMIT'} 
                  </Button>
                }
                {
                    !onSubmitLoad &&
                <Button onClick={()=>resetUpload()} 
                        sx={{borderRadius:'0',width:'50%',fontSize: onMobile ? '11px' : ''}} 
                        disabled={onUploading && jsonData == null}
                        variant='outlined' loading='true' >
                           {onUploading && jsonData == null ? 'LOADING...' : 'CANCEL'} 
                </Button>
                }


        </DialogActions>
    </Dialog>

    );
};


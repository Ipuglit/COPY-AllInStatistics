import React, { useEffect, useState, useRef } from 'react';
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
            Autocomplete
        } from '@mui/material';



import { UpsertDATA, LinkUPLOAD } from 'src/hooks/upsert/upsert-data'

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'
import { TableBar } from '@mui/icons-material';

const expectedKeys = ['ID', 'NAME', 'APPLICATION','UNION','STATUS'];

export default function UploadingExcel({DATA,ITEMS,ALERT}) {
    const fileInputRef                              = useRef(null);
    const onMobile                                  = Fnc.OnMobile()
    const today                                     = new Date().toISOString().split('T')[0];;
    const [open,setOpen]                            = useState(false)
    const [onUploading,setonUploading]              = useState(false)
    const [onSubmitLoad,setonSubmitLoad]            = useState(false)
    const [onAlert,setonAlert]                      = useState(false)

    const [jsonData, setJsonData]                   = useState(null);
    const [error, setError]                         = useState(null);
    const [keyError, setKeyError]                   = useState(null);
    const [fieldError, setfieldError]   = useState(null);
  
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
        setonUploading(false)
        setonAlert(true)
        const T = setTimeout(() => {
            setonAlert(false)
        }, 2500);
        return () => clearTimeout(T);
    }

    const handledInput =(i,ndx,set)=>{
        setJsonData((e) =>
            e.map((x, z) =>
              z === ndx ? { ...x, [set]: i } : x
            )
          );
    }

    const handleDDown =(i,ndx,set)=>{
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

    const handleRemove = (index) => {
        const newTableData = [...jsonData];
        newTableData.splice(index, 1);
        setJsonData(newTableData);
      };

    const ddropApps = ITEMS?.APPS?.map((e,index)=>{
        return {
                    id:     e.appID,
                    label:  e.appName,
                }
    })

    const ddropUnions = ITEMS?.UNIONS?.map((e,index)=>{
        return {
                    id:     e.unionID,
                    label:  e.unionName,
                }
    })

    const valueDDrop =(arr,i)=>{
        return arr?.find(e => e?.id === i)
    }

    const getAppID =(val)=>{
        const found =  ITEMS?.APPS?.find(i => String(i?.appName).replace(/\s+/g, '').toUpperCase() === String(val).replace(/\s+/g, '').toUpperCase());
        return found ? found.appID : '0';
    }

    const getUnionID =(val)=>{
        if(String(val).toUpperCase() != 'PRIVATE'){
            const found =  ITEMS?.UNIONS?.find(i => String(i?.unionName).replace(/\s+/g, '').toUpperCase() === String(val).replace(/\s+/g, '').toUpperCase());
            return found ? {id: found.unionID, name:found.unionName, type:found.unionType, new: false } : {id: '0', name: val, type: 'UNION', new: true };
        } else {
            return {id: '0', name: 'PRIVATE', type: 'PRIVATE', new: false }
        }
    }

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

          const isValidKeys = keys.every(key => expectedKeys.includes(key));
          const filteredResult = result.filter(item => item['ID'] && item['NAME'] && item['UNION'] && item['APPLICATION']);
          const reFill = filteredResult?.map((i)=>{
            return {
                        ...i,
                        ID:         String(i.ID),
                        APPID:      getAppID(i.APPLICATION),
                        UNIONID:    getUnionID(i.UNION)?.id,
                        UNIONNAME:  getUnionID(i.UNION)?.name,
                        UNIONTYPE:  getUnionID(i.UNION)?.type,
                        UNIONNEW:   getUnionID(i.UNION)?.new,
                        //LAUNCHED:   Fnc.isNull(i.LAUNCHED) ? today : Fnc.dateDash(i.LAUNCHED),
                        STATUS:     i.STATUS?.toUpperCase() == 'INACTIVE' ? '2' : i.STATUS?.toUpperCase() == 'PENDING' ? '1' : '0',
                    }
            })
            console.log(reFill.length)
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
            setfieldError('Excluded empty "ID", "NAME", "UNION" or "APPLICATION".');
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

    const checkBlanks   = jsonData?.every(w => String(w.ID)?.length < 4 && String(w.NAME)?.length < 4 && w.APPID == 0 )

    const checkID       = jsonData?.every(w => String(w.ID)?.length > 4 )
    const checkName     = jsonData?.every(w => String(w.NAME)?.length > 2 )
    const checkApp      = jsonData?.every(w => w.APPID == 0 )

    const checkData     = !Fnc.isNull(jsonData,0)

    async function onSubmitting() {
    
        setonSubmitLoad(true)
        
        const newDATA = jsonData?.map((i)=>{
            return {
                        idd:            Fnc.textSanitize(i.ID),
                        name:           Fnc.textSanitize(i.NAME),
                        unionType:      i.UNIONTYPE,
                        unionID:        i.UNIONID,
                        unionName:      i.UNIONNAME,
                        appID:          getAppID(i.APPLICATION),
                        details:        'None',
                        status:         i.STATUS,
                    }
            })
        try {
  
          const response = await axios.post(LinkUPLOAD('clubs'),UpsertDATA({JSONData: newDATA}));
          const feed =  response.data;
          console.log(feed)
          if(feed?.duplicateList?.length > 0){
            const dupData = jsonData?.filter(ii => feed?.duplicateList?.includes(ii.ID));
            setJsonData(dupData)
            setonSubmitLoad(false)
          }

          if( feed.added >= 1 && feed.duplicate == 0 ){
            
            ALERT( 'success', feed?.added+' Added!', false )
             
            const T = setTimeout(() => {
                resetUpload()
            }, 2500);
            return () => clearTimeout(T);

          } else if( feed.added >= 1 && feed.duplicate > 0 ){
            
            ALERT( 'success', feed?.added+' Added! '+(feed?.duplicate > 1 ? feed?.duplicate+' Duplicates' : feed?.duplicate+' Duplicate'), false )
             
          } else if( feed.added == 0 && feed.duplicate > 1 ){
            
            ALERT( 'warning', feed?.duplicate > 1 ? feed?.duplicate+' Duplicates!' : feed?.duplicate+' Duplicate!', false )
             
          } else {
  
            ALERT( 'error', 'Please try again', true )
            setonSubmitLoad(false)
  
          }
  
        } catch (error) {
  
          ALERT( 'error', 'Please try again', true )
          setonSubmitLoad(false)
  
        }
      }

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
                        onClick={()=>Fnc.downloadFile('/csv/','Club-Template.xlsx')}
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
                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px'}}>
                                
                            </TableCell>
                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px'}}>
                                
                            </TableCell>
                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px', minWidth:'130px',color:!checkID ? '#ff4554' : '', fontWeight:!checkID ? '900' : ''}}>
                                ID * 
                            </TableCell>
                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px', minWidth:'145px',color:!checkName ? '#ff4554' : '', fontWeight:!checkName ? '900' : ''}}>
                                NAME *
                            </TableCell>
                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px', minWidth:'130px',color:checkApp ? '#ff4554' : '', fontWeight:checkApp ? '900' : ''}}>
                                APPLICATION * 
                            </TableCell>
                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px', minWidth:'130px'}}>
                                UNION
                            </TableCell>
                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px', minWidth:'130px'}}>
                                STATUS
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            jsonData?.map((i,index)=>{
                                const sxxs = {fontSize: onMobile ? '10px' : '11px',minWidth:'78px',padding:'0px'};
                                
                                return  <TableRow key={index}>
                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px',maxWidth:'10px',}}> 
                                                <Icon   icon={'ep:remove-filled'} 
                                                        width={20} 
                                                        color='#ff4554' 
                                                        style={{cursor:'pointer', marginBottom:'-5px'}}
                                                        onClick={()=>handleRemove(index)}
                                                        /> 
                                            </TableCell>
                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px',maxWidth:'10px'}}> 
                                                <span>{index+1}</span>
                                            </TableCell>
                                            <TableCell sx={{fontSize: onMobile ? '10px' : '11px',minWidth:'140px'}}> 
                                                <TextField
                                                    onChange={(e)=>handledInput(Fnc.wordNormal(e.target.value),index,'ID')}
                                                    variant="outlined"
                                                    size='small'
                                                    value={i.ID}
                                                    autoComplete='off'
                                                    inputProps={{  maxLength: 20, style: { 
                                                                                            fontSize: onMobile ? '11px' : '11.5px',
                                                                                            border: 'none',
                                                                                            color:          i.ID.length < 5 ? '#ff4554' : '',
                                                                                            fontWeight:     i.ID.length < 5 ? '700':'100',
                                                                                          } }}
                                                    sx={{'& .MuiOutlinedInput-notchedOutline': { border: 'none'},maxWidth: !onMobile ?  '150px' : '100%'}}
                                                />
                                            </TableCell>
                                            <TableCell sx={sxxs}> 
                                                <TextField
                                                    onChange={(e)=>handledInput(Fnc.wordNormal(e.target.value),index,'NAME')}
                                                    variant="outlined"
                                                    size='small'
                                                    value={i.NAME}
                                                    autoComplete='off'
                                                    inputProps={{  maxLength: 20, style: { 
                                                                                            fontSize: onMobile ? '11px' : '11.5px',
                                                                                            border: 'none',
                                                                                            color:          i.NAME.length < 3 ? '#ff4554' : '',
                                                                                            fontWeight:     i.NAME.length < 3 ? '700':'100'
                                                                                          } }}
                                                    sx={{'& .MuiOutlinedInput-notchedOutline': { border: 'none'},maxWidth: !onMobile ?  '140px' : '100%'}}
                                                />
                                            </TableCell>
                                            <TableCell sx={sxxs}> 

                                                    <Autocomplete   size='small'
                                                                    fullWidth
                                                                    options={ddropApps}
                                                                    value={valueDDrop(ddropApps,i.APPID) ? valueDDrop(ddropApps,i.APPID) : null}
                                                                    onChange={(event, newValue) => {
                                                                        handleDDown(newValue.id,index,'APPID')
                                                                    }}
                                                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                                                    renderOption={(props, option) => (
                                                                        <React.Fragment key={option.id}>
                                                                            <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
                                                                        </React.Fragment>
                                                                        )}
                                                                    renderInput={(params) => (
                                                                        <TextField {...params} 
                                                                        sx={{ '& .MuiInputBase-input': { fontSize: onMobile ? '11px' : '11px',border:'none'},
                                                                            '& .MuiOutlinedInput-notchedOutline': { border: 'none', },
                                                                            width: !onMobile ?  '170px' : '100%' 
                                                                            }}
                                                                        autoComplete='off'
                                                                        InputProps={{ ...params.InputProps, endAdornment: null, }}
                                                                        variant="outlined" />
                                                                    )} />
                                            </TableCell>
                                            <TableCell sx={sxxs}>  
                                                
                                                <Autocomplete       size='small'
                                                                    fullWidth
                                                                    options={ddropUnions}
                                                                    value={valueDDrop(ddropUnions,i.UNIONID) ? valueDDrop(ddropUnions,i.UNIONID) : null}
                                                                    onChange={(event, newValue) => {
                                                                        handleDDown(newValue.id,index,'UNIONID'),
                                                                        handleDDown(newValue.label,index,'UNIONNAME'),
                                                                        handleDDown('UNION',index,'UNIONTYPE'),
                                                                        handleDDown(false,index,'UNIONNEW')
                                                                    }}
                                                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                                                    renderOption={(props, option) => (
                                                                        <React.Fragment key={option.id}>
                                                                            <span {...props} style={{ fontSize: '12px'}}>{option.label}</span>
                                                                        </React.Fragment>
                                                                        )}
                                                                    renderInput={(params) => (
                                                                        <TextField {...params} 
                                                                        sx={{ '& .MuiInputBase-input': { fontSize: onMobile ? '11px' : '11px',border:'none'},
                                                                            '& .MuiOutlinedInput-notchedOutline': { border: 'none', },
                                                                            '& .MuiInputLabel-root': { fontSize: onMobile ? '12px' : '11px', color: 'gold'  },
                                                                            width: !onMobile ?  '170px' : '100%' 
                                                                            }}
                                                                        label={
                                                                                i.UNIONNAME == 'PRIVATE' ||  i.UNIONNEW 
                                                                                ? 
                                                                                <>
                                                                                {i.UNIONNAME} &nbsp;
                                                                                {
                                                                                    i.UNIONNEW
                                                                                    ?
                                                                                    <span style={{fontSize:'10px',color:'gold'}}>(New?)</span>
                                                                                    :
                                                                                    ''
                                                                                }
                                                                                </>
                                                                                : 
                                                                                null
                                                                                }
                                                                        autoComplete='off'
                                                                        InputProps={{ ...params.InputProps, endAdornment: null, }}
                                                                        variant="outlined" />
                                                                    )} />
                                                
                                                
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


            {Fnc.JSONS(jsonData,false)}


      </div>
        </DialogContent>

        <DialogActions style={{padding:'20px', marginTop:'-15px',display: 'flex', justifyContent: 'center'}}>

                {
                    checkData && checkBlanks &&
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
                {Fnc.JSONS(jsonData,false)}
        </DialogActions>
    </Dialog>

    );
};


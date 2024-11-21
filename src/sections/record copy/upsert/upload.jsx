import React, { useState,useEffect } from 'react';
import { Button, TextField, Box, Chip, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import * as XLSX from 'xlsx';

import * as Fn from '../functions'
import * as Fnc from 'src/hooks/functions'
import { Icon } from '@iconify/react';

export default function Uploading({ITEM,RETURN,}) {


  const handleFileUpload = async (event) => {

    const file = event.target.files[0];
    const isValidFile =  file.name.endsWith('.csv') || file.type === 'text/csv' || file.name.endsWith('.xls') || file.type === 'application/vnd.ms-excel' || file.name.endsWith('.xlsx') || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    
    if(isValidFile){

        const upXLXS = await Fn.uploadXLXS(file)

        if(upXLXS.status == 'VALID'){

            const upBLANK = await Fn.fillBLANKS(upXLXS.values, ITEM.CLUBS.data, ITEM.ACCOUNTS.data, ITEM.FORMULA.data, ITEM.DEALPLAYERS.data, ITEM.DEALUPLINES.data, ITEM.DEALFORMULA.data)

            RETURN({ status: 'VALID', data: upBLANK })

        } else {

            RETURN({ status: 'INVALID', data: [] }) 

        }
        
    } else {
        RETURN({ status: 'INVALID', data: [] })
    }

  };


  useEffect(() => {
    RETURN({ status: 'LOADING', data: [] })
  }, []); 

  return (
            <>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '5px', marginTop:'50px' }}>

                    <Chip
                        size='small'
                        label="Full Template"
                        onDelete={()=>{}}
                        onClick={()=>Fnc.downloadFile('/csv/','Record-Template-Full.xlsx')}
                        sx={{'&:hover': { cursor: 'pointer' },border: '1px none violet'}}
                        deleteIcon={<Icon icon="line-md:download-outline-loop" color='violet' width={'25'} />}
                        variant="outlined"
                        />
                    &nbsp;
                    <Chip
                        size='small'
                        label="Short Template"
                        onDelete={()=>{}}
                        onClick={()=>Fnc.downloadFile('/csv/','Record-Template-Short.xlsx')}
                        sx={{'&:hover': { cursor: 'pointer' },border: '1px none violet'}}
                        deleteIcon={<Icon icon="line-md:download-outline-loop" color='violet' width={'25'} />}
                        variant="outlined"
                        />

                </Box>

                <Box component="section" style={{color:'violet', height:'150px', marginTop:'10px'}} sx={{ p: 2, border: '1px dashed mediumpurple',color: 'primary.main' }}>
                <input  type="file" 
                        accept=".xlsx, .xlsm, .xlsb, .csv" 
                        style={{height:'150px',lineHeight:'150px', marginTop:'-20px', width:'100%'}} 
                        onChange={handleFileUpload} />
                </Box>
                    {
                        //<pre style={{fontSize:'9px'}}>{JSON.stringify(RATES,null,2)}</pre>
                    }
            </>



  );
};
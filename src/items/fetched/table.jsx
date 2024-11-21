import { useState,useEffect } from 'react';
import {Avatar,Button,Grid} from '@mui/material/'

import { DataGrid, GridToolbar, } from "@mui/x-data-grid";

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'

// ----------------------------------------------------------------------

export default function ViaTable({ DATA_EN, DATA_TO, DATA_RE }) {

    function viewDetails(i){
        const x = DATA_TO.find((e) => (e.id == i.row.id));
        DATA_RE({...x,modal: 'Open'})
    };

    const iTEXT = (i,ii) => {
        return { field: ii, headerName: i, flex: 1, }
    }

    const iAVATAR = (i,ii,iii) => {
        return { field: ii, headerName: i, flex: 1,
                    renderCell: (params) => {
                        return (
                            <Avatar alt={params.row[iii]} src={params.row[ii]} />
                        );
                    },
                }
    }

    const iSTATUS = (i,ii) => {
        return { field: ii, headerName: i, flex: 1,
                    renderCell: (z) => {
                            return (
                                        z.row[ii] == "Active" ? 
                                        <Button size="small"
                                            startIcon={<Icon icon="mdi:check-circle" color='green' width={22} sx={{ mr: 0 }}  />} >
                                            <span style={{color: "green"}}> Active </span>
                                        </Button>
                                        : z.row[ii] == "Pending" ? 
                                        <Button size="small"
                                            startIcon={<Icon icon="mdi:clock-outline" color='orange' width={22} sx={{ mr: 0 }}  />} >
                                            <span style={{color: "orange"}}> Pending </span>
                                        </Button>
                                        :
                                        <Button size="small"
                                            startIcon={<Icon icon="mdi:close-circle" color='red' width={22} sx={{ mr: 0 }}  />} >
                                            <span style={{color: "red"}}> Disabled </span>
                                        </Button>
                                    );
                    },
                }
    }

    const iPERCENT = (i,ii) => {
        return { field: ii, headerName: i, flex: 1, 
                    renderCell: (z) => {
                                                return (
                                                            <span>{z.row[ii] == '' || z.row[ii] == null ? '0%' : z.row[ii]+'%'}</span>
                                                        );
                                        },
        }
    }

    const iUSD = (i,ii) => {
        return { field: ii, headerName: i, flex: 1, 
                    renderCell: (z) => {
                                                return (
                                                            <span>{z.row[ii] == '' || z.row[ii] == null ? '$0' : '$'+z.row[ii]}</span>
                                                        );
                                        },
        }
    }
    const iDATE = (i,ii) => {
        return { field: ii, headerName: i, flex: 1, 
                    renderCell: (z) => {
                                                return (
                                                            <span>{z.row[ii] == '' || z.row[ii] == null ? '$0' : '$'+z.row[ii]}</span>
                                                        );
                                        },
        }
    }
    const iACTION = (i,ii) => {
        return { field: "action", headerName: "Action", flex: 1,
                    renderCell: (z) => {
                                            return (
                                            <Button size="small"  onClick={() => viewDetails(z)}
                                                endIcon={<Icon icon="eva:arrow-ios-forward-fill" color='purple' />} >
                                                <span style={{color: "violet"}}> View </span>
                                            </Button>
                                            );
                                        },
                }
    }

    const TABLE_CONTENT = DATA_EN.map((i,index) => {
        
        if(i.type == "TEXT"){
            return iTEXT(i.header,i.value)
        } else if(i.type == "AVATAR"){
            return iAVATAR(i.header,i.value,i.altimage)
        } else if(i.type == "STATUS"){
            return iSTATUS(i.header,i.value)
        } else if(i.type == "PERCENT"){
            return iPERCENT(i.header,i.value)
        } else if(i.type == "USD"){
            return iUSD(i.header,i.value)
        } else if(i.type == "DATE"){
            return iDATE(i.header,i.value)
        } else if(i.type == "ACTION"){
            return iACTION(i.header,i.value)
        }
        
    })

  return (

    <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 1, sm: 1, md: 1 }}>
    <Grid item xs={1} sm={1} md={1}>
        <DataGrid   columns={TABLE_CONTENT}
                    rows={DATA_TO}
                    size='small'
                    initialState={{
                    pagination: {
                        paginationModel: { pageSize: 15,page: 0,}
                    }
                    }}
                />
    </Grid>
    </Grid>

  );
}

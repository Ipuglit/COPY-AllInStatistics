import { useState, useEffect } from 'react';

import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button';

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

export default function PostTable({data,upsertData}) {

  function viewDetails(i){
        upsertData({...i.row,modal: 'Open'})
  };

// -----------------------

  const tableHeaders = [ { field: "idd", headerName: "ID", flex: 0.5 },  
                        { field: "imageFull", headerName: "Image", flex: 1,
                          renderCell: (params) => {
                            return (
                              <Avatar alt={params.row.name} src={params.row.imageFull ? params.row.imageFull : "public/images/clubs/default.png"} />
                            );
                          },
                         },  
                        { field: "name", headerName: "Name", flex: 1, cellClassName: "name-column--cell no-border-bottom", },  
                        { field: "appName", headerName: "Application", flex: 1, },   
                        { field: "union", headerName: "Union", flex: 1, },

                        { field: "statusLabel", headerName: "Status", flex: 1,
                          renderCell: (params) => {
                            return (
                                params.row.statusLabel == "Active" ? 
                                  <Button size="small"
                                    startIcon={<Icon icon="mdi:check-circle" color='green' width={22} sx={{ mr: 0 }}  />} >
                                    <span style={{color: "green"}}> Active </span>
                                  </Button>
                               : params.row.statusLabel == "Pending" ? 
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
                         },   
                        { field: "usersActives", headerName: "Active Accounts", flex: 1, cellClassName: "name-column--cell no-border-bottom", },   
                        { field: "action", headerName: "Action", flex: 1,
                          renderCell: (params) => {

                            return (
                              <Button size="small"  onClick={() => viewDetails(params)}
                              endIcon={<Icon icon="eva:arrow-ios-forward-fill" color='purple' />} >
                              <span style={{color: "violet"}}> View </span>
                            </Button>
                            );

                          },
                         },    
    
                      ];;

    const tableRows = data.map(i => {
              return {
                        id:                         i.id,
                        increment:                  i.increment,
                        idd:                        i.idd,
                        name:                       i.name,
                        image:                      i.image,
                        details:                    i.details,
                        percent:                    i.percent,
                        type:                       i.type,
                        union:                      i.type == "PRIVATE" ? "PRIVATE" : i.unionName,
                        unionID:                    i.unionID,
                        unionName:                  i.unionName,
                        unionImage:                 i.unionImage,
                        usersActive:                i.usersActive,
                        usersActives:                i.usersActive == 0 ? "No account" : i.usersActive > 1 ? i.usersActive+" account" : "1 account",
                        usersPending:               i.usersPending,
                        usersInactive:              i.usersInactive,
                        imageID:                    i.imageID,
                        imageFull:                  i.imageFull,
                        appID:                      i.appID,
                        appName:                    i.appName,
                        appImage:                   i.appImage,
                        statusLabel:                i.statusLabel,
                        status:                     i.status,
                      };
                      })

  return (
<>

<DataGrid   columns={tableHeaders}
            rows={tableRows}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10}
              }
            }}
            //components={{ Toolbar: GridToolbar }}
        />
</>
  );
}

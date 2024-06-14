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

  const tableHeaders = [ { field: "id", headerName: "ID", flex: 0.5 },  
                        { field: "avatarFull", headerName: "Avatar", flex: 1,
                          renderCell: (params) => {
                            return (
                              <Avatar alt={params.row.id} src={params.row.avatarFull} />
                            );
                          },
                         },  
                        { field: "nickname", headerName: "Nickname", flex: 1, cellClassName: "name-column--cell no-border-bottom", },  
                        { field: "roleName", headerName: "Role", flex: 1, },   
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
                        { field: "activeAccounts", headerName: "Active Accounts", flex: 1, cellClassName: "name-column--cell no-border-bottom", }, 
                        { field: "email", headerName: "Email", flex: 1 }, 
                        { field: "telegram", headerName: "Telegram", flex: 1 },      
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
                        totalAccounts:              i.totalAccounts,
                        activeAccounts:             i.activeAccounts == 0 ? "No account" : i.activeAccounts > 1 ? i.activeAccounts+" accounts" : "1 account",
                        pendingAccounts:            i.pendingAccounts,
                        disabledAccounts:           i.disabledAccounts,
                        nickname:                   i.nickname,
                        username:                   i.username,
                        roleName:                   i.roleName,
                        roleID:                     i.roleID,
                        email:                      i.email,
                        status:                     i.status,
                        statusLabel:                i.statusLabel,
                        avatarID:                   i.avatarID,
                        avatarFull:                 i.avatarFull,
                        telegram:                   i.telegram,
                        action:                     i.action,
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

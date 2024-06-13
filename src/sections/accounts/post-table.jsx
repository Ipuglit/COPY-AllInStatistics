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

  const tableHeaders = [ { field: "accountID", headerName: "ID", flex: 0.5 },  
                        { field: "userAvatar", headerName: "Avatar", flex: 1,
                          renderCell: (params) => {
                            return (
                              <Avatar alt={params.row.accountID} src={params.row.userAvatar} />
                            );
                          },
                         },  
                        { field: "accountNickname", headerName: "Nickname", flex: 1, cellClassName: "name-column--cell no-border-bottom", },  
                        { field: "accountRole", headerName: "Role", flex: 1, },   
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
                        { field: "userNickname", headerName: "User", flex: 1, cellClassName: "name-column--cell no-border-bottom", }, 
                        { field: "appName", headerName: "Application", flex: 1 }, 
                        { field: "accountClubsCount", headerName: "Clubs", flex: 1 },      
                        { field: "action", headerName: "Action", flex: 1,
                          renderCell: (params) => {

                            return (
                              <Button size="small"  onClick={() => viewDetails(params)}
                              endIcon={<Icon icon="eva:arrow-ios-forward-fill" color='purple' width={22} sx={{ mr: 0 }}  />} >
                              <span style={{color: "purple"}}> View </span>
                            </Button>
                            );

                          },
                         },    
    
                      ];;

    const tableRows = data.map(i => {
              return {
                        id:                         i.id,
                        accountAsDownline:          i.accountAsDownline,
                        accountAsUpline:            i.accountAsUpline,
                        accountID:                  i.accountID,
                        accountNickname:            i.accountNickname,
                        accountRole:                i.accountRole,
                        accountRoleID:              i.accountRoleID,
                        appID:                      i.appID,
                        appImage:                   i.appImage,
                        appName:                    i.appName,
                        status:                     i.status,
                        statusLabel:                i.statusLabel,
                        userID:                     i.userID,
                        userNickname:               i.userNickname,
                        userRole:                   i.userRole,
                        userAvatar:                 i.userAvatar,
                        accountClubsCount:          i.accountClubsCount == 0 ? "0 club" : i.accountClubsCount > 1 ? i.accountClubsCount+" clubs" : "1 club",
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

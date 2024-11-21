import { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import { RawUsers } from 'src/hooks/raw/users';

// ----------------------------------------------------------------------

export default function PlainTableUsers() {

  const rawusers = RawUsers()

  const [datalist,setdataList] = useState([])

  useEffect(() => {
    setdataList(rawusers.data)
  }, [rawusers.load == true]);

// -----------------------

  const dataHeaders = [ { field: "id", headerName: "ID", flex: 0.5 },    
                        //{ field: "avatar", headerName: "Avatar", flex: 0.5 }, 
                        { field: "rolename", headerName: "Role Name", flex: 1 },  
                        { field: "name", headerName: "Name", flex: 1, cellClassName: "name-column--cell no-border-bottom", },    
                        { field: "username", headerName: "Username", flex: 1 }, 
                        { field: "email", headerName: "email", type: "number", headerAlign: "left", align: "left", }, 
                        { field: "telegram", headerName: "telegram", flex: 1 },      
                        { field: "accounts", headerName: "Accounts", flex: 1,align: "center", },    
                        { field: "status", headerName: "Status", flex: 1 },     
                      ];

    const dataRows = datalist.map(i => {
              return {
                        id:         i.id,
                        //avatar:     i.avatarFull,
                        rolename:   i.roleName,
                        name:       i.nickname,
                        username:   i.username,
                        email:      i.email,
                        telegram:   i.telegram,
                        accounts:   i.activeAccounts == 0 ? "No account" : i.activeAccounts == 1? "1 account" : i.activeAccounts+" accounts",
                        status:     i.statusLabel,
                      };
                      })

  return (
        <DataGrid
        rows={dataRows}
        columns={dataHeaders}
        pageSize={10}
        rowsPerPageOptions={[5, 25, 50]}
        components={{ Toolbar: GridToolbar }}
    />
  );
}

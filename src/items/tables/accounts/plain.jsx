import { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import { RawAccounts } from 'src/hooks/raw/accounts';

// ----------------------------------------------------------------------

export default function PlainTableAccounts() {

  const rawaccounts = RawAccounts("ALL","")

  const [datalist,setdataList] = useState([])

  useEffect(() => {
      setdataList(rawaccounts.data)
  }, [rawaccounts.load == true]);

// -----------------------

  const dataHeaders = [ { field: "id", headerName: "ID", flex: 0.5 },    
                        { field: "role", headerName: "Role", flex: 1,  },  
                        { field: "accountid", headerName: "Account ID", flex: 1, },    
                        { field: "nickname", headerName: "Nickname", flex: 1,}, 
                        { field: "userid", headerName: "User ID", flex: 1 }, 
                        { field: "usernickname", headerName: "User Nickname", flex: 1 }, 
                        { field: "app", headerName: "Application", flex: 1 },      
                        { field: "clubs", headerName: "Clubs", flex: 1,align: "center", },    
                        { field: "status", headerName: "Status", flex: 1 },     
                      ];

    const dataRows = datalist.map(i => {
              return {
                        id:           i.id,
                        role:         i.accountRole,
                        accountid:    i.accountID,
                        nickname:     i.accountNickname,
                        userid:       i.userID,
                        usernickname: i.userNickname,
                        app:          i.appName,
                        clubs:        i.accountClubsCount == 0 ? "No club" : i.accountClubsCount == 1? "1 club" : i.accountClubsCount+" clubs",
                        status:       i.statusLabel,
                      };
                      })

  return (
        <DataGrid
            rows={dataRows}
            columns={dataHeaders}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10}
              }
            }}
            components={{ Toolbar: GridToolbar }}
        />
  );
}

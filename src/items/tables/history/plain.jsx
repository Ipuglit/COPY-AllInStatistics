import { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import { RawHistory } from 'src/hooks/raw/history';

// ----------------------------------------------------------------------

export default function PlainTableHistory() {

  const rawhistory = RawHistory()

  const [userlist,setUserlist] = useState([])

  useEffect(() => {
      setUserlist(rawhistory.data)
  }, [rawhistory.load == true]);

// -----------------------

  const dataHeaders = [ { field: "id", headerName: "ID", flex: 0.5 },    
                        { field: "datetime", headerName: "Date & Time", flex: 1, cellClassName: "name-column--cell no-border-bottom", },  
                        { field: "userid", headerName: "User ID", flex: 1, },    
                        { field: "nickname", headerName: "Nickname", flex: 1, cellClassName: "name-column--cell no-border-bottom", }, 
                        { field: "timezone", headerName: "Timezone", flex: 1 }, 
                        { field: "gadget", headerName: "Gadget", flex: 1 }, 
                        { field: "for", headerName: "For", flex: 1 },      
                        { field: "action", headerName: "Action", flex: 1,align: "center", },    
                        { field: "details", headerName: "Details", flex: 1 },     
                      ];

    const dataRows = userlist.map(i => {
              return {
                        id:         i.id,
                        datetime:   i.datetime,
                        userid:     i.userID,
                        nickname:   i.userNickname,
                        timezone:   i.timezone,
                        gadget:     i.gadget,
                        for:        i.for,
                        action:     i.action,
                        details:    i.details,
                      };
                      })

  return (
        <DataGrid
            rows={dataRows}
            columns={dataHeaders}
            pageSizeOptions={[5, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10}
              }
            }}
            components={{ Toolbar: GridToolbar }}
        />
  );
}

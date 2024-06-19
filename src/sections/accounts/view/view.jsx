import { useState, useEffect } from 'react';

import {Stack,Button,Container,Alert,Typography} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { RawApplications } from 'src/hooks/raw/applications';
import { RawRoles } from 'src/hooks/raw/roles';
import { RawAccounts } from 'src/hooks/raw/accounts';

import { Icon } from '@iconify/react';

import Loading_Skeletons from 'src/items/loaders/loadings'

import * as Data from 'src/hooks/data';

import { ViaCardUser, ViaTable, ViaList } from 'src/items/records';
import { OnSortings, FormattingSorting } from 'src/items/sorting';

import {AddingItem} from '../upsert/form';

// ----------------------------------------------------------------------

export default function Viewing({TheFor,TheTitle}) {

    const dataView  = localStorage.getItem('slk-dataview')

    var [onToggle, setonToggle]           = useState(dataView);

    const [filterStatus,setfilterStatus]    = useState('ALL')
    const [filterRole,setfilterRole]        = useState('EVERYONE')
    const [filterApp,setfilterApp]          = useState('ALL')
    const [filterSort,setfilterSort]        = useState('ASC')
    const [filterSortBy,setfilterSortBy]    = useState('NONE')
    const [filterSearch,setfilterSearch]    = useState('')

    const rawApps                           = RawApplications("ALL").data
    const rawRoles                          = RawRoles("LOWERMID").data

    const rawItems                          = RawAccounts(  TheFor,
                                                            filterStatus ? filterStatus : "ALL",
                                                            filterRole ? filterRole : "EVERYONE",
                                                            filterApp ? filterApp : "ALL",
                                                            filterSort ? filterSort : "DESC",
                                                            filterSortBy ? filterSortBy : "NONE",
                                                            filterSearch ? filterSearch : "",)
    


    const [listofDATA,setlistofDATA]        = useState([])
    const [listLoading,setlistLoading]      = useState(false)
    const [listFound,setlistFound]          = useState(true)

    const [upsertofData,setupsertofData]    = useState([])

    useEffect(() => {
        setlistofDATA(rawItems.data)
        setlistLoading(rawItems.load)
    }, [rawItems.load == true]);

    // ==================================================
    // =================== ++ FILTER ++ ===============================

    const onFilter_to =  [ 
                            //ITEMS,VALUE,IDD,OTHERS
                            [ FormattingSorting(Data.BY_STATUS,"STATUS",'value','label',"",true) ],
                            [ FormattingSorting(rawRoles,"ROLES",'id','name',"",true) ],
                            [ FormattingSorting(rawApps,"APPS",'id','name',"",true) ],
                          ];

    const onSort_to =  [ 
                            //ITEMS,VALUE,IDD,OTHERS
                            [ FormattingSorting(Data.BY_ACCOUNTS,"STATUS",'value','label',"",false) ],
                          ];

    const onFilter_re =(i)=>{

        if(i.what == "STATUS"){
          setfilterStatus(i.idd)
        } else if(i.what == "ROLES"){
          setfilterRole(i.idd)
        } else if(i.what == "APPS"){
          setfilterApp(i.idd)
        }

    }

    const onSort_re =(i)=>{

      if(i.arrange == 'ASC'){
        setfilterSort('ASC')
      } else {
        setfilterSort('DESC')
      }
      //console.log(JSON.stringify(i))
      setfilterSortBy(i.by.x.idd ? i.by.x.idd : "NONE")

  }

  const onSearch_re =(i)=>{
    setfilterSearch(i)
  }

  const onToggle_re =(i)=>{
    localStorage.setItem('slk-dataview',i ? i : 'card')
    setonToggle(i)
  }

    // =================== ++ FILTER ++ ===============================
    // ==================================================
    // =================== ++ UPSERT ++ ===============================

    const ENLISTED_CARDS = [{ 
                      id:       'increment',
                      idd:      'accountID',
                      status:   'statusLabel',
                      header:   'appName',
                      title:    'accountNickname',
                      image:    'appImage',
                      avatar:   'userAvatar',
                      description:  [
                                    { id: 1, label:  '', value: 'accountRole', count: ''},
                                    { id: 2, label:  'ID: ', value: 'accountID', count: ''},
                                    { id: 3, label:  'club', value: 'accountClubsCount', count: true},
                                    ],
                    }]

    const ENLISTED_TABLE = [ 
                            { type:  'TEXT',    value: 'accountID', header: 'ID', altimage:''},
                            { type:  'AVATAR',  value: 'userAvatar', header: 'Avatar', altimage:'accountID'},
                            { type:  'TEXT',    value: 'accountNickname', header: 'Nickname', altimage:''},
                            { type:  'TEXT',    value: 'accountRole', header: 'Role', altimage:''},
                            { type:  'STATUS',  value: 'statusLabel', header: 'Status', altimage:''},
                            { type:  'TEXT',    value: 'userNickname', header: 'User', altimage:''},
                            { type:  'TEXT',    value: 'appName', header: 'Application', altimage:''},
                            { type:  'TEXT',    value: 'accountClubsCount', header: 'Clubs', altimage:''},
                            { type:  'ACTION',  value: 'accountNickname', header: 'Action', altimage:''},
                          ]



    const listofUPSERT=(i)=>{
      setupsertofData({...i,AddType:TheFor})
    }
    
    // =================== ++ UPSERT ++ ===============================
    // ==================================================


    const onupsertData=(i)=>{
      setupsertofData({...i,AddType:TheFor})
    }

    const submittedResult=(i)=>{

      const items = i.items

        if(i.type == "add"){
          const newArray = [...listofDATA,items];
          setlistofDATA(newArray)
        } else if(i.type == "update"){
          const x = listofDATA.findIndex((o) => o.id == items.id);
          const newArray = [...listofDATA];
          newArray[x] = items;
          setlistofDATA(newArray)
        }

    }
    

    const addingNew=()=>{
      setupsertofData({modal:"Open",AddType:TheFor})
    }

    useEffect(() => {
      if(listLoading == true){
        if (!listofDATA.length) {
          setlistFound(false)
        } else {
          setlistFound(true)

                                      }
                                      
      }
     /// console.log(JSON.stringify(onFilter_to))
    }, [listLoading]); 


  return (
    <Container>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>

        <Typography variant="h3">{TheTitle}</Typography>

        <Button variant="contained" color="inherit" startIcon={<Icon icon="line-md:plus" />} onClick={addingNew}>
          NEW 
        </Button>

      </Stack>

       <OnSortings  FILTER_TO={onFilter_to} 
                    FILTER_RE={onFilter_re} 
                    SORT_TO={onSort_to} 
                    SORT_RE={onSort_re}
                    SEARCH_RE={onSearch_re}
                    TOGGLE_RE={onToggle_re} />



    { listLoading == false ? 
        <Loading_Skeletons type={dataView} />
      :
      <>

        {listFound == true ?
          <>

            {dataView == 'card' ? 
                <ViaCardUser DATA_TO={listofDATA} DATA_EN={ENLISTED_CARDS} DATA_RE={listofUPSERT} />
            :dataView == 'table' ? 
                <ViaTable DATA_TO={listofDATA} DATA_EN={ENLISTED_TABLE} DATA_RE={listofUPSERT} />
            :dataView == 'list' ? 
                <ViaList DATA_TO={listofDATA} DATA_EN={ENLISTED_CARDS} DATA_RE={listofUPSERT} />
            : 
                null
            }
            
          </>
        :
            <Grid xs={22} sm={22} md={22}>
              <Alert variant="outlined" severity="info" width="100%">
                  Nothing found..
              </Alert>
            </Grid>
        }

      </>
    }




    
        

    <AddingItem receivedData={upsertofData} submittedResult={submittedResult}/>



    </Container>
  );
}


//cover, title, view, comment, share, author, createdAt, index

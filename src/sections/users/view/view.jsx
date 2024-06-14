import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { RawAccounts } from 'src/hooks/raw/accounts';
import { RawUsers } from 'src/hooks/raw/users';
import Iconify from 'src/components/iconify';
import { Icon } from '@iconify/react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import Loading_Skeletons from 'src/items/loaders/loadings'
import LoadCards from '../post-card';
import LoadList from '../post-list';
import LoadTable from '../post-table'


import OnSorting from '../sorting';
import OnSearching from '../searching';
import {AddingItem} from '../upsert/form';

// ----------------------------------------------------------------------

export default function UsersView() {

    const dataView  = localStorage.getItem('slk-dataview')

    const [onview, setonView]               = useState(dataView);

    const [filterStatus,setfilterStatus]    = useState('ALL')
    const [filterRole,setfilterRole]        = useState('EVERYONE')
    const [filterSort,setfilterSort]        = useState('ASC')
    const [filterSortBy,setfilterSortBy]    = useState('NONE')
    const [filterSearch,setfilterSearch]    = useState('')
    const rawItems                          = RawUsers  (   filterStatus ? filterStatus : "ALL",
                                                            filterRole ? filterRole : "EVERYONE",
                                                            filterSort ? filterSort : "DESC",
                                                            filterSortBy ? filterSortBy : "NONE",
                                                            filterSearch ? filterSearch : "",)

    const [listofData,setlistofData]        = useState([])
    const [listLoading,setlistLoading]      = useState(false)
    const [listFound,setlistFound]          = useState(true)

    const [upsertofData,setupsertofData]    = useState([])

    useEffect(() => {
        setlistofData(rawItems.data)
        setlistLoading(rawItems.load)
    }, [rawItems.load == true]);

    const onByRoles =(i)=>{
        setfilterRole(i)
    }

    const onByStatus =(i)=>{
        setfilterStatus(i)
    }

    
    const onBySort=(i)=>{
      setfilterSort(i)
    }

    const onBySortBy=(i)=>{
      setfilterSortBy(i)

    }

    const onBySearch=(i)=>{
      setfilterSearch(i)
    }

    const onupsertData=(i)=>{
      setupsertofData(i)
    }

    const submittedResult=(i)=>{

      const items = i.items

        if(i.type == "add"){
          const newArray = [...listofData,items];
          setlistofData(newArray)
        } else if(i.type == "update"){
          const x = listofData.findIndex((o) => o.id == items.id);
          const newArray = [...listofData];
          newArray[x] = items;
          setlistofData(newArray)
        }

    }
    
    const onchangeView = (event, i) => {
      setonView(i);
      localStorage.setItem('slk-dataview',i)
    };

    const addingNew=()=>{
      setupsertofData({modal:"Open"})
    }

    useEffect(() => {
      if(listLoading == true){
        if (!listofData.length) {
          setlistFound(false)
        } else {
          setlistFound(true)
        }
      }
    }, [listLoading]); 


  return (
    <Container>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>

        <Typography variant="h3">USERS</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={addingNew}>
          New User 
        </Button>

      </Stack>


      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>

          <Grid xs={6} sm={6} md={6}>

              <OnSorting byRoles={onByRoles} byStatus={onByStatus} bySort={onBySort} bySortBy={onBySortBy}/>
              
          </Grid>

      </Grid>

        <Divider sx={{ borderStyle: 'dashed', m: 1 }} />
        
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 8, md: 12 }}>

            <Grid xs={7.5} sm={6} md={6}>

                <Stack mb={1} direction="row" alignItems="right" justifyContent="flex-start">

                    <OnSearching bySearching={onBySearch} />

                </Stack>

            </Grid>

            <Grid xs={4.5} sm={6} md={6}>

                <Stack mb={1} direction="row" alignItems="right" justifyContent="flex-end">

                    <ToggleButtonGroup value={onview} onChange={onchangeView} exclusive size="small"  >

                          <ToggleButton value="table">
                                <Icon icon="fluent-mdl2:table" color='gray' width={22} sx={{ mr: 5 }}  />
                          </ToggleButton>

                          <ToggleButton value="list">
                                <Icon icon="cil:list" color='gray' width={22} sx={{ mr: 5 }}  />
                          </ToggleButton>

                          <ToggleButton value="card">
                                <Icon icon="clarity:view-cards-line" color='gray' width={22} sx={{ mr: 5 }}  />
                          </ToggleButton>

                    </ToggleButtonGroup>

                </Stack>

            </Grid>

      </Grid>


      <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 10, md: 20 }}>
    { listLoading == false ? 
        <Loading_Skeletons type={dataView} />
      :
      <>

      {listFound == true ?
        <>

          {dataView == 'card' ? 
              listofData.map((i, index) => (
                <LoadCards key={i.id}
                          upsertData={onupsertData}
                          data={i} />
                ))
          : dataView == 'list' ?
              <LoadList data={listofData} upsertData={onupsertData} />
          : 
              <LoadTable data={listofData} upsertData={onupsertData} />
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

      </Grid>

    <AddingItem receivedData={upsertofData} submittedResult={submittedResult}/>

    </Container>
  );
}


//cover, title, view, comment, share, author, createdAt, index

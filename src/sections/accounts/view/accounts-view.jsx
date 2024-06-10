import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { RawAccounts } from 'src/hooks/raw/accounts';
import Iconify from 'src/components/iconify';

import LoadCards from '../post-card';

import OnSorting from '../sorting';
import OnSearching from '../searching';
// ----------------------------------------------------------------------

export default function AccountsView() {

    const [filterStatus,setfilterStatus]    = useState('ALL')
    const [filterRole,setfilterRole]        = useState('EVERYONE')
    const [filterApp,setfilterApp]          = useState('ALL')
    const [filterSort,setfilterSort]        = useState('ASC')
    const [filterSortBy,setfilterSortBy]        = useState('NONE')
    const [filterSearch,setfilterSearch]    = useState('')
    const rawaccounts                       = RawAccounts(  filterStatus ? filterStatus : "ALL",
                                                            filterRole ? filterRole : "EVERYONE",
                                                            filterApp ? filterApp : "ALL",
                                                            filterSort ? filterSort : "DESC",
                                                            filterSortBy ? filterSortBy : "NONE",
                                                            filterSearch ? filterSearch : "",)

    const [listofData,setlistofData]        = useState([])
    const [listLoading,setlistLoading]      = useState(false)
    const [listFound,setlistFound]          = useState(true)

    useEffect(() => {
        setlistofData(rawaccounts.data)
        setlistLoading(rawaccounts.load)
    }, [rawaccounts.load == true]);

    const onByRoles =(i)=>{
        setfilterRole(i)
        console.log(i)
    }

    const onByStatus =(i)=>{
        setfilterStatus(i)
    }

    const onByApp =(i)=>{
        setfilterApp(i)
    }
    
    const onBySort=(i)=>{
      setfilterSort(i)
      console.log(i)
    }

    const onBySortBy=(i)=>{
      setfilterSortBy(i)

    }

    const onBySearch=(i)=>{
      setfilterSearch(i)
      console.log(i)
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

        <Typography variant="h3">Accounts</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New Account 
        </Button>

      </Stack>


      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid xs={6} sm={6} md={6}>
          <OnSorting byRoles={onByRoles} byStatus={onByStatus} byApp={onByApp} bySort={onBySort} bySortBy={onBySortBy}/>
          </Grid>
          <Grid xs={6} sm={6} md={6}>
          <OnSearching bySearching={onBySearch} />
          </Grid>
      </Grid>

        <Divider sx={{ borderStyle: 'dashed', m: 3 }} />

      <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 10, md: 20 }}>
    { listLoading == false ? 
      <>
        <Grid  xs={2} sm={3} md={4}>
          <Skeleton width="100%" height="300px" />
        </Grid>
        <Grid  xs={2} sm={3} md={4}>
          <Skeleton width="100%" height="300px" />
        </Grid>
        <Grid  xs={2} sm={3} md={4}>
          <Skeleton width="100%" height="300px" />
        </Grid>
        <Grid  xs={2} sm={3} md={4}>
          <Skeleton width="100%" height="300px" />
        </Grid>
        <Grid  xs={2} sm={3} md={4}>
          <Skeleton width="100%" height="300px" />
        </Grid>
      </>
    :
      <>
      {listFound == true ?
        <>
          {listofData.map((i, index) => (
          <LoadCards key={i.increment}
                    data={{
                            cover:        i.appImage,
                            appname:      i.appName,
                            clubs:        i.accountClubsCount,
                            accountid:    i.accountID,
                            nickname:     i.accountNickname,
                            role:         i.accountRole,
                            avatar:       i.userAvatar,
                            status:       i.statusLabel,
                        }} />
        ))}
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



    </Container>
  );
}


//cover, title, view, comment, share, author, createdAt, index

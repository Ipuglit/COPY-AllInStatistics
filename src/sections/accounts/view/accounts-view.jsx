import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import { RawAccounts } from 'src/hooks/raw/accounts';
import Iconify from 'src/components/iconify';

import LoadCards from '../post-card';

import OnSorting from '../sorting';

// ----------------------------------------------------------------------

export default function AccountsView() {

    const [filterStatus,setfilterStatus]    = useState('ALL')
    const [filterRole,setfilterRole]        = useState('EVERYONE')
    const [filterApp,setfilterApp]          = useState('ALL')

    const rawaccounts                       = RawAccounts(  filterStatus ? filterStatus : "ALL",
                                                            filterRole ? filterRole : "EVERYONE",
                                                            filterApp ? filterApp : "ALL",)

    const [accountlist,setAccountlist]      = useState([])
    const [listLoading,setlistLoading]      = useState(false)
    const [listFound,setlistFound]          = useState(true)

    useEffect(() => {
        setAccountlist(rawaccounts.data)
        setlistLoading(rawaccounts.load)
    }, [rawaccounts.load == true]);

    const onByRoles =(i)=>{
        setfilterRole(i)
    }

    const onByStatus =(i)=>{
        setfilterStatus(i)
    }

    const onByApp =(i)=>{
        setfilterApp(i)
    }
    
    useEffect(() => {
      if(listLoading == true){
        if (!accountlist.length) {
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

      <Stack mb={3} direction="row" alignItems="right" justifyContent="flex-start">

            <OnSorting byRoles={onByRoles} byStatus={onByStatus} byApp={onByApp}/>

      </Stack>

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
          {accountlist.map((i, index) => (
          <LoadCards key={i.id}
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

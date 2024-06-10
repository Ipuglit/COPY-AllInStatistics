import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
// import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { RawAccounts } from 'src/hooks/raw/accounts';
import Iconify from 'src/components/iconify';

import PostCard from '../post-card';

import OnSorting from '../sorting';
// ----------------------------------------------------------------------

export default function AccountsView() {

    const [filterStatus,setfilterStatus]    = useState('ALL')
    const [filterRole,setfilterRole]        = useState('EVERYONE')
    const [filterApp,setfilterApp]          = useState('ALL')

    const rawaccounts                       = RawAccounts(  filterStatus ? filterStatus : "ALL",
                                                            filterRole ? filterRole : "EVERYONE",
                                                            filterApp ? filterApp : "ALL",)

    const [accountlist,setAccountlist] = useState([])
    const [listLoading,setlistLoading] = useState(false)
    const [listFound,setlistFound] = useState(true)

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
          <PostCard key={i.id} cover={i.appImage} nickname={i.accountNickname} app={i.appName} clubs={i.accountClubsCount} idd={i.accountID} status={i.statusLabel} 
                    user={{
                        name: i.accountNickname,
                        avatarUrl: i.userAvatar,
                      }} 
                      roleName={i.accountRole}/>
        ))}
        </>
      :
                <Typography variant="body2"
                            component="div"
                            sx={{
                              mb: 0,
                              size: 20,
                              color: 'text.disabled',
                            }}>
                  Nothing found...
                </Typography>
      }

      </>
    }

      </Grid>



    </Container>
  );
}


//cover, title, view, comment, share, author, createdAt, index

import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
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

    useEffect(() => {
        setAccountlist(rawaccounts.data)
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
        {accountlist.map((i, index) => (
          <PostCard key={i.id} cover={i.appImage} nickname={i.accountNickname} app={i.appName} clubs={i.accountClubsCount} idd={i.accountID} status={i.statusLabel} 
                    user={{
                        name: i.accountNickname,
                        avatarUrl: i.userAvatar,
                      }} 
                      roleName={i.accountRole} index={index} />
        ))}
      </Grid>
    </Container>
  );
}


//cover, title, view, comment, share, author, createdAt, index

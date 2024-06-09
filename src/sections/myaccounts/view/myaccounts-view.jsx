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
import PostSort from '../post-sort';
import PostSearch from '../post-search';

// ----------------------------------------------------------------------

export default function MyAccountsView() {

    const rawaccounts = RawAccounts("MY","")

    const [accountlist,setAccountlist] = useState([])

    useEffect(() => {
        setAccountlist(rawaccounts.data)
    }, [rawaccounts.load == true]);

    const sortBy =()=>{
      
    }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h3">Accounts</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New Account
        </Button>

      </Stack>

      <Stack mb={3} direction="row" alignItems="center" justifyContent="space-between">

        <PostSearch posts={accountlist} />

        <PostSort
          options={[
                    { value: 'Everyone', label: 'Everyone' },
                    { value: 'Player', label: 'Player' },
                    { value: 'Agent', label: 'Agent' },
                    { value: 'Super Agent', label: 'Super Agent' },
                    { value: 'Agency', label: 'Agency' },
                  ]}
        />

      </Stack>
      
      <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 3, sm: 8, md: 18 }}>
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

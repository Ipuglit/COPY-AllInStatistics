import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

// import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { posts } from 'src/_mock/blog';
import { RawUsers } from 'src/hooks/raw/users';
import Iconify from 'src/components/iconify';

import PostCard from '../post-card';
import PostSort from '../post-sort';
import PostSearch from '../post-search';

// ----------------------------------------------------------------------

export default function UsersView() {

    const rawusers = RawUsers()

    const [userlist,setUserlist] = useState([])

    useEffect(() => {
        setUserlist(rawusers.data)
    }, [rawusers.load == true]);

    const sortBy =()=>{
      
    }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h3">Users</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New User
        </Button>

      </Stack>

      <Stack mb={3} direction="row" alignItems="center" justifyContent="space-between">

        <PostSearch posts={userlist} />

        <PostSort
          options={[
                    { value: 'Everyone', label: 'Everyone' },
                    { value: 'Player', label: 'Player' },
                    { value: 'Customers', label: 'Customers' },
                    { value: 'Cash Admin', label: 'Cash Admin' },
                    { value: 'Owner Admin', label: 'Owner Admin' },
                  ]}
        />

      </Stack>
      
      <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 3, sm: 8, md: 14.5 }}>
        {userlist.map((i, index) => (
          <PostCard key={i.id} 
                    index={index}
                    data={{
                      cover:          "/images/users.png",
                      idd:            i.idd,
                      nickname:       i.nickname,
                      rolename:       i.roleName,
                      email:          i.email,
                      telegram:       i.telegram,
                      avatar:         i.avatarFull,
                      status:         i.statusLabel,
                    }}  />
        ))}
      </Grid>

    </Container>
  );
}


//cover, title, view, comment, share, author, createdAt, index

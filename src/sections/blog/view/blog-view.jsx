import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { posts } from 'src/_mock/blog';
import { RawUsers } from 'src/hooks/raw/users';
import Iconify from 'src/components/iconify';

import PostCard from '../post-card';
import PostSort from '../post-sort';
import PostSearch from '../post-search';

// ----------------------------------------------------------------------

export default function BlogView() {
  const rawusers = RawUsers()
  const [userlist,setUserlist] = useState([])

  useEffect(() => {
      setUserlist(rawusers.data)
  }, [rawusers.load == true]);


  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Blog</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New User
        </Button>

      </Stack>

      <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">

        <PostSearch posts={posts} />

        <PostSort
          options={[
            { value: 'latest', label: 'Latest' },
            { value: 'popular', label: 'Popular' },
            { value: 'oldest', label: 'Oldest' },
          ]}
        />

      </Stack>
      
      <Grid container spacing={4}>
        {userlist.map((i, index) => (
          <PostCard key={i.idd} cover={"/images/users.png"} nickname={i.nickname} email={i.email} telegram={i.telegram} idd={i.idd} 
                    user={{
                        name: i.nickname,
                        avatarUrl: i.avatarFull,
                      }} 
                      roleName={i.roleName} index={index} />
        ))}
      </Grid>



      
    </Container>
  );
}


//cover, title, view, comment, share, author, createdAt, index
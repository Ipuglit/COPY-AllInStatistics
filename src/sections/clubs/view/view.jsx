import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

// import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { posts } from 'src/_mock/blog';
import { RawClubs } from 'src/hooks/raw/clubs';
import Iconify from 'src/components/iconify';

import PostCard from '../post-card';
import PostSort from '../post-sort';
import PostSearch from '../post-search';

// ----------------------------------------------------------------------

export default function ClubsView() {

    const [dataFilter,setdataFilter] = useState("ALL")
    const [datas,setdatas]      = useState(true)
    const rawData = RawClubs(dataFilter)

    const [datalist,setdataList] = useState([])

    useEffect(() => {
        setdataList(rawData.data)
    }, [rawData.load == true]);

    const sortBy =()=>{
      
    }

    const onFilter =(i)=>{
      setdataFilter(i)
      setdatas(false)

      const T = setTimeout(() => {
        setdatas(true)

      }, 500);
      return () => clearTimeout(T);

      console.log(i)
    }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h3">Clubs</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New Club
        </Button>

      </Stack>

      <Stack mb={3} direction="row" alignItems="center" justifyContent="space-between">

        <PostSearch posts={datalist} />

        <PostSort
          options={[
                    { value: 'ALL', label: 'All' },
                    { value: 'ACTIVE', label: 'Active' },
                    { value: 'PENDING', label: 'Pending' },
                    { value: 'ACTIVEPENDING', label: 'Active & Pending' },
                    { value: 'DISABLED', label: 'Disabled' },
                  ]}
                  selected={onFilter}
        />

      </Stack>
      
      <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 3, sm: 8, md: 14.5 }}>
        {datalist.map((i, index) => (
          <PostCard key={i.id} 
                    index={index}
                    data={{
                      cover:          "/images/users.png",
                      idd:            i.idd,
                      name:           i.name,
                      app:            i.appName,
                      appimage:       i.appImage,
                      type:           i.type,
                      union:          i.unionName,
                      percent:        i.percent,
                      avatar:         i.image,
                      status:         i.statusLabel,
                    }} />
        ))}
      </Grid>

    </Container>
  );
}


//cover, title, view, comment, share, author, createdAt, index

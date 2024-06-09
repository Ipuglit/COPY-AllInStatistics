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

import React from 'react';
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

// ----------------------------------------------------------------------

export default function BlogView() {
  const rawusers = RawUsers()
  const [userlist,setUserlist] = useState([])

  useEffect(() => {
      setUserlist(rawusers.data)
  }, [rawusers.load == true]);

  const columns = [ { field: "id", headerName: "ID", flex: 0.5 },    
                    { field: "registrarId", headerName: "Registrar ID" },    
                    {      field: "name",      headerName: "Name",      flex: 1,      cellClassName: "name-column--cell no-border-bottom",    },    
                    {      field: "age",      headerName: "Age",      type: "number",      headerAlign: "left",      align: "left",    },    
                    { field: "phone", headerName: "Phone Number", flex: 1 },    
                    { field: "email", headerName: "Email", flex: 1 },    
                    { field: "address", headerName: "Address", flex: 1 },    
                    { field: "city", headerName: "City", flex: 1 },    
                    { field: "zipCode", headerName: "Zip Code", flex: 1 },  
                  ];
  const mockDataContacts = [
                    {
                      id: 1,
                      name: "Jon Snow",
                      email: "jonsnow@gmail.com",
                      age: 35,
                      phone: "(665)121-5454",
                      address: "0912 Won Street, Alabama, SY 10001",
                      city: "New York",
                      zipCode: "10001",
                      registrarId: 123512,
                    },
                    {
                      id: 2,
                      name: "Cersei Lannister",
                      email: "cerseilannister@gmail.com",
                      age: 42,
                      phone: "(421)314-2288",
                      address: "1234 Main Street, New York, NY 10001",
                      city: "New York",
                      zipCode: "13151",
                      registrarId: 123512,
                    },
                    {
                      id: 3,
                      name: "Jaime Lannister",
                      email: "jaimelannister@gmail.com",
                      age: 45,
                      phone: "(422)982-6739",
                      address: "3333 Want Blvd, Estanza, NAY 42125",
                      city: "New York",
                      zipCode: "87281",
                      registrarId: 4132513,
                    },
                    {
                      id: 4,
                      name: "Anya Stark",
                      email: "anyastark@gmail.com",
                      age: 16,
                      phone: "(921)425-6742",
                      address: "1514 Main Street, New York, NY 22298",
                      city: "New York",
                      zipCode: "15551",
                      registrarId: 123512,
                    },
                    {
                      id: 5,
                      name: "Daenerys Targaryen",
                      email: "daenerystargaryen@gmail.com",
                      age: 31,
                      phone: "(421)445-1189",
                      address: "11122 Welping Ave, Tenting, CD 21321",
                      city: "Tenting",
                      zipCode: "14215",
                      registrarId: 123512,
                    },
                    {
                      id: 6,
                      name: "Ever Melisandre",
                      email: "evermelisandre@gmail.com",
                      age: 150,
                      phone: "(232)545-6483",
                      address: "1234 Canvile Street, Esvazark, NY 10001",
                      city: "Esvazark",
                      zipCode: "10001",
                      registrarId: 123512,
                    },
                    {
                      id: 7,
                      name: "Ferrara Clifford",
                      email: "ferraraclifford@gmail.com",
                      age: 44,
                      phone: "(543)124-0123",
                      address: "22215 Super Street, Everting, ZO 515234",
                      city: "Evertin",
                      zipCode: "51523",
                      registrarId: 123512,
                    },
                    {
                      id: 8,
                      name: "Rossini Frances",
                      email: "rossinifrances@gmail.com",
                      age: 36,
                      phone: "(222)444-5555",
                      address: "4123 Ever Blvd, Wentington, AD 142213",
                      city: "Esteras",
                      zipCode: "44215",
                      registrarId: 512315,
                    },
                    {
                      id: 9,
                      name: "Harvey Roxie",
                      email: "harveyroxie@gmail.com",
                      age: 65,
                      phone: "(444)555-6239",
                      address: "51234 Avery Street, Cantory, ND 212412",
                      city: "Colunza",
                      zipCode: "111234",
                      registrarId: 928397,
                    },
                    {
                      id: 10,
                      name: "Enteri Redack",
                      email: "enteriredack@gmail.com",
                      age: 42,
                      phone: "(222)444-5555",
                      address: "4123 Easer Blvd, Wentington, AD 142213",
                      city: "Esteras",
                      zipCode: "44215",
                      registrarId: 533215,
                    },
                    {
                      id: 11,
                      name: "Steve Goodman",
                      email: "stevegoodmane@gmail.com",
                      age: 11,
                      phone: "(444)555-6239",
                      address: "51234 Fiveton Street, CunFory, ND 212412",
                      city: "Colunza",
                      zipCode: "1234",
                      registrarId: 92197,
                    },
                    {id: 12,
                      name: "Bethany Foster",
                      email: "bethanyfoster@yahoo.com",
                      age: 27,
                      phone: "(555)444-2342",
                      address: "8675 Fourth Ave, Suite 100",
                      city: "New York",
                      zipCode: "10001",
                      registrarId: 29583,
                    },
                    {id: 13,
                      name: "David Kim",
                      email: "davidkim@gmail.com",
                      age: 43,
                      phone: "(444)777-9823",
                      address: "9387 Fifth St, Apt 2B",
                      city: "Los Angeles",
                      zipCode: "90210",
                      registrarId: 45896,
                    },
                    {id: 14,
                      name: "Rachel Lee",
                      email: "rachellee@hotmail.com",
                      age: 19,
                      phone: "(555)333-4895",
                      address: "2256 Sixth Ave, Unit 203",
                      city: "San Francisco",
                      zipCode: "94103",
                      registrarId: 17562,
                    },
                      
                  ];

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

    <Box m="20px">
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          borderTop: "none",

        }}
      >
        <DataGrid
          rows={mockDataContacts}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>

      
    </Container>
  );
}


//cover, title, view, comment, share, author, createdAt, index
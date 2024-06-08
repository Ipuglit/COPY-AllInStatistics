import { useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { products } from 'src/_mock/products';

import { RawApplications } from 'src/hooks/raw/applications';

import ProductCard from '../product-card';
import ProductSort from '../product-sort';
import ProductFilters from '../product-filters';
import ProductCartWidget from '../product-cart-widget';

// ----------------------------------------------------------------------

export default function ApplicationsView() {
  const [openFilter, setOpenFilter] = useState(false);

  const rawData = RawApplications()

  const [datalist,setdataList] = useState([])

  useEffect(() => {
      setdataList(rawData.data)
  }, [rawData.load == true]);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Applications
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>

          <ProductSort />
          <ProductSort />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {datalist.map((i) => (
          <Grid key={i.id} xs={4} sm={5} md={2}>
            <ProductCard data={{     id: i.id,
                                        cover: i.imageFull,
                                        name: i.name,
                                        usercount: i.userCount,
                                        accountcount: i.accountCount,
                                        status: i.statusLabel,}} 
                                        />
          </Grid>
        ))}
      </Grid>


    </Container>
  );
}

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';
import { ColorPreview } from 'src/components/color-utils';

// ----------------------------------------------------------------------

export default function imageCard({ data }) {
  const renderStatus = (
    <Label
      variant="filled"
      color={(data.status === 'sale' && 'error') || 'info'}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {data.status}
    </Label>
  );

  const renderImg = (
    <Box
      component="img"
      alt={data.name}
      src={data.cover}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderPrice = (
    <Typography variant="subtitle1">
      <Typography
        component="span"
        variant="body1"
        sx={{
          color: 'text.disabled',
        }}
      >
        <span style={{fontSize:"12px"}}>{data.accountcount != 0 ? data.accountcount+" accounts" : null}</span>
        <span style={{fontSize:"12px"}}>{data.usercount != 0 || data.usercount != null ? data.usercount+" users" : null}</span>
      </Typography>
      
      {data.price}
    </Typography>
  );

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {data.status && renderStatus}
        {renderImg}
      </Box>

      <Stack spacing={1} sx={{ p: 2 }}>
        <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
          {data.name}
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {renderPrice}
        </Stack>
      </Stack>
    </Card>
  );
}

imageCard.propTypes = {
  product: PropTypes.object,
};

// import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
// import { alpha } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
// import { fDate } from 'src/utils/format-time';
// import { fShortenNumber } from 'src/utils/format-number';

// import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

export default function PostCard({ cover, nickname, email, telegram, idd, user, roleName, index }) {
  ///const { cover, title, view, comment, share, author, createdAt } = post;

  return (
    <Grid xs={12} md={3}>
      <Card>
        <Box
          sx={{
            position: 'relative',
            pt: 'calc(100% * 2 / 5)',
          }}
        >
        <SvgColor
          color="paper"
          src="/assets/icons/shape-avatar.svg"
          sx={{
            width: 80,
            height: 36,
            zIndex: 9,
            bottom: -15,
            position: 'absolute',
            color: 'background.paper',
          }}
        />

        <Avatar
          alt={user.name}
          src={user.avatarUrl}
          sx={{
            zIndex: 9,
            width: 42,
            height: 42,
            position: 'absolute',
            left: (theme) => theme.spacing(2.5),
            bottom: (theme) => theme.spacing(-2),
          }}
        />
        <Box
          component="img"
          alt={nickname}
          src={cover}
          sx={{
            top: 0,
            width: 1,
            height: 1,
            objectFit: 'cover',
            position: 'absolute',
          }}
        />
        </Box>

        <Box
          sx={{
            p: (theme) => theme.spacing(4, 3, 3, 3),
          }}
        >
          <Typography
            variant="caption"
            component="div"
            sx={{
              mb: 0,
              color: 'text.disabled',
            }}
          >
            {roleName}
          </Typography>

          <Link
            color="inherit"
            variant="subtitle2"
            underline="hover"
            sx={{
              height: 25,
              overflow: 'hidden',
              WebkitLineClamp: 2,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
            }}
          >
            <span style={{fontSize:"17px"}}>{nickname}</span>
          </Link>

          <Stack
            direction="row"
            flexWrap="wrap"
            spacing={1.5}
            justifyContent="flex-end"
            sx={{
              mt: 1,
              color: 'text.disabled',
            }}
          >
            <Tooltip title={telegram} arrow>
              <Stack direction="row">
                <Icon icon="mdi:telegram" width={20} sx={{ mr: 0.5 }}  />
              </Stack>
            </Tooltip>

            <Tooltip title={email} arrow>
              <Stack direction="row">
                <Icon icon="mdi:email" width={20} sx={{ mr: 0.5 }}  />
              </Stack>
            </Tooltip>

          </Stack>
        </Box>

      </Card>
    </Grid>
  );
}

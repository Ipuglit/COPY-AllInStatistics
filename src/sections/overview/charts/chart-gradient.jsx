import PropTypes from 'prop-types';
import { useState } from 'react';
import {Box,Card,CardHeader,Paper,Typography,Button,Menu,MenuItem, Stack} from '@mui/material/';

import Chart, { useChart } from 'src/components/chart';
import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'
// ----------------------------------------------------------------------

export default function ChartGradient({ filter, what, title, subheader, chart, ...other }) {

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const { labels, colors, series, options } = chart;

  const chartOptions = useChart({
    colors,
    plotOptions: {
      bar: {
        columnWidth: '25%',
      },
    },
    fill: {
      type: series.map((i) => i.fill),
    },
    labels,
    xaxis: {
      type: 'datetime',
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return `${value.toFixed(0)} USD`;
          }
          return value;
        },
      },
    },
    ...options,
  });

  return (
    <Paper elevation={1} sx={{ padding: 3, display: 'flex', alignItems: 'center' }} {...other}>
      
      <Box sx={{ flexGrow: 1 }}>

        <Typography variant="h4" gutterBottom>
          {title}

          <Box>

            <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose} >
              <MenuItem onClick={handleClose}>by weeks</MenuItem>
              <MenuItem onClick={handleClose}>by months</MenuItem>
              <MenuItem onClick={handleClose}>by years</MenuItem>
            </Menu>

            <Button onClick={handleClick} style={{marginTop:'-10px'}} size='small' >
              Date
            </Button>

            <>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={()=>filter({modal: true, title: what})} style={{marginTop:'-10px'}} size='small' >
              Filter
            </Button>
            </>

          </Box>


        </Typography>
      <Box sx={{ p: 0, pb: 0 }}>


        <Chart
          dir="ltr"
          type="line"
          series={series}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>
      </Box>
    </Paper>
  );
}

ChartGradient.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

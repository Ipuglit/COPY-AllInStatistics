import PropTypes from 'prop-types';
import { useState } from 'react';
import {Box,Card,CardHeader,Button,Menu,MenuItem} from '@mui/material/';


import { fNumber } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';



// ----------------------------------------------------------------------

export default function ChartGauge({ title, subheader, chart, vertical, horizontal,  ...other }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { colors, series, options } = chart;

  const chartSeries = series.map((i) => i.value);

  const chartOptions = useChart({
    colors,
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: () => '',
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: horizontal,
        vertical: vertical,
        barHeight: '45%',
        borderRadius: 2,
      },
    },
    xaxis: {
      categories: series.map((i) => i.label),
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ mx: 3 }}>
      <div>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          Filter
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Last 10 weeks</MenuItem>
          <MenuItem onClick={handleClose}>Last 12 months</MenuItem>
          <MenuItem onClick={handleClose}>Last 10 years</MenuItem>
        </Menu>
      </div>
        <Chart
          dir="ltr"
          type="bar"
          series={[{ data: chartSeries }]}
          options={chartOptions}
          width="100%"
          height={364}
        />

      </Box>
    </Card>
  );
}

ChartGauge.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,

};

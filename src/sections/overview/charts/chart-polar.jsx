import PropTypes from 'prop-types';
import { useState } from 'react';
import {Box,Card,CardHeader,Button,Menu,MenuItem} from '@mui/material/';


import { fNumber } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';
import { BorderAll } from '@mui/icons-material';



// ----------------------------------------------------------------------

export default function ChartPolar({ title, subheader, chart, vertical, horizontal,  ...other }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { colors, series, labels,fillcolor } = chart;

  const chartOptions = useChart({

    series: series,
    labels: labels,
    fill: {
        colors: fillcolor, // Violet colors,
        BorderAll: 0
      },
      legend: {
        show: true
      },
    options: {
        chart: {
          type: 'polarArea',

          redrawOnWindowResize: true
        },
        stroke: {
          colors: ['#fff']
        },
        fill: {
          opacity: .5,

        },

        responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: '100%'
              },
              legend: {
                position: 'bottom'
              }
            }
        }]
    },
    theme: {
        monochrome: {
          enabled: true,
          shadeTo: 'light',
          shadeIntensity: 0.1,
          colors:fillcolor
        }
      },
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
          type="polarArea"
          series={series}
          labels={labels}
          fillcolor={fillcolor}
          options={chartOptions}
          width="100%"
          height={364}
        />

      </Box>
    </Card>
  );
}

ChartPolar.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,

};

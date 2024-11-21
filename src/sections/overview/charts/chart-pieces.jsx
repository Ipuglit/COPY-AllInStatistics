import PropTypes from 'prop-types';
import { useState } from 'react';
import {Box,Card,CardHeader,Button,Menu,MenuItem} from '@mui/material/';
import OnMobileScreen from 'src/items/screen/resize';

import Chart, { useChart } from 'src/components/chart';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

// ----------------------------------------------------------------------

export default function Charts_Pieces({ title, subheader, color, chart, vertical, horizontal,  ...other }) {

  const { colors, series, options } = chart;

  const chartSeries = series.map((i) => i.value);

  const chartOptions = useChart({

    chart: {
        type: 'area',
        sparkline: {
          enabled: true
        },
      },
      stroke: {
        curve: 'straight'
      },
      fill: {
        opacity: 0.1,
      },
      yaxis: {
        min: 0,

      },
      colors: ['#9370DB'],
      title: {
        text: title,
        offsetX: 0,
        style: {
          color: '',
          fontSize: OnMobileScreen() ? 15 : 20,
        }
      },
      subtitle: {
        text: subheader,
        offsetX: 0,
        style: {
          fontSize: OnMobileScreen() ? 10 : 12,
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          title: {
            formatter: function (seriesName) {
              return ''
            }
          }
        },
        x: {
          show: false
        },
      },
    ...options,
  });

  return (

      <Box sx={{ mx: 0 }}>
            <Chart options={chartOptions} 
                    series={[{ data: chartSeries }]}
                    type="area" 
                    width="100%"
                    height={120} />
      </Box>

  );
}

Charts_Pieces.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,

};

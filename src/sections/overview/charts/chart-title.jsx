import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';

export default function ChartTitle({ title, subheader, chart, type, sublabel, barWidth, ...other }) {
    const { labels, colors, series, options } = chart;

    const chartOptions = useChart({
      colors,
      plotOptions: {
        bar: {
          columnWidth: barWidth+'%' ? barWidth+'%' : '35%',
        },
      },
      fill: {
        type: series.map((i) => i.fill),
      },
      labels,
      xaxis: {
        type: type ? type : 'category', //category,datetype,numeric
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (value) => {
            if (typeof value !== 'undefined') {
              return `${value.toFixed(0)+' '+(sublabel ? sublabel : ' data')} `;
            }
            return value;
          },
        },
      },
      ...options,
    });

  return (
    <Paper elevation={1} sx={{ padding: 2, display: 'flex', alignItems: 'center' }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ width:"100%" }}>
        <Chart
          dir="ltr"
          type="line"
          series={series}
          options={chartOptions}
          height={250}
        />
        </Box>
      </Box>
    </Paper>
  );
};
ChartTitle.propTypes = {
    chart: PropTypes.object,
    subheader: PropTypes.string,
    title: PropTypes.string,
    sublabel: PropTypes.string,
    type: PropTypes.string,
    barWidth: PropTypes.string,
  };
  
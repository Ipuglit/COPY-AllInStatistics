import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Button, IconButton, LinearProgress  } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';

import Iconify from 'src/components/iconify';

import { RawFetch } from 'src/hooks/raw/';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

export default function Chart_HundredPercents({ onData, chart, sublabel, barWidth, ...other }) {

    const fillSeries = (data) => {
      const categories = ['total_agencybonus', 'total_agencyaction', 'total_playerresult'];
    
      return data.name.map((name, index) => ({
        name,
        group: 'budget',
        data: categories.map(x => {return data[x][index] > 0 ? data[x][index] : 0}),
      }));
      
    };

    const DataS = [
      {
        name: 'Poker A',
        group: 'positive',
        data: [40, 50, 50]
      },
      {
        name: 'Poker B',
        group: 'positive',
        data: [60, 50, 50]
      },
      {
        name: 'Q1 Actual',
        group: 'negative',
        data: [30, 50, 50]
      },
      {
        name: 'Q2 Actual',
        group: 'negative',
        data: [70, 50, 50]
      }
    ]

    function labelAxis(value) {
      return value + ' USD';
    }

    const chartOptions = useChart({
        chart: {
        type: 'bar',
        stacked: true,

      },
      plotOptions: {
        bar: {
          horizontal: true,
          barWidth: '100%'
        },
      },
      stroke: {
        width: 0.5,
      },
      xaxis: {
        categories: ['Agency Action','Agency Bonus','Player Results'],
        height: 40,
       
        labels: { formatter: (value) => {
          return value + '%';
        }, 
        show: false,
      },
      },
      tooltip: {
        y: {
          formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
            const total = series.reduce((acc, val) => acc + val[dataPointIndex], 0);
            const percentage = ((value / total) * 200);
           // return `${percentage}%`;
            return `${DataS[dataPointIndex]?.name} (${percentage}%)`;
          },
        },
      },
      fill: {
        opacity: 1
        
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 90,
        show: false
      },
      
      colors: ['#90CAF9', '#42A5F5', '#1976D2', '#0D47A1', '#448AFF', '#2962FF', '#81D4FA', '#29B6F6', '#0288D1', '#01579B', '#40C4FF', '#0091EA', '#18FFFF', '#00E5FF', '#00B8D4']

    });

   // console.log(fillSeries(onData))

  return (
        <>
        <Chart
          type="bar"
          //series={fillSeries(onData)}
          series={DataS}
          options={chartOptions}
          height={'100%'}
        />
        </>
  );
};
Chart_HundredPercents.propTypes = {
    chart: PropTypes.object,
    subheader: PropTypes.string,
    sublabel: PropTypes.string,
    barWidth: PropTypes.string,
  };
  
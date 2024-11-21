import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Button, IconButton, LinearProgress  } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';

import Iconify from 'src/components/iconify';

import { RawFetch } from 'src/hooks/raw/';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

export default function Chart_HundredPercents({ onData, chart, sublabel, onWhat, barWidth, ...other }) {

    const fillSeries = (data) => {

      const categories = onWhat == 'positive' ? ['total_agencybonus', 'total_agencyaction', 'total_playerresult'] : ['total_agencyaction', 'total_playerresult'];
    
      return data.name.map((name, index) => ({
        name,
        data: onWhat == 'positive' ? categories.map(x => {return data[x][index] > 0 ? data[x][index] : 0}) : categories.map(x => {return data[x][index] < 0 ? data[x][index] : 0}),
      }));
      
    };

    const colorPositives = ['#90CAF9', '#42A5F5', '#1976D2', '#0D47A1', '#448AFF', '#2962FF', '#81D4FA', '#29B6F6', '#0288D1', '#01579B', '#40C4FF', '#0091EA', '#18FFFF', '#00E5FF', '#00B8D4']
    const colorNegatives = ['#E57373', '#EF5350', '#E53935', '#D32F2F', '#C62828', '#B71C1C', '#FF8A80', '#FF5252', '#FF1744', '#D50000', '#FF7043', '#E64A19', '#BF360C', '#FF3D00', '#DD2C00']


    function labelAxis(value) {
      return value + ' USD';
    }

    const chartOptions = useChart({
        chart: {
        type: 'bar',
        stacked: true,
        stackType: '100%'
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      stroke: {
        width: 0.5,
      },
      xaxis: {
        categories: onWhat == 'positive' ? ['Agency Bonus','Agency Action','Player Results'] : ['Agency Action','Player Results'],
        height: 40,
       
        labels: { formatter: (value) => {
          return value + '%';
        }, 
        show: false,
      },
      },
      yaxis: {
        stepSize: 1
      },
      tooltip: {
        y: {
          formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
            const total = series.reduce((acc, val) => acc + val[dataPointIndex], 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return onWhat == 'positive' ? `${percentage}%` : `-${percentage}%`;
            //return `${value} (${percentage}%)`;
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
      colors: onWhat == 'positive' 
              ? 
              colorPositives
              :
              colorNegatives

    });

  console.log(colorNegatives[2])

  return (
        <>
        <Chart
          type="bar"
          series={fillSeries(onData)}
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
  
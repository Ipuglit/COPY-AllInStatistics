import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Button, IconButton } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';

import Iconify from 'src/components/iconify';

import { RawFetch } from 'src/hooks/raw/';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

export default function Charts_BarPercents({ onData, onFiltered, subheader, chart, sublabel, barWidth, ...other }) {

    const chartDATA         = onData.data


      const convertXYData = ({ titulo, day, value,  }) => {
        const data = value.map((v, index) => ({
            x: day[index],
            y: parseInt(v,10),
        }));
      
        return {
          name: titulo,
          data,
        };
      };


      const fillSeries = [
        {
          name: 'Agency Action',
          data: chartDATA.total_agencyaction,
        },
        {
          name: 'Agency Bonus',
          data: chartDATA.total_agencybonus,
        },
        {
          name: 'Player Result',
          data: chartDATA.total_playerresult,
        },
      ]

    function labelAxis(value) {
      return value + ' USD';
    }

    const chartOptions = useChart({

        series: fillSeries,
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          stackType: '100%'
        },
        plotOptions: {
          bar: {
            horizontal: true,
            columnWidth: '95%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: true
        },
        stroke: {
          width: 2
        },
        xaxis: {
          categories: ['1', '2', '3', '4', '5', '6','7', '8', '9', '10', '11', '12']
        },
        yaxis: {
          title: {
            //text: 'Value'
          }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + "K"
            }
          }
        },
        legend: {
          position: 'right',
          offsetY: -25,
          offsetX: -15
        }

    });



  return (
    <Paper elevation={1} sx={{ padding: 2, display: 'flex', alignItems: 'center' }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5" gutterBottom sx={{marginBottom:'10px'}}>
          {onData.title} %
          <Typography style={{fontSize:'13px', color: 'gray', marginTop:'-2px'}}>
            {subheader}
          </Typography>
        </Typography>

        <Box sx={{ width:"100%" }}>
        <Chart
          type='bar'
          series={fillSeries}
          options={chartOptions}
          height={305}
        />
        {Fnc.JSONS(chartDATA,false)}

        </Box>
      </Box>
    </Paper>
  );
};
Charts_BarPercents.propTypes = {
    chart: PropTypes.object,
    subheader: PropTypes.string,
    sublabel: PropTypes.string,
    barWidth: PropTypes.string,
  };
  
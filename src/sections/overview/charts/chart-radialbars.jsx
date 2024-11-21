import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Button, IconButton } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';

import Iconify from 'src/components/iconify';

import { RawFetch } from 'src/hooks/raw/';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'
import { Padding } from '@mui/icons-material';

export default function Charts_RadialBars({ subValue, subTitle, subHeight, subColor, chart, sublabel, barWidth, ...other }) {

    const chartOptions = useChart({
        series: [subValue],
        
            options: {
              chart: {
                type: 'radialBar',
                offsetY: -20,
                sparkline: {
                  enabled: true
                },
              },
              plotOptions: {
                radialBar: {
                  startAngle: -135,
                  endAngle: 225,
                   hollow: {
                    margin: 0,
                    size: '70%',
                    background: '#fff',
                    image: undefined,
                    imageOffsetX: 0,
                    imageOffsetY: 0,
                    position: 'front',
                    dropShadow: {
                      enabled: true,
                      top: 3,
                      left: 0,
                      blur: 4,
                      opacity: 0.24
                    }
                  },
                  track: {
                    background: '#fff',
                    strokeWidth: '67%',
                    margin: 0, // margin is in pixels
                    dropShadow: {
                      enabled: true,
                      top: -3,
                      left: 0,
                      blur: 4,
                      opacity: 0.35
                    }
                  },
              
                  dataLabels: {
                    show: true,
                    name: {
                      offsetY: -10,
                      show: true,
                      color: '#888',
                      fontSize: '13px',
                    },
                    value: {
                      formatter: function(val) {
                        return val ? parseInt(val)+'%' : '0%';
                      },
                      color: '#111',
                      fontSize: '30px',
                      show: true,
                    }
                  }
                }
              },

              fill: {
                type: 'gradient',
                colors: [subColor ?  subColor : '#FF00FF'],
                gradient: {
                  shade: 'dark',
                  shadeIntensity: 0.4,
                  inverseColors: false,
                  opacityFrom: 1,
                  opacityTo: 1,
                  stops: [0, 50, 53, 91]
                },
              },
              labels: [subTitle],
            },

    });

  return (

    <>
        <Box sx={{ flexGrow: 1,marginBottom:'-30px' }}>
        <Chart
          type="radialBar"
          options={chartOptions.options}
          series={chartOptions.series}
          height={subHeight}
        />
        </Box>

    </>



  );
};
Charts_RadialBars.propTypes = {
    chart: PropTypes.object,
    subheader: PropTypes.string,
    sublabel: PropTypes.string,
    barWidth: PropTypes.string,
  };
  
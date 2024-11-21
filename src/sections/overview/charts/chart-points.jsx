import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Button, IconButton, Skeleton } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';

import Iconify from 'src/components/iconify';

import { RawFetch } from 'src/hooks/raw/';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

export default function Charts_Points({ onData, onTitle, onFiltered, subheader, chart, sublabel, barWidth, ...other }) {

    const chartDATA         = onData.data


      const convertXYData = ({ titulo, day, value,  }) => {
        const data = value.map((v, index) => ({
            x: day[index],
            y: !Fnc.isNull(v,0) ? parseInt(v,10) : 0,
        }));
      
        return {
          name: titulo,
          data,
        };
      };

      function formatLabelDate(value) {
        const aa = onData.filteredDate == 'weeks' ? ' Week '+ value : onData.filteredDate == 'days' ? 'Day '+ value : onData.filteredDate == 'years' ? 'Year '+ value : Fnc.dateYearMonth(value)
        return aa ;
      }

    const fillSeries = [
                        convertXYData({titulo: 'Winnings',day: chartDATA.dateOrder, value: chartDATA.total_win_usd, }),
                        convertXYData({titulo: 'Losses',day: chartDATA.dateOrder, value: chartDATA.total_loss_usd, }),
                        ]

    function labelAxis(value) {
      return value + ' USD';
    }

    const chartOptions = useChart({
        colors: ['#8A2BE2', '#ed3330' ],
        series: fillSeries,
            chart: {
            type: 'area',
            height: 350
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'straight'
          },
          
          title: {
            text: '',
            align: 'left',
            style: {
              fontSize: '14px'
            }
          },
          xaxis: {
            type: 'category',
            labels: { formatter: formatLabelDate },
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            }
          },
          yaxis: {
            tickAmount: 4,
            floating: false,
            labels: {
              style: {
                colors: '#8e8da4',
              },
              offsetY: -7,
              offsetX: 0,
              formatter: (value) => {
                return Fnc.numExceedsBasic(value) + ' USD';
              }, 
            },
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false
            }
          },
          fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [20, 100, 100, 100]
              },
          },
          tooltip: {
            x: {
              format: "yyyy",
            },
            fixed: {
              enabled: false,
              position: 'topRight'
            }
          },
          grid: {
            yaxis: {
              lines: {
                offsetX: -30
              }
            },
            padding: {
              left: 20
            }
          }

    });

  return (
    <Paper elevation={1} sx={{ padding: 2, display: 'flex', alignItems: 'center' }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5" gutterBottom>
           {onTitle}
        </Typography>
        <Box>
          {
            onData.load ?
          <Chart
            type="area"
            series={fillSeries}
            options={chartOptions}
            height={233}
          />
          :
          <Skeleton width="100%"  sx={{marginTop:'-78px', marginBottom:'-65px',height:'393px',bgcolor: 'rgba(88,88,88, 0.2)'}}>
          <Typography>.</Typography>
          </Skeleton>
          }

        {Fnc.JSONS(chartDATA,false)}
        </Box>
      </Box>
    </Paper>
  );
};
Charts_Points.propTypes = {
    chart: PropTypes.object,
    subheader: PropTypes.string,
    sublabel: PropTypes.string,
    barWidth: PropTypes.string,
  };
  
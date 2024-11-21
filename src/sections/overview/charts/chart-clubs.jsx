import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Button, IconButton, Skeleton } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';

import Iconify from 'src/components/iconify';

import { RawFetch } from 'src/hooks/raw/';

import ChartInserts_Hundred from './insert-hundred'

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

export default function Charts_Clubs({ onTitle, sendData, onFiltered, subheader, chart, sublabel, barWidth, ...other }) {

  const [limit, setlimit]                    = useState(5);
  const [limitTil, setlimitTil]              = useState(0);
  const [rawFETCH, setrawFETCH]              = useState({...Cls.RawDefault, LIMIT: limit});
  const [rawREFRESH, setrawREFRESH]          = useState(1);

    const fetchDATA        = RawFetch(rawFETCH,rawREFRESH,'clubslist')

    const chartDATA    = (Fnc.isZERO(fetchDATA.data) ? fetchDATA.data  : []).reduce((a, i) => {
                                a.name.push(i.clubName.toUpperCase());
  
                                a.countRecords.push(i.countRecords);
                                a.countAccounts.push(i.countAccounts);
                                a.countAccounts_active.push(i.countAccounts_active);
                                a.countPlayer.push(i.countPlayer);
                                a.countUpline.push(i.countUpline);
                                a.countAgency.push(i.countAgency);
                                a.countDownline.push(i.countDownline);
  
                                a.total_bonus.push(i.total_bonus);
                                a.total_points.push(i.total_points);
                                a.total_win.push(i.total_win);
                                a.total_loss.push(i.total_loss);
  
                                a.total_bonus_usd.push(i.total_bonus_usd);
                                a.total_points_usd.push(i.total_points_usd);
                                a.total_win_usd.push(i.total_win_usd);
                                a.total_loss_usd.push(i.total_loss_usd);
  
                                a.total_agencyaction.push(i.total_agencyaction);
                                a.total_agencybonus.push(i.total_agencybonus);
                                a.total_playerresult.push(i.total_playerresult);
                                a.total_result.push(i.total_result);
                                a.total_bonuspercent.push(i.total_bonuspercent);
                                return a;
                              }, {  name:               [], 
                                  countRecords:         [], 
                                  countAccounts:        [], 
                                  countAccounts_active: [], 
                                  countPlayer:          [], 
                                  countUpline:          [], 
                                  countAgency:          [],
                                  countDownline:        [],
                                   total_bonus:         [], 
                                   total_points:        [], 
                                   total_win:           [], 
                                   total_loss:          [], 
                                   total_bonus_usd:     [], 
                                   total_points_usd:    [], 
                                   total_win_usd:       [], 
                                   total_loss_usd:      [],
                                   total_agencyaction:  [], 
                                   total_agencybonus:   [], 
                                   total_playerresult:  [], 
                                   total_result:        [], 
                                   total_bonuspercent:  [] });

    const fillSeries = [
                          {
                            name: 'Agency Action',
                            type: 'column',
                            fill: 'solid',
                            data: chartDATA.total_agencyaction,
                          },
                          {
                            name: 'Agency Bonus',
                            type: 'column', //area
                            fill: 'solid',  //gradient
                            data: chartDATA.total_agencybonus,
                          },
                          {
                            name: 'Player Result',
                            type: 'column', //area
                            fill: 'solid',  //gradient
                            data: chartDATA.total_playerresult,
                          },
                        ]

    function labelAxis(value) {
      return value + ' USD';
    }

    const chartOptions = useChart({
      colors: ['#9370DB', '#FF00FF'],
      series: fillSeries,
        chart: {
          chart: {
            type: 'bar',
            height: 350,
      },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: fetchDATA.tally < 4 ? '26px' : '23px',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: chartDATA.name,
        labels: {
          rotate: -20,
          style: {
            fontSize: '10px', // Change this to your desired font size
          },
        },
      },
      yaxis: {
        title: {
        //  text: '$ (thousands)'
        },
        labels: { formatter: (value) => {
            return Fnc.numExceedsBasic(value) + ' USD';
          }, 
        },
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val
          }
        }
      }

    });

    const onPrevious =(i)=>{
      if(i == 'minus' && limit > 5){
        const minus = limit-5
        setlimit(minus)
        setrawFETCH({...rawFETCH, LIMIT: minus, IFZERO:'ALL'})
      } else if(i == 'add'){
        const addus = limit+5
        setlimit(addus)
        setrawFETCH({...rawFETCH, LIMIT: addus, IFZERO:'ALL'})
      }
      setrawREFRESH(Fnc.numRandom())
    }

    useEffect(() => {
      setrawFETCH({
                    ...rawFETCH,
                    ...onFiltered,
                  })
      setrawREFRESH(Fnc.numRandom())

  }, [onFiltered])

  useEffect(() => {
    sendData(chartDATA)
}, [fetchDATA.tally != 0 && fetchDATA.load])

  return (
    <Paper elevation={1} sx={{ padding: 2, display: 'flex', alignItems: 'center',height: '100%', minHeight: '500px' }} {...other}>
      <Box sx={{ flexGrow: 1,height: '100%', }}>
        <Typography variant="h5" gutterBottom>
          {onTitle} 

          <Typography style={{fontSize:'12px', color: 'gray', marginTop:'-2px'}}>
            Top {
            limit == 5 && fetchDATA.tally > 4
            ? 
            limit 
            : 
            limit == 5 && fetchDATA.tally < 5
            ? 
            fetchDATA.tally 
            : 
            limit > 5 && fetchDATA.tally == 0
            ? 
            fetchDATA.tally 
            : limit > 5 && fetchDATA.tally < 5 ? 
            (limit-4)+'-'+(limit-5+fetchDATA.tally)
            : fetchDATA.tally == 0 ? 0 : (limit - 4)+'-'+limit} results
          </Typography>

        </Typography>

        <Box>
            {
              limit > 5 &&
            <IconButton onClick={()=>onPrevious('minus')} style={{marginTop:'-10px'}} size='small' disabled={!fetchDATA.load}>
              <Iconify icon="typcn:arrow-left-thick" color="#EE82EE" />
            </IconButton>
            }

              <IconButton onClick={()=>onPrevious('add')} style={{marginTop:'-10px'}} size='small' disabled={fetchDATA.tally < 5} >
                <Iconify icon="typcn:arrow-right-thick" color={fetchDATA.tally < 5 ? "gray" : "#EE82EE"} />
              </IconButton>
              
        </Box>

            {
              fetchDATA.load ?
              <>
                <Box sx={{ width:"100%",marginBottom:'-10px', minHeight: '300px' }}>
                    <Chart
                      type="bar"
                      series={fillSeries}
                      options={chartOptions}
                      height={'100%'}
                    />
                </Box>

                <Box sx={{ width:"100%", margin:'-10px', height: '130px', }} >
                    <ChartInserts_Hundred
                        onData={chartDATA}
                        barWidth='50'
                        sublabel='USD'
                        onWhat='positive'
                        height={'100%'} />
                </Box>

                <Box sx={{ width:"100%", margin:'-10px', height: '100px', marginTop:'-20px'}}>
                    <ChartInserts_Hundred
                        onData={chartDATA}
                        barWidth='50'
                        sublabel='USD'
                        onWhat='nega'
                        height={'100%'} />
                </Box>
              </>
              :
              <Skeleton width="100%"  sx={{marginTop:'-135px',height:'135%',bgcolor: 'rgba(88,88,88, 0.2)'}}>
                <Typography>.</Typography>
              </Skeleton>
            }

      </Box>
    </Paper>
  );
};
Charts_Clubs.propTypes = {
    chart: PropTypes.object,
    subheader: PropTypes.string,
    sublabel: PropTypes.string,
    barWidth: PropTypes.string,
  };
  
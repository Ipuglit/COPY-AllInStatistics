import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Button, IconButton, LinearProgress  } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';

import Iconify from 'src/components/iconify';

import { RawFetch } from 'src/hooks/raw/';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

export default function Charts_Hundred({ onTitle, sendData, onFiltered, subheader, chart, sublabel, barWidth, ...other }) {

  const [limit, setlimit]                    = useState(5);
  const [rawFETCH, setrawFETCH]              = useState({...Cls.RawDefault, LIMIT: limit});
  const [rawREFRESH, setrawREFRESH]          = useState(1);

    const fetchDATA        = RawFetch(rawFETCH,rawREFRESH,'applicationslist')

    const chartDATA    = (Fnc.isZERO(fetchDATA.data) ? fetchDATA.data  : []).reduce((a, i) => {
                                a.name.push(i.appName.toUpperCase());
  
                                a.countRecords.push(i.countRecords);
                                a.countAccounts.push(i.countAccounts);
                                a.countAccounts_active.push(i.countAccounts_active);
                                a.countUsers.push(i.countUsers);
                                a.countClubs.push(i.countClubs);
                                a.countClubs_active.push(i.countClubs_active);
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
                                  countUsers:          [],
                                  countClubs:          [],
                                  countClubs_active:          [],
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

    const fillSeries = [{

                            data: [2, 17, 35, 0]
                        },
                        {

                            data: [2, 17, 35, 0]
                        }]

    const fillSeries2 = [{

                            data: [44, 55, 41, 37]
                        }]

    const fillCategories = ['Apps', 'Clubs', 'Users', 'Accounts']


    function labelAxis(value) {
      return value + ' USD';
    }

    const chartOptions = useChart({
      colors: ['#9370DB', '#FF00FF'],

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
        categories: fillCategories,
        width: 200
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + "K"
          }
        }
      },
      fill: {
        opacity: 1
      
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
       // offsetX: 40,
        show: false
      }

    });

    const onPrevious =(i)=>{

      if(i == 'minus' && limit > 5){
        const minus = limit-5
        setlimit(minus)
        setrawFETCH({...rawFETCH, LIMIT: minus})
      } else if(i == 'add'){
        const addus = limit+5
        setlimit(addus)
        setrawFETCH({...rawFETCH, LIMIT: addus})
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
    <Paper elevation={1} sx={{ padding: 2, display: 'flex', alignItems: 'center' }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5" gutterBottom>
          {onTitle} 

          <Typography style={{fontSize:'13px', color: 'gray', marginTop:'-2px'}}>
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

          <Box>
            {
              limit > 5 &&
            <IconButton onClick={()=>onPrevious('minus')} style={{marginTop:'-10px'}} size='small' disabled={!fetchDATA.load}>
              <Iconify icon="typcn:arrow-left-thick" color="#EE82EE" />
            </IconButton>
            }
            {
              fetchDATA.tally > 4 &&
              <IconButton onClick={()=>onPrevious('add')} style={{marginTop:'-10px'}} size='small' disabled={!fetchDATA.load}>
                <Iconify icon="typcn:arrow-right-thick" color="#EE82EE" />
              </IconButton>
            }
          </Box>

        </Typography>
        <Box sx={{ width:"100%",marginBottom:'-20px' }}>
        <Chart
          type="bar"
          series={fillSeries}
          categories={fillCategories}
          options={chartOptions}
          height={300}
        />
        {Fnc.JSONS(onFiltered,false)}
        </Box>
      </Box>
    </Paper>
  );
};
Charts_Hundred.propTypes = {
    chart: PropTypes.object,
    subheader: PropTypes.string,
    sublabel: PropTypes.string,
    barWidth: PropTypes.string,
  };
  
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Button, IconButton } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';

import Iconify from 'src/components/iconify';

import { RawFetch } from 'src/hooks/raw/';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

export default function Charts_MiniPie({ onFiltered, subheader, chart, sublabel, barWidth, ...other }) {

    const [rawFETCH, setrawFETCH]              = useState({...Cls.RawDefault, LIMIT: 10});
    const [rawREFRESH, setrawREFRESH]          = useState(1);
    const [limit, setlimit]                    = useState(10);

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

    const seriess =     {
        name: 'Series 1',
        data: [44, 55, 41, 17, 15]
      };

    const options = {
        chart: {
          width: 100,
          type: 'pie'
        },
        labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E']
      };
    const onPrevious =(i)=>{

      if(i == 'minus' && limit > 10){
        const minus = limit-10
        setlimit(minus)
        setrawFETCH({...rawFETCH, LIMIT: minus})
      } else if(i == 'add'){
        const addus = limit+10
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

  return (
    <Paper elevation={1} sx={{ padding: 2, display: 'flex', alignItems: 'center' }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5" gutterBottom style={{marginBottom: '-10px'}}>
          APPLICATIONS <span style={{fontSize:'15px', color: 'gray'}}>(Top {fetchDATA.tally < 10 ? fetchDATA.tally : limit == 10 ? limit : (limit - 9)+'-'+limit} results)</span>
          <Box>
            {
              limit > 10 &&
            <IconButton onClick={()=>onPrevious('minus')} style={{marginTop:'-10px'}} size='small' disabled={!fetchDATA.load}>
              <Iconify icon="typcn:arrow-left-thick" color="#EE82EE" />
            </IconButton>
            }
            {
              fetchDATA.tally > 0 &&
              <IconButton onClick={()=>onPrevious('add')} style={{marginTop:'-10px'}} size='small' disabled={!fetchDATA.load}>
                <Iconify icon="typcn:arrow-right-thick" color="#EE82EE" />
              </IconButton>
            }
          </Box>

        </Typography>
        <Box sx={{ width:"100%" }}>
        <Chart
          dir="ltr"
          type="line"
          series={seriess}
          options={options}
          height={100}
        />
        {Fnc.JSONS(onFiltered,false)}
        </Box>
      </Box>
    </Paper>
  );
};
Charts_MiniPie.propTypes = {
    chart: PropTypes.object,
    subheader: PropTypes.string,
    sublabel: PropTypes.string,
    barWidth: PropTypes.string,
  };
  
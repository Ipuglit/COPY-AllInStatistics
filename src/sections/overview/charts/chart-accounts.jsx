import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Button, IconButton, Skeleton } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';

import Iconify from 'src/components/iconify';

import { RawFetch } from 'src/hooks/raw/';

import ChartInserts_Hundred from './insert-hundred'
import Loading_Skeletons from 'src/items/loaders/loadings'

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

export default function Charts_Accounts({ onTitle, onFiltered, subheader, chart, sublabel, barWidth, ...other }) {

    const [limit, setlimit]                    = useState(5);
    const [limitTil, setlimitTil]              = useState(0);
    const [rawFETCH, setrawFETCH]              = useState({...Cls.RawDefault, LIMIT: limit});
    const [rawREFRESH, setrawREFRESH]          = useState(1);

    const fetchDATA        = RawFetch(rawFETCH,rawREFRESH,'accountslist')


    const chartDATA    = (fetchDATA.data.length > 0 ? fetchDATA.data : []).reduce((a, i) => {
                                a.name.push(i.accountID.toUpperCase());

                                a.count_asPlayer.push(i.count_asPlayer);
                                a.count_asUpline.push(i.count_asUpline);
                                a.count_asAgency.push(i.count_asAgency);
                                a.count_asDownline.push(i.count_asDownline);

                                a.count_clubs.push(i.count_clubs);
                                a.list_clubIDs.push(i.list_clubIDs);
                                a.list_clubNames.push(i.list_clubNames);

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

                                a.points_FLH_loss.push(i.points_FLH_loss);
                                a.points_MTT_loss.push(i.points_MTT_loss);
                                a.points_NLH_loss.push(i.points_NLH_loss);
                                a.points_OFC_loss.push(i.points_OFC_loss);
                                a.points_SIX_loss.push(i.points_SIX_loss);
                                a.points_SNG_loss.push(i.points_SNG_loss);
                                a.points_SPIN_loss.push(i.points_SPIN_loss);
                                a.points_FLOHI_loss.push(i.points_FLOHI_loss);
                                a.points_MIXED_loss.push(i.points_MIXED_loss);
                                a.points_PLOHI_loss.push(i.points_PLOHI_loss);
                                a.points_FLOHILO_loss.push(i.points_FLOHILO_loss);
                                a.points_PLOHILO_loss.push(i.points_PLOHILO_loss);
                                a.points_OTHER_loss.push(i.points_OTHER_loss);

                                a.points_FLH_win.push(i.points_FLH_win);
                                a.points_MTT_win.push(i.points_MTT_win);
                                a.points_NLH_win.push(i.points_NLH_win);
                                a.points_OFC_win.push(i.points_OFC_win);
                                a.points_SIX_win.push(i.points_SIX_win);
                                a.points_SNG_win.push(i.points_SNG_win);
                                a.points_SPIN_win.push(i.points_SPIN_win);
                                a.points_FLOHI_win.push(i.points_FLOHI_win);
                                a.points_MIXED_win.push(i.points_MIXED_win);
                                a.points_PLOHI_win.push(i.points_PLOHI_win);
                                a.points_FLOHILO_win.push(i.points_FLOHILO_win);
                                a.points_PLOHILO_win.push(i.points_PLOHILO_win);
                                a.points_OTHER_win.push(i.points_OTHER_win);

                                a.points_FLH.push(i.points_FLH);
                                a.points_MTT.push(i.points_MTT);
                                a.points_NLH.push(i.points_NLH);
                                a.points_OFC.push(i.points_OFC);
                                a.points_SIX.push(i.points_SIX);
                                a.points_SNG.push(i.points_SNG);
                                a.points_SPIN.push(i.points_SPIN);
                                a.points_FLOHI.push(i.points_FLOHI);
                                a.points_MIXED.push(i.points_MIXED);
                                a.points_PLOHI.push(i.points_PLOHI);
                                a.points_FLOHILO.push(i.points_FLOHILO);
                                a.points_PLOHILO.push(i.points_PLOHILO);
                                a.points_OTHER.push(i.points_OTHER);


                                a.bonus_FLH.push(i.bonus_FLH);
                                a.bonus_MTT.push(i.bonus_MTT);
                                a.bonus_NLH.push(i.bonus_NLH);
                                a.bonus_OFC.push(i.bonus_OFC);
                                a.bonus_SIX.push(i.bonus_SIX);
                                a.bonus_SNG.push(i.bonus_SNG);
                                a.bonus_SPIN.push(i.bonus_SPIN);
                                a.bonus_FLOHI.push(i.bonus_FLOHI);
                                a.bonus_MIXED.push(i.bonus_MIXED);
                                a.bonus_PLOHI.push(i.bonus_PLOHI);
                                a.bonus_FLOHILO.push(i.bonus_FLOHILO);
                                a.bonus_PLOHILO.push(i.bonus_PLOHILO);
                                a.bonus_OTHER.push(i.bonus_OTHER);
                                return a;
                            }, {  name:               [], 
                                count_asPlayer:         [], 
                                count_asUpline:        [], 
                                count_asAgency: [], 
                                count_asDownline:          [], 

                                count_clubs:         [], 
                                list_clubIDs:        [], 
                                list_clubNames:           [],

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
                                total_bonuspercent:  [],
                                
                                points_FLH_loss:          [], 
                                points_MTT_loss:          [], 
                                points_NLH_loss:          [], 
                                points_OFC_loss:          [], 
                                points_SIX_loss:          [], 
                                points_SNG_loss:          [], 
                                points_SPIN_loss:         [], 
                                points_FLOHI_loss:        [], 
                                points_MIXED_loss:        [], 
                                points_PLOHI_loss:        [], 
                                points_FLOHILO_loss:      [], 
                                points_PLOHILO_loss:      [], 
                                points_OTHER_loss:        [],

                                points_FLH_win:          [], 
                                points_MTT_win:          [], 
                                points_NLH_win:          [], 
                                points_OFC_win:          [], 
                                points_SIX_win:          [], 
                                points_SNG_win:          [], 
                                points_SPIN_win:         [], 
                                points_FLOHI_win:        [], 
                                points_MIXED_win:        [], 
                                points_PLOHI_win:        [], 
                                points_FLOHILO_win:      [], 
                                points_PLOHILO_win:      [], 
                                points_OTHER_win:        [],

                                points_FLH:          [], 
                                points_MTT:          [], 
                                points_NLH:          [], 
                                points_OFC:          [], 
                                points_SIX:          [], 
                                points_SNG:          [], 
                                points_SPIN:         [], 
                                points_FLOHI:        [], 
                                points_MIXED:        [], 
                                points_PLOHI:        [], 
                                points_FLOHILO:      [], 
                                points_PLOHILO:      [], 
                                points_OTHER:        [],

                                bonus_FLH:          [], 
                                bonus_MTT:          [], 
                                bonus_NLH:          [], 
                                bonus_OFC:          [], 
                                bonus_SIX:          [], 
                                bonus_SNG:          [], 
                                bonus_SPIN:         [], 
                                bonus_FLOHI:        [], 
                                bonus_MIXED:        [], 
                                bonus_PLOHI:        [], 
                                bonus_FLOHILO:      [], 
                                bonus_PLOHILO:      [], 
                                bonus_OTHER:        [],
                            });


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

    function labelYAxis(value) {
      return value + ' USD';
    }

    function labelXAxis(value) {
      return 'ID:'+value;
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


  return (
    <Paper elevation={1} sx={{ padding: 2, display: 'flex', alignItems: 'center',height: '100%', minHeight: '500px' }} {...other}>
      <Box sx={{ flexGrow: 1,height: '100%', }}>
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

                <Box sx={{ width:"100%", margin:'-10px', height: '130px', }}>
                    <ChartInserts_Hundred
                        onData={chartDATA}
                        barWidth='50'
                        sublabel='USD'
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
Charts_Accounts.propTypes = {
    chart: PropTypes.object,
    subheader: PropTypes.string,
    sublabel: PropTypes.string,
    barWidth: PropTypes.string,
  };
  
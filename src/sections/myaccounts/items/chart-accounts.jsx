import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Button, IconButton, Skeleton } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';

import Iconify from 'src/components/iconify';

import { RawFetch } from 'src/hooks/raw/';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

export default function Charts_Accounts({ onData, onTitle, onFiltered, subheader, chart, sublabel, barWidth, ...other }) {

    const iDatas = onData.data
    const iGames = onData.games

    const onMobile = Fnc.OnMobile()

    const [getWhat, setgetWhat]           = useState('points');

    const chartDATA    = (iDatas.length > 0 ? iDatas : []).reduce((a, i) => {
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


      const filteredGames = iGames.filter(i => i.gameAcro != 'OTHER');

      const fillOthers    = (get)=>{
        const totalVal = get == 'points' || get == 'bonus' ? chartDATA[get+'_OTHER'] : chartDATA['points_OTHER_'+get];
        return totalVal.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      }

      const fillSeries = (get) => {
          return filteredGames.map((i,index) => {
              const gameName = i.gameAcro; // Get the acronym name
              const dataa = get == 'points' || get == 'bonus' ? chartDATA[get+'_'+gameName] : chartDATA['points_'+gameName+'_'+get]; 
              
              return {
                  name: gameName == 'SIX' ? '6+' : gameName,
                  data: dataa,
              };
            
          });
      };


    function labelAxis(value) {
      return value + ' USD';
    }

    const chartOptions = useChart({
        colors:['#1984c5', '#22a7f0', '#63bff0', '#a7d5ed', '#e2e2e2', '#e1a692', '#de6e56', '#e14b31', '#c23728']

          ,
        series: fillSeries(getWhat),
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            stackType: '100%'
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          stroke: {
            width: 1,
            colors: ['#fff']
          },
          xaxis: {
            categories: chartDATA.name,
            labels: {
                style: {
                  fontSize: '10px'
                },
              },
          },
          yaxis: {

            labels: { formatter: (value) => {
                return 'ID: '+value;
              }, 
            },
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val + " USD"
              },
            },
          },
          fill: {
            opacity: 1
          },
          legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40,
            fontSize: onMobile ? '8.5px' : '11px',
          }

    });

  return (
    <Paper elevation={1} sx={{ padding: 2, display: 'flex', alignItems: 'center'}} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5" gutterBottom>
           {getWhat.toUpperCase()} RATIO
        </Typography>
        {fillOthers(getWhat)}
        {Fnc.JSONS(chartDATA,false)}
        <Button size='small' sx={{fontSize:'11px', borderRadius:0, color: getWhat =='win' ? 'violet' : 'gray'}} onClick={()=>setgetWhat('win')}>
            Winnings {getWhat}
        </Button> 
        &nbsp;
        <Button size='small' sx={{fontSize:'11px', borderRadius:0, color: getWhat =='loss' ? 'violet' : 'gray'}} onClick={()=>setgetWhat('loss')}>
            Loses
        </Button> 
        &nbsp;
        <Button size='small' sx={{fontSize:'11px', borderRadius:0, color: getWhat =='points' ? 'violet' : 'gray'}} onClick={()=>setgetWhat('points')}>
            Points
        </Button> 
        &nbsp;
        <Button size='small' sx={{fontSize:'11px', borderRadius:0, color: getWhat =='bonus' ? 'violet' : 'gray'}} onClick={()=>setgetWhat('bonus')}>
            Bonus
        </Button> 

        <Box>
          {
            onData.load ?
          <Chart
            type="bar"
            series={fillSeries(getWhat)}
            options={chartOptions}
            height={350}
          />
          :
          <Skeleton width="100%"  sx={{marginTop:'-78px', marginBottom:'-65px',height:'393px',bgcolor: 'rgba(88,88,88, 0.2)'}}>
          <Typography>.</Typography>
          </Skeleton>
          }


        </Box>
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
  
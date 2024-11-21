import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Container,
  LinearProgress,
  Box ,
  Paper,
  Tooltip,
  IconButton,
  Skeleton,
  AvatarGroup,
  Avatar,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

import { RawFetch } from 'src/hooks/raw/';

import * as Vv from '../view/values'

import Iconify from 'src/components/iconify';

import ChartInserts_Hundred from './insert-hundred'
import Loading_Skeletons from 'src/items/loaders/loadings'

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'
import chart from 'src/components/chart';

export default function ChartsList_Accounts({onData, sendData, onFiltered,onTitle,onWhat,onItems}) {

    const [onView, setonView]                  = useState('agencybonus');
    const [rawFETCH, setrawFETCH]              = useState({...Cls.RawDefault, LIMIT: 'ALL'});
    const [rawREFRESH, setrawREFRESH]          = useState(1);


    const fetchDATA    = RawFetch(rawFETCH,rawREFRESH,'accountslist')

    const chartDATA    = Vv.chartsACCOUNTS(Fnc.isZERO(fetchDATA.data) ? fetchDATA.data  : [])

    const sumPercentages=(i,e)=>{

        const PN = chartDATA[e].reduce((A, value) => {
              if (value > 0) {
                A.positive += value;
              } else {
                A.negative += value; 
              }
              return A;
        }, { positive: 0, negative: 0 });

        if ( Fnc.isNull(i[e],0) ){
          return 0
        } else if ( i[e] > 0 ) {
          return ((i[e] / PN.positive) * 100).toFixed(2);
        } else {
          return (((i[e] / PN.negative) * 100)*-1).toFixed(2);
        }

    }

    const transData = fetchDATA.data.map((i, index) => ({
                                                                    'title':                    'ID: '+i.accountID,
                                                                    'points':                   i.total_points_usd,
                                                                    'bonus':                    i.total_bonus_usd,
                                                                    'total_win_usd':            i.total_win_usd,
                                                                    'total_loss_usd':           i.total_loss_usd*-1,
                                                                    'agencyaction':             i.total_agencyaction,
                                                                    'agencybonus':              i.total_agencybonus,
                                                                    'playerresult':             i.total_playerresult,
                                                                    'percent_total_win_usd':    sumPercentages(i,'total_win_usd'),
                                                                    'percent_total_loss_usd':   sumPercentages(i,'total_loss_usd'),
                                                                    'percent_points':           sumPercentages(i,'total_points_usd'),
                                                                    'percent_bonus':            sumPercentages(i,'total_bonus_usd'),
                                                                    'percent_agencyaction':     sumPercentages(i,'total_agencyaction'),
                                                                    'percent_agencybonus':      sumPercentages(i,'total_agencybonus'),
                                                                    'percent_playerresult':     sumPercentages(i,'total_playerresult'),
                                                          }));






      const items = transData.sort((a, b) => {
        const percentA = parseFloat(a[onView]);
        const percentB = parseFloat(b[onView]);
        return percentB - percentA;
      });
      
      const itemsPerPage = 10;
      const [currentPage, setCurrentPage] = useState(0);
      
      const totalPages = Math.ceil(items.length / itemsPerPage);
    
      const handleNext = () => {
        if (currentPage < totalPages - 1) {
          setCurrentPage(currentPage + 1);
        }
      };
    
      const handlePrevious = () => {
        if (currentPage > 0) {
          setCurrentPage(currentPage - 1);
        }
      };
    
      const startIndex = currentPage * itemsPerPage;
      const selectedItems = items.slice(startIndex, startIndex + itemsPerPage);
    
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

    const arrButtons =  [
                          { value: 'bonus', title: 'Bonus'  },
                          { value: 'points', title: 'Points'  },
                          { value: 'total_win_usd', title: 'Winnings'  },
                          { value: 'total_loss_usd', title: 'Losses'  },
                          { value: 'playerresult', title: 'Player Results'  },
                          { value: 'agencyaction', title: 'Agency Actions'  },
                          { value: 'agencybonus', title: 'Agency Bonuses'  },
                        ]

      return (
        <Paper elevation={1} sx={{ padding: 2, height:520 }}>
          <Typography variant="h5" gutterBottom>

            {
              onView =='bonus' ? 'Collated Player Bonuses' 
              : 
              onView =='points' ? 'Collated Player Points' 
              : 
              onView =='total_win_usd' ? 'Collated Player Winnings'
              : 
              onView =='total_loss_usd' ? 'Collated Player Losses'
              : 
              onView =='playerresult' ? 'Collated Player Results'
              : 
              onView =='agencyaction' ? 'Collated Agency Actions'
              :
              'Collated Agency Bonuses'
            }

            <Typography style={{fontSize:'12px', color: 'gray', marginTop:'0px'}}>
                Top {currentPage == 0 ? 10 : (currentPage * 10) +'-'+ ((currentPage * 10 + 10) < items.length ? (currentPage * 10 + 10) : items.length)} results
            </Typography>

          </Typography>
            <div style={{display: 'flex',justifyContent: 'flex-end', marginTop: '-28px'}}>
            <Select value={onView}
                    onChange={(e)=>setonView(e.target.value)}
                    size='small'
                    sx={{ '& .MuiOutlinedInput-notchedOutline': {  border: 'none',marginTop:'-8px',  },
                          '& .MuiSelect-select': { border: 'none',  fontSize: '11px', height: '15px', marginTop:'-8px', minWidth:'80px', textAlign: 'right'  }, 
                          '& .MuiInputLabel-root': { fontSize: '11px',   }, textAlign: 'right' }} >
                {
                  arrButtons.map((e,index)=>{
                    return <MenuItem key={index} sx={{fontSize:'11px', height: '22px'}} value={e.value}>{e.title}</MenuItem>
                  })
                }
            </Select>
            </div>



          {
            onData.load 
            ?
          <List>
            {selectedItems.map((i, index) => {
              return <ListItem key={index} sx={{height:'35px'}}>
                
                          <ListItemText >

                              <Typography style={{marginBottom:'-11px'}}>
                                  <span style={{fontSize: '12.5px',color:'lightgray'}}>{i.title}</span>
                              </Typography>

                              <Box position="relative" display="inline-flex" width="100%" sx={{marginTop:'-10px'}}>

                                  <Tooltip title={onView == 'total_loss_usd' ? (i[onView] == 0 ? '0 USD' : '-'+i[onView]+' USD') : i[onView]+' USD'}>
                                      <LinearProgress variant="determinate" 
                                                      value={i['percent_'+onView] ? Math.abs(i['percent_'+onView]) : 0} 
                                                      sx={{width:'85%', height:'9px', '& .MuiLinearProgress-bar': {  backgroundColor: i[onView] < 0 || onView == 'total_loss_usd' ? '#ed3330' : '#8A2BE2', },}}/>
                                  </Tooltip>

                                  <Box  top={-6}
                                        left="100%"
                                        position="absolute"
                                        display="flex"
                                        justifyContent="flex-end"
                                        alignItems="center"
                                        sx={{ transform: 'translateX(-50%)' }} >

                                      <Typography variant="body2" color="textSecondary">{i['percent_'+onView]}%</Typography>

                                  </Box>
                              </Box>

                          </ListItemText>

                    </ListItem>
            })}
          </List>
          :
          <Skeleton width="100%" sx={{marginTop:'-138px', marginBottom:'-75px',height:'620px',bgcolor: 'rgba(88,88,88, 0.2)'}}>
             <Typography>.</Typography>
          </Skeleton>
          }
          <div>

            <Button onClick={handlePrevious}  disabled={currentPage === 0} sx={{display: currentPage === 0 ? 'none' : ''}}>
                <Iconify icon="typcn:arrow-left-thick" color="#EE82EE" />
            </Button>

            <Button  onClick={handleNext}  disabled={currentPage === totalPages - 1} sx={{display: currentPage === totalPages - 1 ? 'none' : ''}}>
                <Iconify icon="typcn:arrow-right-thick" color="#EE82EE" />
            </Button>

          </div>
          {Fnc.JSONS(chartDATA,false)}
        </Paper>
      );
    };
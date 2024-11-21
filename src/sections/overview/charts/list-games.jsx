import React, { useState } from 'react';
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
  Skeleton
} from '@mui/material';

import Iconify from 'src/components/iconify';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

export default function ChartsList_Games({onData,onTitle,onWhat,onItems}) {

  const chartDATA         = onData.data

    const totalValue =(i,e)=>{
        const arr = i.reduce((acc, curr) => Fnc.NumForce(acc) + Fnc.NumForce(curr), 0);
        return {title: e, value: arr}
    }

    const indexNamesData = Object.keys(chartDATA);

    const reFill = indexNamesData.map((name, index) => {
        return totalValue(chartDATA[name],name)
    })

    const sumTitles = (i)=> { return [i+"_FLH", i+"_MTT", i+"_NLH", i+"_OFC", i+"_SIX", i+"_SNG", i+"_SPIN", i+"_FLOHI", i+"_MIXED", i+"_PLOHI", i+"_FLOHILO", i+"_PLOHILO"] } 

    const showTitles = (i) =>{
        const iName = String(i).replace(/^(points_|bonus_)/, '')
        const getName = onItems.map((e)=>   iName == e.gameAcro ? e.gameName : ''  )
        return getName
    }

    const getPointsOthers   = reFill.find(i => i.title == 'points_OTHER').value
    const getBonusOthers    = reFill.find(i => i.title == 'bonus_OTHER').value

    const getPoints         = reFill.filter(i => sumTitles('points').includes(i.title))
    const getBonus          = reFill.filter(i => sumTitles('bonus').includes(i.title))

    const sumNPoints      = getPoints.reduce((acc, i) => {return i.value < 0 ? acc + i.value : acc}, 0);
    const sumPPoints      = getPoints.reduce((acc, i) => {return i.value > 0 ? acc + i.value : acc}, 0);
    const sumBonus        = getBonus.reduce((acc, i) => acc + i.value, 0);
    const sumPoints       = eval((getPointsOthers+sumNPoints+sumPPoints))

    const sumOther_Points =   getPointsOthers < 0 
                              ? 
                              '-' + eval(( getPointsOthers / (sumNPoints+getPointsOthers) ) * 100).toFixed(2)
                              :
                              '+' + eval(( getPointsOthers / (sumPPoints+getPointsOthers) ) * 100).toFixed(2)
    
    const sumOther_Bonus =   getBonusOthers < 0 
                              ? 
                              '-' + eval(( getBonusOthers / (sumBonus+getBonusOthers) ) * 100).toFixed(2)
                              :
                              '+' + eval(( getBonusOthers / (sumBonus+getBonusOthers) ) * 100).toFixed(2)

    const showValues =(i)=>{

        const arr       = i == 'points' ? getPoints : getBonus

        return arr.map(x => {
            if(x.title.includes(i+'_') && !x.title.includes('usd') ){

                const answer = i == 'points' && !Fnc.isNull(x.value,0) && x.value < 0 
                                ? 
                                eval((x.value / sumNPoints) * 100).toFixed(2)
                                :
                                i == 'points' && !Fnc.isNull(x.value,0) && x.value > 0 
                                ?
                                eval((x.value / sumPPoints) * 100).toFixed(2)
                                :
                                i == 'bonus' && !Fnc.isNull(x.value,0)
                                ?
                                eval((x.value / sumBonus) * 100).toFixed(2)
                                :
                                0
                
                return {
                    title: showTitles(x.title),
                    value: !Fnc.isNull(x.value,0) ? x.value : 0,
                    percent: answer,
                    negative: x.value < 0 ? true : false,
                    }
            }
        })
    }
      const sortThis = showValues(onWhat);

      const items = sortThis.sort((a, b) => {
        const percentA = parseFloat(a.value);
        const percentB = parseFloat(b.value);
        return percentB - percentA;
      });
      
      const itemsPerPage = 5;
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
    
      return (
        <Paper elevation={1} sx={{ padding: 2, height:320 }}>
          <Typography variant="h5" gutterBottom>
            {onTitle}

            <Typography style={{fontSize:'13px', color: 'gray', marginTop:'0px'}}>
                Top {currentPage == 0 ? 5 : (currentPage * 5) +'-'+ ((currentPage * 5 + 5) < items.length ? (currentPage * 5 + 5) : items.length)}
                {
                  onWhat =='points' 
                  ? 
                  <i style={{fontSize:'11px'}}> 
                    &nbsp;
                    ({sumOther_Points < 0 ? '-'+ eval(100+sumOther_Points).toFixed(2) : '+'+ eval(100-sumOther_Points).toFixed(2)}% plus {sumOther_Points}% others)
                  </i>
                  :
                  <i style={{fontSize:'11px'}}> 
                    &nbsp;
                    ({sumOther_Bonus < 0 ? '-'+ eval(100+sumOther_Bonus).toFixed(2) : '+'+ eval(100-sumOther_Bonus).toFixed(2)}% plus {sumOther_Bonus}% others)
                  </i>
                }
            </Typography>


          </Typography>

          {
            onData.load 
            ?
          <List>
            {selectedItems.map((i, index) => (
              <ListItem key={index} sx={{height:'35px'}}>
                
                    <ListItemText >

                        <Typography style={{marginBottom:'-11px'}}>
                            <span style={{fontSize: '12.5px',color:'lightgray'}}>{i.title}</span>
                        </Typography>


                        <Box position="relative" display="inline-flex" width="100%" sx={{marginTop:'-10px'}}>

                            <Tooltip title={i.value.toFixed(2)+' USD'}>
                                <LinearProgress variant="determinate" 
                                                value={i.percent ? Math.abs(i.percent) : 0} 
                                                sx={{width:'84%', height:'9px', '& .MuiLinearProgress-bar': {  backgroundColor: i.negative ? '#ed3330' : '#8A2BE2', },}}/>
                            </Tooltip>
                            
                            <Box top={-6}
                                 left="100%"
                                 position="absolute"
                                 display="flex"
                                 justifyContent="flex-end"
                                 alignItems="center"
                                 sx={{ transform: 'translateX(-50%)' }} >

                                <Typography variant="body2" color="textSecondary">{i.percent}%</Typography>

                            </Box>
                        </Box>

                    </ListItemText>

              </ListItem>
            ))}
          </List>
          :
          <Skeleton width="100%" sx={{marginTop:'-58px', marginBottom:'-65px',height:'315px',bgcolor: 'rgba(88,88,88, 0.2)'}}>
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
          {Fnc.JSONS(sortThis,false)}
        </Paper>
      );
    };
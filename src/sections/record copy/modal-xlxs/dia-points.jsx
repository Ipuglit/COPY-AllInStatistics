import { useEffect, useState } from 'react';
import {Chip,TextField,Grid,DialogContent,DialogContentText,DialogActions,Button,Box,Table,TableHead,TableRow,TableCell,TableBody,Stack} from '@mui/material';

import { Icon } from '@iconify/react';
import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

export default function Points({ onClose, onData, onItems, onReturn }) {
    
    const onMobile    = Fnc.OnMobile()

    const itemx = onData.data
    const today = new Date();

    const [data, setData]               = useState([]);
    const [onSwitch, setonSwitch]       = useState('WINLOSS');

    const handleChange =(i,e)=>{

            const u = {...data, [e]:i ? i : 0}

            const reFill =(i)=>{
                return [ u[i+'_SIX'],u[i+'_FLH'],u[i+'_FLOHI'],u[i+'_FLOHILO'],u[i+'_MIXED'],u[i+'_MTT'],u[i+'_NLH'],u[i+'_OFC'],u[i+'_PLOHI'],u[i+'_PLOHILO'],u[i+'_SNG'],u[i+'_SPIN'],u[i+'_OTHERS'] ]
            }

            const sumBonus      = Fnc.sumNumbers(reFill('BONUS'))
            const sumWinLoss    = Fnc.sumNumbers(reFill('WINLOSS'))
            const sumWin        = Fnc.sumPosi(reFill('WINLOSS'))
            const sumLoss       = Fnc.sumNega(reFill('WINLOSS'))

            setData({...u, BONUS_TOTAL: sumBonus, WINLOSS_TOTAL: sumWinLoss,WINLOSS_WIN: sumWin,WINLOSS_LOSS: sumLoss,})

    }

    const onSubmit =(i)=>{
        onReturn({
                    row:            itemx.ROW, 
                    what:           onData.name,
                    sub:            itemx?.PLAYERID,
                    ...data
                })
      }

    const checkSubmit =()=>{
        if( data?.BONUS_TOTAL           == itemx?.BONUS_TOTAL 
            && data?.BONUS_SIX          == itemx?.BONUS_SIX
            && data?.BONUS_FLH          == itemx?.BONUS_FLH
            && data?.BONUS_FLOHI        == itemx?.BONUS_FLOHI
            && data?.BONUS_FLOHILO      == itemx?.BONUS_FLOHILO
            && data?.BONUS_MIXED        == itemx?.BONUS_MIXED
            && data?.BONUS_MTT          == itemx?.BONUS_MTT
            && data?.BONUS_NLH          == itemx?.BONUS_NLH
            && data?.BONUS_OFC          == itemx?.BONUS_OFC
            && data?.BONUS_PLOHI        == itemx?.BONUS_PLOHI
            && data?.BONUS_PLOHILO      == itemx?.BONUS_PLOHILO
            && data?.BONUS_SNG          == itemx?.BONUS_SNG
            && data?.BONUS_SPIN         == itemx?.BONUS_SPIN
            && data?.BONUS_OTHERS       == itemx?.BONUS_OTHERS
            && data?.WINLOSS_TOTAL      == itemx?.WINLOSS_TOTAL 
            && data?.WINLOSS_SIX        == itemx?.WINLOSS_SIX
            && data?.WINLOSS_FLH        == itemx?.WINLOSS_FLH
            && data?.WINLOSS_FLOHI      == itemx?.WINLOSS_FLOHI
            && data?.WINLOSS_FLOHILO    == itemx?.WINLOSS_FLOHILO
            && data?.WINLOSS_MIXED      == itemx?.WINLOSS_MIXED
            && data?.WINLOSS_MTT        == itemx?.WINLOSS_MTT
            && data?.WINLOSS_NLH        == itemx?.WINLOSS_NLH
            && data?.WINLOSS_OFC        == itemx?.WINLOSS_OFC
            && data?.WINLOSS_PLOHI      == itemx?.WINLOSS_PLOHI
            && data?.WINLOSS_PLOHILO    == itemx?.WINLOSS_PLOHILO
            && data?.WINLOSS_SNG        == itemx?.WINLOSS_SNG
            && data?.WINLOSS_SPIN       == itemx?.WINLOSS_SPIN
            && data?.WINLOSS_OTHERS     == itemx?.WINLOSS_OTHERS
        ){
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        setData({
                    BONUS_TOTAL:              itemx?.BONUS_TOTAL,
                    BONUS_SIX:                itemx?.BONUS_SIX,
                    BONUS_FLH:                itemx?.BONUS_FLH,
                    BONUS_FLOHI:              itemx?.BONUS_FLOHI,
                    BONUS_FLOHILO:            itemx?.BONUS_FLOHILO,
                    BONUS_MIXED:              itemx?.BONUS_MIXED,
                    BONUS_MTT:                itemx?.BONUS_MTT,
                    BONUS_NLH:                itemx?.BONUS_NLH,
                    BONUS_OFC:                itemx?.BONUS_OFC,
                    BONUS_PLOHI:              itemx?.BONUS_PLOHI,
                    BONUS_PLOHILO:            itemx?.BONUS_PLOHILO,
                    BONUS_SNG:                itemx?.BONUS_SNG,
                    BONUS_SPIN:               itemx?.BONUS_SPIN,
                    BONUS_OTHERS:             itemx?.BONUS_OTHERS,

                    WINLOSS_TOTAL:            itemx?.WINLOSS_TOTAL,
                    WINLOSS_WIN:              itemx?.WINLOSS_WIN,
                    WINLOSS_LOSS:             itemx?.WINLOSS_LOSS,
                    WINLOSS_SIX:              itemx?.WINLOSS_SIX,
                    WINLOSS_FLH:              itemx?.WINLOSS_FLH,
                    WINLOSS_FLOHI:            itemx?.WINLOSS_FLOHI,
                    WINLOSS_FLOHILO:          itemx?.WINLOSS_FLOHILO,
                    WINLOSS_MIXED:            itemx?.WINLOSS_MIXED,
                    WINLOSS_MTT:              itemx?.WINLOSS_MTT,
                    WINLOSS_NLH:              itemx?.WINLOSS_NLH,
                    WINLOSS_OFC:              itemx?.WINLOSS_OFC,
                    WINLOSS_PLOHI:            itemx?.WINLOSS_PLOHI,
                    WINLOSS_PLOHILO:          itemx?.WINLOSS_PLOHILO,
                    WINLOSS_SNG:              itemx?.WINLOSS_SNG,
                    WINLOSS_SPIN:             itemx?.WINLOSS_SPIN,
                    WINLOSS_OTHERS:           itemx?.WINLOSS_OTHERS,
                })
                setonSwitch(onData.name == 'POINTS' ? 'WINLOSS' : 'BONUS')

      }, [onData]);

    const arrayGames = [
                        { title: "Other Poker Games", value: data[onSwitch+'_OTHERS'] ? data[onSwitch+'_OTHERS'] : 0, edit: onSwitch+'_OTHERS' },
                        { title: "No Limit Texas Hold'em (NLH)", value: data[onSwitch+'_NLH'] ? data[onSwitch+'_NLH'] : 0, edit: onSwitch+'_NLH' },
                        { title: "Fixed Limit Texas Hold'em (FLH)", value: data[onSwitch+'_FLH'] ? data[onSwitch+'_FLH'] : 0, edit: onSwitch+'_FLH' },
                        { title: "Sit and Go tournaments (SNG)", value: data[onSwitch+'_SNG'] ? data[onSwitch+'_SNG'] : 0, edit: onSwitch+'_SNG' },
                        { title: "Fixed Limit Omaha Hi (FLOHi)", value: data[onSwitch+'_FLOHI'] ? data[onSwitch+'_FLOHI'] : 0, edit: onSwitch+'_FLOHI' },
                        { title: "Fixed Limit Omaha Hi-Lo (FLOHiLo)", value: data[onSwitch+'_FLOHILO'] ? data[onSwitch+'_FLOHILO'] : 0, edit: onSwitch+'_FLOHILO' },
                        { title: "Pot Limit Omaha Hi (PLOHi)", value: data[onSwitch+'_PLOHI'] ? data[onSwitch+'_PLOHI'] : 0, edit: onSwitch+'_PLOHI' },
                        { title: "Pot Limit Omaha Hi-Lo (PLOHiLo)", value: data[onSwitch+'_PLOHILO'] ? data[onSwitch+'_PLOHILO'] : 0, edit: onSwitch+'_PLOHILO' },
                        { title: "Open-face Chinese (OFC)", value: data[onSwitch+'_OFC'] ? data[onSwitch+'_OFC'] : 0, edit: onSwitch+'_OFC' },
                        { title: "6+ Hold'em (6+)", value: data[onSwitch+'_SIX'] ? data[onSwitch+'_SIX'] : 0, edit: onSwitch+'_SIX' },
                        { title: "Multi-Table Tournament (MTT)", value: data[onSwitch+'_MTT'] ? data[onSwitch+'_MTT'] : 0, edit: onSwitch+'_MTT' },
                        { title: "Mixed Games", value: data[onSwitch+'_MIXED'] ? data[onSwitch+'_MIXED'] : 0, edit: onSwitch+'_MIXED' },
                        { title: "Spin-and-Go", value: data[onSwitch+'_SPIN'] ? data[onSwitch+'_SPIN'] : 0, edit: onSwitch+'_SPIN' },
                       ]


  return (
    <>

    <DialogContent>
        <DialogContentText component="section">

        <Stack component="section" sx={{ p: 1, border: '1px dashed grey', fontSize:onMobile ? '11px' : '12px' }}>
            {
            !Fnc.isNull(itemx.APPID,0)
            ?
            <>
            <p style={{marginTop:'-2px',color:'gray'}} >{itemx.APPNAME}</p>
            <p style={{marginTop:'-15px', marginBottom:'-2px'}}>{itemx.CLUBNAME}</p>
            </>
            :
            <p style={{marginTop:'-2px',color:'orange', marginBottom:'-2px'}} >Please select a club!</p>
            }
            {
              //  JSON.stringify(data,null,2)
            }
        </Stack>


        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }} style={{marginTop:'15px'}}>

            <Grid item xs={12} sm={12} md={12} style={{marginTop:'-10px'}}>

                <Button variant={onSwitch == 'WINLOSS' ? "contained" : "outlined"} 
                          sx={{...Cs.buttonClass(onSwitch == 'WINLOSS' ? 'contained' : 'outlined','violet'), fontSize:onMobile ? '10px' : '13px',borderRadius:'0',width:'49%'}}
                          onClick={()=>setonSwitch('WINLOSS')}
                          size='' >
                    Points
                </Button>
                &nbsp;
                <Button variant={onSwitch == 'BONUS' ? "contained" : "outlined"} 
                          sx={{...Cs.buttonClass(onSwitch == 'BONUS' ? 'contained' : 'outlined','violet'), fontSize:onMobile ? '10px' : '13px',borderRadius:'0',width:'49%'}}
                          onClick={()=>setonSwitch('BONUS')}
                          size='' >
                    Bonus
                </Button>

            </Grid>

            <Grid item xs={12} sm={12} md={12} sx={{marginTop:'-12px'}}>
                <Chip label={"Bonus: "+data?.BONUS_TOTAL} color="primary" variant="outlined" sx={Cs.BoxChippy('outlinedgray',onMobile ? '10' : '12')}/> &nbsp;
                <Chip label={"Points: "+data?.WINLOSS_TOTAL} color="primary" variant="outlined" sx={Cs.BoxChippy('outlinedgray',onMobile ? '10' : '12')}/> &nbsp;
                <Chip label={"Win: "+data?.WINLOSS_WIN} color="default" variant="outlined" size='small' sx={Cs.BoxChippy('outlinedgray',onMobile ? '9' : '11')}/> &nbsp;
                <Chip label={"Loss: "+data?.WINLOSS_LOSS} color="default" variant="outlined" size='small' sx={Cs.BoxChippy('outlinedgray',onMobile ? '9' : '11')}/> &nbsp;
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
                <Table sx={{ marginTop:'-20px' }} size='small'>
                    <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontSize: onMobile ? '12px' : ''}}>GAMES</TableCell>
                        <TableCell align="right" sx={{ fontSize: onMobile ? '12px' : ''}}>VALUES</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {arrayGames.map((i) => (
                        <TableRow key={i.title}>
                            <TableCell component="th" scope="row" sx={{ fontSize: onMobile ? '11px' : ''}}>
                                {i.title}
                            </TableCell>

                            <TableCell align="right">
                            <TextField  required
                                            size='small'
                                            fullWidth
                                            value={i.value}
                                            variant="outlined"
                                            onChange={(e)=>handleChange(Fnc.numberDecNegatives(e.currentTarget.value),i.edit)}
                                            sx={{ width:'130px', border: '', 
                                                '& .MuiInputBase-input': { fontSize: onMobile ? '11px' : '', textAlign: 'center', }, 
                                                '& .MuiInputLabel-root': { fontSize: onMobile ? '12px' : '', textAlign: 'center',  }, 
                                            }}
                                            />
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </Grid>


        </Grid>

        </DialogContentText>
    </DialogContent>
    
    <DialogActions style={{paddingBottom:'30px',padding:'30px',display: 'flex', justifyContent: 'center', marginTop:'-30px'}}>

            {
              checkSubmit()
              ?
              null
              :
              <Button sx={{...Cs.buttonClass('contained','violet'), width:'50%',borderRadius:'0',fontSize:onMobile ? '11px' : ''}} variant='contained' onClick={()=>onSubmit()}>SUBMIT</Button>
            }

            <Button variant='outlined' onClick={onClose} sx={{borderRadius:'0',width:'50%',fontSize:onMobile ? '11px' : ''}}>CANCEL</Button>

    </DialogActions>
    </>
  );
}
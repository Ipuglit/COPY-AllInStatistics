import { useEffect, useState } from 'react';
import {Chip,TextField,Grid,DialogContent,DialogContentText,DialogActions,Button,Box,Table,TableHead,TableRow,TableCell,TableBody,Stack} from '@mui/material';

import { Icon } from '@iconify/react';
import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

export default function Points({ onClose, onData, onItems, onReturn }) {
    
    const onMobile    = Fnc.OnMobile()

    const itemx = onData?.data
    const games = onItems?.GAMES
    const today = new Date();

    const [data, setData]               = useState([]);
    const [onSwitch, setonSwitch]       = useState('POINTS');

    const getGames =(val)=>{
        return games?.map((i) => { return val+i?.gameAcro } );
    }

    const handleChange =(i,e)=>{

            const u = {...data, [e]:i ? i : ''}

            const reFill =(i)=>{
                return [ u[i+'_SIX'],u[i+'_FLH'],u[i+'_FLOHI'],u[i+'_FLOHILO'],u[i+'_MIXED'],u[i+'_MTT'],u[i+'_NLH'],u[i+'_OFC'],u[i+'_PLOHI'],u[i+'_PLOHILO'],u[i+'_SNG'],u[i+'_SPIN'],u[i+'_OTHERS'] ]
            }

            const sumBonus      = Fnc.arrayAdding(reFill('BONUS')).toFixed(2)
            const sumPOINTS     = Fnc.arrayAdding(reFill('POINTS')).toFixed(2)
            const sumWin        = Fnc.arrayAddingPositives(reFill('POINTS')).toFixed(2)
            const sumLoss       = Fnc.arrayAddingNegatives(reFill('POINTS')).toFixed(2)

            setData({...u, BONUS_TOTAL: sumBonus, POINTS_TOTAL: sumPOINTS,POINTS_WIN: sumWin,POINTS_LOSS: sumLoss,})

    }

    const handleBlur =(i,e)=>{
        const val           = ['','-','.'].includes(i) ? 0 : i
        setData({...data, [e]: val})
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
            && data?.POINTS_TOTAL      == itemx?.POINTS_TOTAL 
            && data?.POINTS_SIX        == itemx?.POINTS_SIX
            && data?.POINTS_FLH        == itemx?.POINTS_FLH
            && data?.POINTS_FLOHI      == itemx?.POINTS_FLOHI
            && data?.POINTS_FLOHILO    == itemx?.POINTS_FLOHILO
            && data?.POINTS_MIXED      == itemx?.POINTS_MIXED
            && data?.POINTS_MTT        == itemx?.POINTS_MTT
            && data?.POINTS_NLH        == itemx?.POINTS_NLH
            && data?.POINTS_OFC        == itemx?.POINTS_OFC
            && data?.POINTS_PLOHI      == itemx?.POINTS_PLOHI
            && data?.POINTS_PLOHILO    == itemx?.POINTS_PLOHILO
            && data?.POINTS_SNG        == itemx?.POINTS_SNG
            && data?.POINTS_SPIN       == itemx?.POINTS_SPIN
            && data?.POINTS_OTHERS     == itemx?.POINTS_OTHERS
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

                    POINTS_TOTAL:            itemx?.POINTS_TOTAL,
                    POINTS_WIN:              itemx?.POINTS_WIN,
                    POINTS_LOSS:             itemx?.POINTS_LOSS,
                    POINTS_SIX:              itemx?.POINTS_SIX,
                    POINTS_FLH:              itemx?.POINTS_FLH,
                    POINTS_FLOHI:            itemx?.POINTS_FLOHI,
                    POINTS_FLOHILO:          itemx?.POINTS_FLOHILO,
                    POINTS_MIXED:            itemx?.POINTS_MIXED,
                    POINTS_MTT:              itemx?.POINTS_MTT,
                    POINTS_NLH:              itemx?.POINTS_NLH,
                    POINTS_OFC:              itemx?.POINTS_OFC,
                    POINTS_PLOHI:            itemx?.POINTS_PLOHI,
                    POINTS_PLOHILO:          itemx?.POINTS_PLOHILO,
                    POINTS_SNG:              itemx?.POINTS_SNG,
                    POINTS_SPIN:             itemx?.POINTS_SPIN,
                    POINTS_OTHERS:           itemx?.POINTS_OTHERS,
                })
                setonSwitch(onData.name == 'POINTS' ? 'POINTS' : 'BONUS')

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

        </Stack>


        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }} style={{marginTop:'15px'}}>

            <Grid item xs={12} sm={12} md={12} style={{marginTop:'-10px'}}>

                <Button variant={onSwitch == 'POINTS' ? "contained" : "outlined"} 
                          sx={{...Cs.buttonClass(onSwitch == 'POINTS' ? 'contained' : 'outlined','violet'), fontSize:onMobile ? '10px' : '13px',borderRadius:'0',width:'49%'}}
                          onClick={()=>setonSwitch('POINTS')}
                          size='small' >
                    Points
                </Button>
                &nbsp;
                <Button variant={onSwitch == 'BONUS' ? "contained" : "outlined"} 
                          sx={{...Cs.buttonClass(onSwitch == 'BONUS' ? 'contained' : 'outlined','violet'), fontSize:onMobile ? '10px' : '13px',borderRadius:'0',width:'49%'}}
                          onClick={()=>setonSwitch('BONUS')}
                          size='small' >
                    Bonus
                </Button>

            </Grid>

            <Grid item xs={12} sm={12} md={12} sx={{marginTop:'-12px'}}>
                {
                    onSwitch == 'POINTS'
                    ?
                    <>
                    <Chip label={"Total: "+data?.POINTS_TOTAL+' '+itemx?.FXCURRENCY} color="primary" variant="outlined" sx={Cs.BoxChippy('outlinedgray',onMobile ? '10' : '12')}/> &nbsp;
                    <Chip label={"Win: "+data?.POINTS_WIN} color="default" variant="outlined" size='small' sx={Cs.BoxChippy('outlinedgray',onMobile ? '9' : '11')}/> &nbsp;
                    <Chip label={"Loss: "+data?.POINTS_LOSS} color="default" variant="outlined" size='small' sx={Cs.BoxChippy('outlinedgray',onMobile ? '9' : '11')}/>
                    </>
                    :
                    <Chip label={"Total: "+data?.BONUS_TOTAL+' '+itemx?.FXCURRENCY} color="primary" variant="outlined" sx={Cs.BoxChippy('outlinedgray',onMobile ? '10' : '12')}/>
                }
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
                <Table sx={{ marginTop:'-20px' }} size='small'>
                    <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontSize: onMobile ? '11px' : '12px'}}>GAMES</TableCell>
                        <TableCell align="right" sx={{ fontSize: onMobile ? '11px' : '12px', textAlign:'center'}}>VALUES</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {arrayGames.map((i) => (
                        <TableRow key={i.title}>
                            <TableCell component="th" scope="row" sx={{ fontSize: onMobile ? '11px' : '12px'}}>
                                {i.title}
                            </TableCell>

                            <TableCell align="right">
                            <TextField  required
                                            size='small'
                                            fullWidth
                                            value={i?.value ? i?.value : ''}
                                            variant="outlined"
                                            autoComplete='off'
                                            onChange={(e)=>handleChange(Fnc.numberDecNegatives(e.currentTarget.value),i.edit)}
                                            onBlur={(e)=>handleBlur(Fnc.NumForce(e.currentTarget.value),i.edit)}
                                            sx={{ width:'130px', border: '', 
                                                '& .MuiInputBase-input': { fontSize: onMobile ? '11px' : '12px', textAlign: 'center', }, 
                                            }}
                                            />
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </Grid>

                    {Fnc.JSONS(data,false)}
        </Grid>

        </DialogContentText>
    </DialogContent>
    
    <DialogActions style={{paddingBottom:'30px',padding:'30px',display: 'flex', justifyContent: 'center', marginTop:'-20px'}}>

            {
              checkSubmit()
              ?
              null
              :
              <Button sx={{...Cs.buttonClass('contained','violet'), width:'50%',borderRadius:'0',fontSize:onMobile ? '11px' : ''}} variant='contained' onClick={()=>onSubmit()}>SUBMIT</Button>
            }

            <Button variant='standard' onClick={onClose} sx={{borderRadius:'0',width:'50%',fontSize:onMobile ? '11px' : ''}}>CANCEL</Button>

    </DialogActions>
    </>
  );
}
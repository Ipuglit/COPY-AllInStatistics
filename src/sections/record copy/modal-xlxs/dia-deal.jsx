import { useEffect, useState } from 'react';
import {FormControlLabel,Checkbox,Autocomplete,TextField,Grid,DialogContent,DialogContentText,DialogActions,Button,Box} from '@mui/material';

import { Icon } from '@iconify/react';
import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

export default function Deal({ onClose, onData, onItems, onReturn }) {
    
    const onMobile    = Fnc.OnMobile()

    const itemx = onData.data
    const today = new Date();

    const [data, setData]               = useState({
                                                        rakeback:       itemx?.RAKEBACK, 
                                                        rebate:         itemx?.REBATE, 
                                                        chiprate:       itemx?.CHIPRATE,
                                                        playerrake:     itemx?.PLAYERRAKE,
                                                        uplinerake:     itemx?.UPLINERAKE,
                                                        agencyrake:     itemx?.AGENCYRAKE,
                                                        downlinerake:   itemx?.DOWNLINERAKE,
                                                        playerchip:     itemx?.PLAYERCHIP,
                                                        uplinechip:     itemx?.UPLINECHIP,
                                                        agencychip:     itemx?.AGENCYCHIP,
                                                        downlinechip:   itemx?.DOWNLINECHIP,
                                                    });

    const [onSwitch, setonSwitch]           = useState('rake');
    const [checkClub, setcheckClub]          = useState(false);
    const [checkPlayer, setcheckPlayer]     = useState(false);

    const handleChange =(i,e)=>{

        if(e == 'rakeback'){
            setData({...data, rakeback:i, uplinerake: eval(100 - i), playerrake:0})
        } else if(e == 'playerrake'){
            
            const val = i > Fnc.numNum(data.rakeback) ? 0 : i
            const rkAgency = eval( 100 - ( Fnc.numNum(data.uplinerake) + Fnc.numNum(val) ) )
            setData({...data, playerrake:val, agencyrake: rkAgency})
            
        } else if(e == 'agencyrake'){

            const rkAgency = eval( 100 - ( Fnc.numNum(data.uplinerake) + Fnc.numNum(data.playerrake) ) )
            const sums  = eval( Fnc.numNum(data.playerrake) + Fnc.numNum(data.uplinerake) )

            const val   = i > rkAgency ? 0 : i
            

            setData({...data, agencyrake: val})

        } else {
            setData({...data, [e]:i})
        }

    }

    const onSubmit =(i)=>{
        onReturn({
                    row:            itemx.ROW, 
                    what:           onData.name,
                    applyClub:      checkClub,
                    applyPlayer:    checkPlayer,
                    subClub:        itemx.CLUBID,
                    subPlayer:      itemx.PLAYERID,
                    rakeback:       Fnc.isNum(data?.rakeback,0),  
                    rebate:         Fnc.isNum(data?.rebate,0), 
                    chiprate:       Fnc.isNum(data?.chiprate,0), 
                    playerrake:     Fnc.isNum(data?.playerrake,0), 
                    uplinerake:     Fnc.isNum(data?.uplinerake,0), 
                    agencyrake:     Fnc.isNum(data?.agencyrake,0), 
                    downlinerake:   Fnc.isNum(data?.downlinerake,0), 
                    playerchip:     Fnc.isNum(data?.playerchip,0), 
                    uplinechip:     Fnc.isNum(data?.uplinechip,0), 
                    agencychip:     Fnc.isNum(data?.agencychip,0), 
                    downlinechip:   Fnc.isNum(data?.downlinechip,0), 
                })
      }

    const checkSubmit =()=>{
        if( data?.rakeback          == itemx?.RAKEBACK 
            && data?.rebate         == itemx?.REBATE
            && data?.chiprate       == itemx?.CHIPRATE
            && data?.playerrake     == itemx?.PLAYERRAKE
            && data?.uplinerake     == itemx?.UPLINERAKE
            && data?.agencyrake     == itemx?.AGENCYRAKE
            && data?.downlinerake   == itemx?.DOWNLINERAKE
            && data?.playerchip     == itemx?.PLAYERCHIP
            && data?.uplinechip     == itemx?.UPLINECHIP
            && data?.agencychip     == itemx?.AGENCYCHIP
            && data?.downlinechip   == itemx?.DOWNLINECHIP
        ){
            return true
        } else if(data?.playerrake == 0 || data?.rakeback == 0){
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        setData({
                    rakeback:       Fnc.isNum(itemx?.RAKEBACK), 
                    rebate:         Fnc.isNum(itemx?.REBATE),
                    chiprate:       Fnc.isNum(itemx?.CHIPRATE),
                    playerrake:     Fnc.isNum(itemx?.PLAYERRAKE),
                    uplinerake:     Fnc.isNum(itemx?.UPLINERAKE),
                    agencyrake:     Fnc.isNum(itemx?.AGENCYRAKE),
                    downlinerake:   Fnc.isNum(itemx?.DOWNLINERAKE),
                    playerchip:     Fnc.isNum(itemx?.PLAYERCHIP),
                    uplinechip:     Fnc.isNum(itemx?.UPLINECHIP),
                    agencychip:     Fnc.isNum(itemx?.AGENCYCHIP),
                    downlinechip:   Fnc.isNum(itemx?.DOWNLINECHIP),
                })
      }, [onData]);

      
  return (
    <>

    <DialogContent>
        <DialogContentText component="section">

        <Box component="section" sx={{ p: 1, border: '1px dashed grey', fontSize: onMobile ? '11px' : '12px' }}>
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
                //JSON.stringify(data,null,2)
            }
        </Box>

        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }} style={{marginTop:'15px'}}>

            <Grid item xs={6} sm={4} md={4}>
            <TextField  required
                        label={"Rakeback"} size='small'
                        fullWidth
                        variant="outlined"
                        error={data?.rakeback ? false : true}
                        value={data?.rakeback ? data?.rakeback : 0}
                        onChange={(e)=>handleChange(Fnc.numHundred(e.currentTarget.value),'rakeback')}
                        InputProps={Cs.IconPercent}
                        sx={{...Cs.TextCenter,
                            '& .MuiInputBase-input': { fontSize: onMobile ? '12px' : '' }, 
                            '& .MuiInputLabel-root': { fontSize: onMobile ? '13px' : ''   }, 
                        }}
                        />
            </Grid>

            <Grid item xs={6} sm={4} md={4}>
            <TextField  required
                        label={"Rebate"} size='small'
                        value={data?.rebate ? data?.rebate : 0}
                        fullWidth variant="outlined"
                        onChange={(e)=>handleChange(e.currentTarget.value,'rebate')}
                        onBlur={(e)=>Fnc}
                        InputProps={Cs.IconPercent}
                        sx={{...Cs.TextCenter,
                            '& .MuiInputBase-input': { fontSize: onMobile ? '12px' : '' }, 
                            '& .MuiInputLabel-root': { fontSize: onMobile ? '13px' : ''   }, 
                        }}
                        />
            </Grid>

            <Grid item xs={6} sm={4} md={4}>
            <TextField  required
                        label={"Chiprate"} size='small'
                        value={data?.chiprate ? data?.chiprate : 0}
                        fullWidth variant="outlined"
                        onChange={(e)=>handleChange(Fnc.numDecimal(e.currentTarget.value),'chiprate')}
                        InputProps={Cs.IconChip}
                        sx={{...Cs.TextCenter,
                            '& .MuiInputBase-input': { fontSize: onMobile ? '12px' : '' }, 
                            '& .MuiInputLabel-root': { fontSize: onMobile ? '13px' : ''   }, 
                        }}
                        />
            </Grid>

            <Grid item xs={12} sm={12} md={12} style={{marginTop:'-10px'}}>

                <Button variant={onSwitch == 'rake' ? "contained" : "outlined"} 
                          sx={{...Cs.buttonClass(onSwitch == 'rake' ? 'contained' : 'outlined','violet'), fontSize: onMobile ? '11px' : '',borderRadius:'0',width:'49%'}}
                          onClick={()=>setonSwitch('rake')}
                          size='' >
                    Rakes
                </Button>
                &nbsp;
                <Button variant={onSwitch == 'chip' ? "contained" : "outlined"} 
                          sx={{...Cs.buttonClass(onSwitch == 'chip' ? 'contained' : 'outlined','violet'), fontSize: onMobile ? '11px' : '',borderRadius:'0',width:'49%'}}
                          onClick={()=>setonSwitch('chip')}
                          size='' >
                    Chips
                </Button>

            </Grid>

            <Grid item xs={6} sm={6} md={6}>
                <TextField  required
                            size='small' 
                            fullWidth variant="outlined"
                            error={onSwitch == 'rake' && data?.playerrake == 0 ? true : false}
                            label={onSwitch == 'rake' ? 'Player Rakeback' : 'Player Chiprate'} 
                            value={data && onSwitch == 'rake' ? data?.playerrake : data && onSwitch == 'chip' ? data?.playerchip : 0}
                            onChange={(e)=>handleChange( onSwitch == 'rake' ? Fnc.numHundred(e.currentTarget.value) : Fnc.numDecimal(e.currentTarget.value),onSwitch == 'rake' ? 'playerrake' : 'playerchip')}
                            InputProps={onSwitch == 'rake' ? Cs.IconPercent : Cs.IconChip}
                            sx={{...Cs.TextCenter,
                                '& .MuiInputBase-input': { fontSize: onMobile ? '12px' : '' }, 
                                '& .MuiInputLabel-root': { fontSize: onMobile ? '13px' : ''   }, 
                            }}
                            />
            </Grid>

            <Grid item xs={6} sm={6} md={6}>
                <TextField  required
                            size='small'
                            fullWidth  variant="outlined"
                            disabled={onSwitch == 'rake' ? true : false} 
                            label={onSwitch == 'rake' ? 'Upline Rakeback' : 'Upline Chipcut'} 
                            value={data && onSwitch == 'rake' ? data?.uplinerake : data && onSwitch == 'chip' ? data?.uplinechip : 0}
                            onChange={(e)=>handleChange(onSwitch == 'rake' ? Fnc.numHundred(e.currentTarget.value) : Fnc.numDecimal(e.currentTarget.value),onSwitch == 'rake' ? 'uplinerake' : 'uplinechip')}
                            InputProps={onSwitch == 'rake' ? Cs.IconPercent : Cs.IconChip}
                            sx={{...Cs.TextCenter,
                                '& .MuiInputBase-input': { fontSize: onMobile ? '12px' : '' }, 
                                '& .MuiInputLabel-root': { fontSize: onMobile ? '13px' : ''   }, 
                            }}
                            />
            </Grid>

            <Grid item xs={6} sm={6} md={6}>
                <TextField  required
                            size='small' 
                            fullWidth variant="outlined"
                            disabled={onSwitch == 'rake' ? true : false} 
                            label={onSwitch == 'rake' ? 'Agency Rakeback' : 'Agency Chipcut'} 
                            value={data && onSwitch == 'rake' ? data?.agencyrake : data && onSwitch == 'chip' ? data?.agencychip : 0}
                            onChange={(e)=>handleChange(onSwitch == 'rake' ? Fnc.numHundred(e.currentTarget.value) : Fnc.numDecimal(e.currentTarget.value),onSwitch == 'rake' ? 'agencyrake' : 'agencychip')}
                            InputProps={onSwitch == 'rake' ? Cs.IconPercent : Cs.IconChip}
                            sx={{...Cs.TextCenter,
                                '& .MuiInputBase-input': { fontSize: onMobile ? '12px' : '' }, 
                                '& .MuiInputLabel-root': { fontSize: onMobile ? '13px' : ''   }, 
                            }}
                            />
            </Grid>

            <Grid item xs={6} sm={6} md={6}>
                <TextField  required
                            size='small'
                            fullWidth variant="outlined"
                            label={onSwitch == 'rake' ? 'Downline Rakeback' : 'Downline Chipcut'} 
                            value={data && onSwitch == 'rake' ? data?.downlinerake : data && onSwitch == 'chip' ? data?.downlinechip : 0}
                            onChange={(e)=>handleChange(onSwitch == 'rake' ? Fnc.numHundred(e.currentTarget.value) : Fnc.numDecimal(e.currentTarget.value),onSwitch == 'rake' ? 'downlinerake' : 'downlinechip')}
                            InputProps={onSwitch == 'rake' ? Cs.IconPercent : Cs.IconChip}
                            sx={{...Cs.TextCenter,
                                '& .MuiInputBase-input': { fontSize: onMobile ? '12px' : '' }, 
                                '& .MuiInputLabel-root': { fontSize: onMobile ? '13px' : ''   }, 
                                display:'none'
                            }}
                            />
            </Grid>

        </Grid>


        {
            !Fnc.isNull(itemx?.PLAYERID,0) && onData?.name != 'PLAYER' &&
            <>
            <br/>
            <FormControlLabel
            sx={{marginTop:'-10px'}}
              control={
                <Checkbox
                  size='small'
                  checked={checkPlayer}
                  onChange={(e)=>setcheckPlayer(e.target.checked)}
                  name="acceptTerms"
                  sx={{ '&.Mui-checked': { color: checkPlayer ? 'violet' : '' } }}
                />
              }
              label={<span style={{fontSize: onMobile ? '10px' : '12px', color:checkPlayer ? 'violet' : ''}}>Apply to all player ID: '{itemx?.PLAYERID}'</span>}
            />
            </>

          }
          {
            !Fnc.isNull(itemx?.CLUBID,0) &&
            <>
          <br/>
          <FormControlLabel
          sx={{marginTop:'-10px'}}
            control={
              <Checkbox
                size='small'
                checked={checkClub}
                onChange={(e)=>setcheckClub(e.target.checked)}
                name="acceptTerms"
                sx={{ '&.Mui-checked': { color: checkClub ? 'violet' : '' } }}
              />
            }
            label={<span style={{fontSize: onMobile ? '10px' : '12px', color:checkClub ? 'violet' : ''}}>Apply to all club '{itemx?.CLUBNAME}'</span>}
          />
            </>
          }

        </DialogContentText>
    </DialogContent>
    
    <DialogActions style={{paddingBottom:'30px',padding:'30px',display: 'flex', justifyContent: 'center', marginTop:'-30px'}}>

            {
              checkSubmit() && !checkClub && !checkPlayer
              ?
              null
              :
              <Button sx={{...Cs.buttonClass('contained','violet'), width:'50%',borderRadius:'0',fontSize: onMobile ? '11px' : ''}} variant='contained' onClick={()=>onSubmit()}>SUBMIT</Button>
            }

            <Button variant='outlined' onClick={onClose} sx={{borderRadius:'0',width:'50%',fontSize: onMobile ? '11px' : ''}}>CANCEL</Button>

    </DialogActions>
    </>
  );
}
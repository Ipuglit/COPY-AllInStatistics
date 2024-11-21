import { useEffect, useState } from 'react';
import {FormControlLabel,Checkbox,Autocomplete,TextField,Grid,DialogContent,DialogContentText,DialogActions,Button,Box} from '@mui/material';

import { Icon } from '@iconify/react';
import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'

export default function Deal({ onClose, onData, onItems, onReturn }) {
    
    const onMobile    = Fnc.OnMobile()

    const itemx = onData?.data
    const today = new Date();

    const [data, setData]               = useState({
                                                        rakeback:       itemx?.RAKEBACK, 
                                                        rebate:         itemx?.REBATE, 
                                                        chiprate:       itemx?.CHIPRATE,
                                                        playerRake:     itemx?.PLAYERRAKE,
                                                        uplineRake:     itemx?.UPLINERAKE,
                                                        agencyRake:     itemx?.AGENCYRAKE,
                                                        downlineRake:   itemx?.DOWNLINERAKE,
                                                        playerChip:     itemx?.PLAYERCHIP,
                                                        uplineChip:     itemx?.UPLINECHIP,
                                                        agencyChip:     itemx?.AGENCYCHIP,
                                                        downlineChip:   itemx?.DOWNLINECHIP,
                                                    });

    const [onSwitch, setonSwitch]           = useState('rake');
    const [checkClub, setcheckClub]          = useState(false);
    const [checkPlayer, setcheckPlayer]     = useState(false);

    const handleChange =(i,e)=>{

        if(e == 'rakeback'){
            setData({...data, rakeback:i, uplineRake: eval(100 - i), playerRake:0})
        } else if(e == 'playerRake'){
            
            const val = i > Fnc.numNum(data.rakeback) ? 0 : i
            const rkAgency = eval( 100 - ( Fnc.numNum(data.uplineRake) + Fnc.numNum(val) ) )
            setData({...data, playerRake:val, agencyRake: rkAgency})
            
        } else if(e == 'agencyRake'){

            const rkAgency = eval( 100 - ( Fnc.numNum(data.uplineRake) + Fnc.numNum(data.playerRake) ) )
            const sums  = eval( Fnc.numNum(data.playerRake) + Fnc.numNum(data.uplineRake) )

            const val   = i > rkAgency ? 0 : i
            

            setData({...data, agencyRake: val})

        } else {
            setData({...data, [e]:i})
        }

    }

    const handleBlur =(i,e)=>{

        const val           = ['','-','.'].includes(i) ? 0 : i
        const chiprate      = ['','-','.'].includes(i) ? 1 : i
        setData({...data, [e]: e == 'chiprate' ? chiprate : val})

    }

    const onSubmit =(i)=>{
        onReturn({
                    ...data,

                    row:            itemx.ROW, 
                    what:           onData.name,

                    applyClub:      checkClub,
                    applyPlayer:    checkPlayer,
                    subClub:        itemx.CLUBID,
                    subPlayer:      itemx.PLAYERID,

                })
      }

    const checkSubmit =()=>{
        if( data?.rakeback          == itemx?.RAKEBACK 
            && data?.rebate         == itemx?.REBATE
            && data?.chiprate       == itemx?.CHIPRATE
            && data?.playerRake     == itemx?.PLAYERRAKE
            && data?.uplineRake     == itemx?.UPLINERAKE
            && data?.agencyRake     == itemx?.AGENCYRAKE
            && data?.downlineRake   == itemx?.DOWNLINERAKE
            && data?.playerChip     == itemx?.PLAYERCHIP
            && data?.uplineChip     == itemx?.UPLINECHIP
            && data?.agencyChip     == itemx?.AGENCYCHIP
            && data?.downlineChip   == itemx?.DOWNLINECHIP
        ){
            return true
        } else if(data?.playerRake == 0 || data?.rakeback == 0){
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        setData({

                    bonus:                      itemx?.BONUS_TOTAL,
                    points:                     itemx?.POINTS_TOTAL,
                    pointsWin:                  itemx?.POINTS_WIN,
                    pointsLoss:                 itemx?.POINTS_LOSS,    

                    rakeback:                   Fnc.isNum(itemx?.RAKEBACK), 
                    rebate:                     Fnc.isNum(itemx?.REBATE),
                    chiprate:                   Fnc.isNum(itemx?.CHIPRATE),

                    fxCurrency:                 /^[A-Za-z]+$/.test(itemx?.FXCURRENCY) ? itemx?.FXCURRENCY : 'USD',
                    fxUSD:                      Fnc.numCheck(itemx?.FXCURRENCY == 'USD' ? 1 : (itemx?.FXUSD > 0 ? itemx?.FXUSD : 1)),

                    playerRake:                 Fnc.isNum(itemx?.PLAYERRAKE),
                    uplineRake:                 Fnc.isNum(itemx?.UPLINERAKE),
                    agencyRake:                 Fnc.isNum(itemx?.AGENCYRAKE),
                    downlineRake:               Fnc.isNum(itemx?.DOWNLINERAKE),

                    playerRebate:               Fnc.isNum(itemx?.PLAYERREBATE),
                    uplineRebate:               Fnc.isNum(itemx?.UPLINEREBATE),
                    agencyRebate:               Fnc.isNum(itemx?.AGENCYREBATE),
                    downlineRebate:             Fnc.isNum(itemx?.DOWNLINEREBATE),

                    playerChip:                 Fnc.isNum(itemx?.PLAYERCHIP),
                    uplineChip:                 Fnc.isNum(itemx?.UPLINECHIP),
                    agencyChip:                 Fnc.isNum(itemx?.AGENCYCHIP),
                    downlineChip:               Fnc.isNum(itemx?.DOWNLINECHIP),

                    formula_agencyaction:       itemx?.FORMULA_AGENCYACTION,
                    formula_agencybonus:        itemx?.FORMULA_AGENCYBONUS, 
                    formula_playerresult:       itemx?.FORMULA_PLAYERRESULT,
                    formula_result:            itemx?.FORMULA_BONUSPERCENT,
                    formula_bonuspercent:       itemx?.FORMULA_RESULT,

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
                        value={data?.rakeback ? data?.rakeback : ''}
                        onChange={(e)=>handleChange(Fnc.numHundred(e.currentTarget.value),'rakeback')}
                        onBlur={(e)=>handleBlur(e.currentTarget.value,'rakeback')}
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
                        value={data?.rebate ? data?.rebate : ''}
                        fullWidth variant="outlined"
                        onChange={(e)=>handleChange(e.currentTarget.value,'rebate')}
                        onBlur={(e)=>handleBlur(e.currentTarget.value,'rebate')}
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
                        value={data?.chiprate ? data?.chiprate : ''}
                        fullWidth variant="outlined"
                        onChange={(e)=>handleChange(Fnc.numDecimal(e.currentTarget.value),'chiprate')}
                        onBlur={(e)=>handleBlur(e.currentTarget.value,'chiprate')}
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
                            error={onSwitch == 'rake' && data?.playerRake == 0 ? true : false}
                            label={onSwitch == 'rake' ? 'Player Rakeback' : 'Player Chiprate'} 
                            value={data && onSwitch == 'rake' ? data?.playerRake : data && onSwitch == 'chip' ? data?.playerChip : ''}
                            onChange={(e)=>handleChange( onSwitch == 'rake' ? Fnc.numHundred(e.currentTarget.value) : Fnc.numDecimal(e.currentTarget.value),onSwitch == 'rake' ? 'playerRake' : 'playerChip')}
                            onBlur={(e)=>handleBlur( onSwitch == 'rake' ? Fnc.numHundred(e.currentTarget.value) : Fnc.numDecimal(e.currentTarget.value),onSwitch == 'rake' ? 'playerRake' : 'playerChip')}
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
                            value={data && onSwitch == 'rake' ? data?.uplineRake : data && onSwitch == 'chip' ? data?.uplineChip : ''}
                            onChange={(e)=>handleChange(onSwitch == 'rake' ? Fnc.numHundred(e.currentTarget.value) : Fnc.numDecimal(e.currentTarget.value),onSwitch == 'rake' ? 'uplineRake' : 'uplineChip')}
                            onBlur={(e)=>handleBlur(onSwitch == 'rake' ? Fnc.numHundred(e.currentTarget.value) : Fnc.numDecimal(e.currentTarget.value),onSwitch == 'rake' ? 'uplineRake' : 'uplineChip')}
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
                            value={data && onSwitch == 'rake' ? data?.agencyRake : data && onSwitch == 'chip' ? data?.agencyChip : ''}
                            onChange={(e)=>handleChange(onSwitch == 'rake' ? Fnc.numHundred(e.currentTarget.value) : Fnc.numDecimal(e.currentTarget.value),onSwitch == 'rake' ? 'agencyRake' : 'agencyChip')}
                            onBlur={(e)=>handleBlur(onSwitch == 'rake' ? Fnc.numHundred(e.currentTarget.value) : Fnc.numDecimal(e.currentTarget.value),onSwitch == 'rake' ? 'agencyRake' : 'agencyChip')}
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
                            value={data && onSwitch == 'rake' ? data?.downlineRake : data && onSwitch == 'chip' ? data?.downlineChip : ''}
                            onChange={(e)=>handleChange(onSwitch == 'rake' ? Fnc.numHundred(e.currentTarget.value) : Fnc.numDecimal(e.currentTarget.value),onSwitch == 'rake' ? 'downlineRake' : 'downlineChip')}
                            onBlur={(e)=>handleBlur(onSwitch == 'rake' ? Fnc.numHundred(e.currentTarget.value) : Fnc.numDecimal(e.currentTarget.value),onSwitch == 'rake' ? 'downlineRake' : 'downlineChip')}
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
        {Fnc.JSONS(itemx,false)}
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

            <Button variant='standard' onClick={onClose} sx={{borderRadius:'0',width:'50%',fontSize: onMobile ? '11px' : ''}}>CANCEL</Button>

    </DialogActions>
    </>
  );
}
import { useEffect, useState } from 'react';
import {FormControlLabel,Checkbox,Autocomplete,TextField,DialogContent,DialogContentText,DialogActions,Button,Box} from '@mui/material';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'


export default function DateRange({ onClose, onData, onItems, onReturn }) {
    
    const onMobile    = Fnc.OnMobile()

    const itemx = onData.data
    const today = new Date();

    const [openned, setOpenned]     = useState(null);
    const [closed, setClosed]       = useState(null);
    const [checkDate, setcheckDate]     = useState(false);
    const [checkClub, setcheckClub]          = useState(false);
    const [checkPlayer, setcheckPlayer]     = useState(false);
    const onSubmit =(i)=>{
        onReturn({
                dateopenned:    Fnc.dateDash(openned), 
                dateclosed:     Fnc.dateDash(closed), 
                row:            itemx.ROW, 
                what:           onData.name, 
                subDate:        itemx.DATEOPENNED, 
                subClub:        itemx.CLUBID, 
                subPlayer:      itemx.PLAYERID, 
                applyDate:      checkDate,
                applyClub:      checkClub,
                applyPlayer:    checkPlayer,
              })
      }

    const handleCheck = (event) => {
      setChecked(event.target.checked);
    };

    useEffect(() => {
        setOpenned(dayjs(itemx.DATEOPENNED))
        setClosed(dayjs(itemx.DATECLOSED))
      }, [onData]);

  return (
    <>

    <DialogContent>

    <DialogContentText component="section">

      <Box component="section" sx={{ p: 1, border: '1px dashed grey', fontSize: onMobile ? '11px' : '12px',marginBottom:'35px' }}>
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

      </Box>


    <LocalizationProvider dateAdapter={AdapterDayjs} >
      <DemoContainer components={['DatePicker']}>
        <DatePicker label="Date openned"
                    value={openned}
                    size="small"
                    maxDate={closed ? dayjs(closed) : dayjs(today)}
                    onChange={(newValue) => setOpenned(newValue)}
                    slotProps={{ 
                      field: { clearable: true, onClear: () => setOpenned(null) },
                      actionBar: { actions: ['today','clear','cancel'] },
                      textField: {    autoComplete:'off',
                                      sx:{ 
                                          '& .MuiInputBase-input': { fontSize: onMobile ? '12px' : '' }, 
                                          '& .MuiInputLabel-root': { fontSize: onMobile ? '13px' : ''   }, 
                                      },
                                  },
                  }}
                    />

        <DatePicker label="Date closed"
                    value={closed}
                    size="small"
                    maxDate={dayjs(today)}
                    minDate={dayjs(openned)}
                    onChange={(newValue) => setClosed(newValue)}
                    slotProps={{ 
                      field: { clearable: true, onClear: () => setClosed(null) },
                      actionBar: { actions: ['today','clear','cancel'] },
                      textField: {    autoComplete:'off',
                                      sx:{ 
                                        '& .MuiInputBase-input': { fontSize: onMobile ? '12px' : '' }, 
                                        '& .MuiInputLabel-root': { fontSize: onMobile ? '13px' : ''   }, 
                                      },
                                  },
                  }}
                    />
      </DemoContainer>
    </LocalizationProvider>

          <FormControlLabel
            control={
              <Checkbox
                size='small'
                checked={checkDate}
                onChange={(e)=>setcheckDate(e.target.checked)}
                name="acceptTerms"
                sx={{ '&.Mui-checked': { color: checkDate ? 'violet' : '' } }}
              />
            }
            label={<span style={{fontSize: onMobile ? '10px' : '12px', color:checkDate ? 'violet' : ''}}>Apply to all same date openned</span>}
          />


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
              Fnc.dateDash(itemx?.DATEOPENNED) == Fnc.dateDash(openned) && Fnc.dateDash(itemx?.DATECLOSED) == Fnc.dateDash(closed) || ( openned?.isAfter(closed) ) || ( openned?.isAfter(today) ) || ( closed?.isAfter(today) )
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
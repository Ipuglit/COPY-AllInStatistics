import { useEffect, useState } from 'react';
import {FormControlLabel,Checkbox,Autocomplete,TextField,DialogContent,DialogContentText,DialogActions,Button,Box} from '@mui/material';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import * as Fnc from 'src/hooks/functions'
import * as Cs from 'src/hooks/classes'
import { Height } from '@mui/icons-material';


export default function DDownDate({ onLabel, onValue, onReturn, onWhat}) {
    
    const onMobile    = Fnc.OnMobile()
    const today     = new Date();

    const [value, setValue]       = useState(null);
    const [opens, setOpens]       = useState(false);

    const onChange = (i) => {
        setValue(i);
    };

    useEffect(() => {
        onReturn(value ? dayjs(value) : null)
    }, [value]);

  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']} sx={{ overflow: 'hidden',}}>

        <DatePicker label={onLabel ? onLabel : 'Date'}
                    value={value}
                    open={opens}
                    onClose={() => setOpens(false)}
                    maxDate={
                            onWhat == 'open' && !Fnc.isNull(onValue?.closed) 
                            ? 
                            dayjs(onValue?.closed)
                            : 
                            dayjs(today) 
                            }
                    minDate={
                            onWhat == 'close' && !Fnc.isNull(onValue?.open) 
                            ? 
                            dayjs(onValue?.open) 
                            :
                            null}
                    slotProps={{ 
                        field: { clearable: true, onClear: () => setValue(null) },
                        actionBar: { actions: ['today','clear','cancel'] },
                        textField: {    size: 'small', 
                                        onClick: () => setOpens(true),
                                        autoComplete:'off',
                                        readOnly:true,
                                        sx:{ 
                                            '& .MuiInputBase-input': { fontSize: onMobile ? '11px' : '' }, 
                                            '& .MuiInputLabel-root': { fontSize: onMobile ? '12px' : '', marginTop:onMobile ? '2px' : ''   }, 
                                        },
                                    },
                    }}
                    onChange={(newValue) => onChange(newValue)}  />

      </DemoContainer>
    </LocalizationProvider>
    </>
  );
}
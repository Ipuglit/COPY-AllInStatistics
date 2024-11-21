import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

import { LocalizationProvider, DatePicker, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function UpdateDate({onDateChange, onOpening}) {

  const [selectedDate, setSelectedDate] = useState(onOpening);

  const handleDateChange = (newValue) => {
    const formattedDate = dayjs(newValue).format('YYYY/DD/MM');
    setSelectedDate(formattedDate)
    //console.log(formattedDate)
  };

  return (

    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileDatePicker

        label="Select Date"
        value={dayjs(selectedDate)}
        onChange={handleDateChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>

  );
}

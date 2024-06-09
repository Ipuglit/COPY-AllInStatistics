import PropTypes from 'prop-types';
import { useState } from 'react';
import {MenuItem, TextField} from '@mui/material/';


// ----------------------------------------------------------------------

PostSort.propTypes = {
  options: PropTypes.array,
};

export default function PostSort({options, selected}) {

  const [value, setValue] = useState('');
  
  const onSort = (event) => {
    setValue(event.target.value);
    selected(event.target.value);
  };

  return (
    <TextField select size="small" value={value ? value : "ALL"} onChange={onSort}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
    </TextField>
  );
}

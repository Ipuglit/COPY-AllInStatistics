import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

PostSearch.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default function PostSearch({ posts }) {
  return (
    <TextField
      placeholder="Search post..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify
              icon="eva:search-fill"
              sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }}
            />
          </InputAdornment>
        ),
      }}
    />
  );
}

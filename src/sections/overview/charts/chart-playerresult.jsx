import PropTypes from 'prop-types';
import { useState } from 'react';
import {Box,Card,CardHeader,Paper,Typography,Button,Menu,MenuItem, Stack} from '@mui/material/';

import Chart, { useChart } from 'src/components/chart';

import { RawFetch } from 'src/hooks/raw/';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

export default function Charts_RecordsPlayerResult({ onTitle, dataReceived, filter, bydate, what, subheader, chart, ...other }) {

  const [anchorEl, setAnchorEl]       = useState(null);
  const [anchorDate, setanchorDate]   = useState('weeks');

  const handleDATEORDER = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCLOSE = (i) => {
    setAnchorEl(null);
  };
  
  const changeDATEORDER = (i) => {
    setanchorDate(i)
    bydate(i)
    setAnchorEl(null);
  };

  function formatLabelDate(value) {
    const aa = anchorDate == 'weeks' ? ' Week '+ value : anchorDate == 'days' ? 'Day '+ value : anchorDate == 'years' ? 'Year '+ value : Fnc.dateYearMonth(value)
    return aa ;
  }
  function formatYAxisLabel(value) {
    return Fnc.numExceedsBasic(value) + ' USD';
  }
  const { labels, colors, series, options } = chart;

  const chartOptions = useChart({
    colors: ['#9370DB', '#FF00FF'],
    plotOptions: {
      bar: {
        columnWidth: '25%',
      },
    },
    fill: {
      type: series.map((i) => i.fill),
    },
    labels,
    xaxis: {
      type: 'category',
      labels: { formatter: formatLabelDate },
    },
    yaxis: {
      // title: { text: 'USD', },
      labels: { formatter: (value) => {
                  return Fnc.numExceedsBasic(value) + ' USD';
                }, 
              },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return `${value.toFixed(2)} USD`;
          }
          return value;
        },
      },
    },
    ...options,
  });

  return (
    <Paper elevation={1} sx={{ padding: 3, display: 'flex', alignItems: 'center' }} {...other}>
      
      <Box sx={{ flexGrow: 1 }}>

        <Typography variant="h5" gutterBottom>
          {onTitle}
          <Typography style={{fontSize:'13px', color: 'gray', marginTop:'-2px'}}>
            {subheader}
          </Typography>
          <Box>

            <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleCLOSE} >
              <MenuItem onClick={()=>changeDATEORDER('days')}>by days</MenuItem>
              <MenuItem onClick={()=>changeDATEORDER('weeks')}>by weeks</MenuItem>
              <MenuItem onClick={()=>changeDATEORDER('months')}>by months</MenuItem>
              <MenuItem onClick={()=>changeDATEORDER('years')}>by years</MenuItem>
            </Menu>

            <Button onClick={handleDATEORDER} style={{marginTop:'-10px'}} size='small' >
              {anchorDate == 'date' ? 'Date' : 'By '+anchorDate}
            </Button>

            <>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={()=>filter({modal: true, title: what, })} style={{marginTop:'-10px'}} size='small' >
              Filter
            </Button>
            </>

          </Box>


        </Typography>
        <Box sx={{ p: 0, pb: 0 }}>
          <Chart
            dir="ltr"
            type="line"
            series={series}
            options={chartOptions}
            width="100%"
            height={290}
          />
        </Box>

      </Box>
    </Paper>
  );
}

Charts_Records.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

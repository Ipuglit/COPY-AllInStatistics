
import { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Button,
  FormControlLabel,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,



} from '@mui/material';

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'

import { RawApplications } from 'src/hooks/raw/applications'
import { RawRoles } from 'src/hooks/raw/roles'

export default function AddingAccount(receivedData) {
  
  const item        = receivedData.receivedData

  const rawApp      = RawApplications().data
  const rawRoles    = RawRoles("LOWERMID").data

  const [dataList, setdataList] = useState(item);
  const [open, setOpen] = useState(false);

  const [istatus, setistatus] = useState(item.statusLabel);

  const ondialogClose = () => {
    setOpen(false);
  };

  const onchangeStatus = () => {
    if(istatus == "Active"){
      setistatus("Pending")
    } else if(istatus == "Pending"){
      setistatus("Disabled")
    } else {
      setistatus("Active")
    }
  };

  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onchangeItem = (value, x) => {
      item[x] = value
      const newArray = [item];
      newArray[x] = value;
      setdataList(newArray);
  };

  useEffect(() => {

    if(item.modal == "Open"){
        item.modal = "Openned";
        setExpanded(false)
        setOpen(true);
    } else {
        setOpen(false);
    }
    setdataList(item);
  }, [receivedData,item]);

  return (

      <Dialog open={open} >

        <DialogTitle>
             {
              /// JSON.stringify(item,null,2)
             }
        </DialogTitle>

        <DialogContent>


      <Grid container spacing={2} sx={{ padding: '2rem' }}>
        <Grid item xs={12}>
          <Typography variant="h6" component="div">
            Account Form
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Account ID"
            name="Account ID"
            size="small"

            inputProps={{ maxLength: 22 }}
            value={item.accountID}
            onChange={(e) => onchangeItem(Fnc.numberWhole(e.currentTarget.value), "accountID")}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Nickname"
            name="Nickname"
            size="small"
            inputProps={{ maxLength: 18 }}
            value={item.accountNickname}
            onChange={(e) => onchangeItem(Fnc.wordNoSpace(e.currentTarget.value), "accountNickname")}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6}>
                <FormControl fullWidth size='small'>
                    <InputLabel id="filter-select-label">Select role</InputLabel>
                    <Select
                      labelId="filter-select-label"
                      id="filter-select"
                      value={item.accountRole}
                      label="Select role"
                      required
                      onChange={(e) => onchangeItem(e.target.value, "accountRole")}
                    >
                      {
                          rawRoles.map((i, index) => (
                            <MenuItem key={index} value={i.name} >{i.name}</MenuItem>
                            ))
                      }
                    </Select>
                </FormControl>
        </Grid>
        <Grid item xs={12}>
                <FormControl fullWidth size='small'>
                    <InputLabel id="filter-select-label">Select application</InputLabel>
                    <Select
                      labelId="filter-select-label"
                      id="filter-select"
                      value={item.appName}
                      label="Select application"
                      onChange={(e) => onchangeItem(e.target.value, "appName")}
                    >
                      {
                          rawApp.map((i, index) => (
                            <MenuItem key={index} value={i.name} >{i.name}</MenuItem>
                            ))
                      }
                    </Select>
                </FormControl>
        </Grid>
        <Grid item xs={12}>
                {
                  istatus == "Active" ? 
                    <Button onClick={onchangeStatus} size='large'>
                        <Icon icon="mdi:check-circle" color='green' width={22} sx={{ mr: 0 }}  /> 
                        <span style={{color: "green"}}> Active </span>
                    </Button>
                  : istatus == "Pending" ? 
                    <Button onClick={onchangeStatus} size='large'>
                        <Icon icon="mdi:clock-outline" color='orange' width={22} sx={{ mr: 0 }}  />
                        <span style={{color: "orange"}}> Pending </span>
                    </Button>
                  :
                    <Button onClick={onchangeStatus} size='large'>
                        <Icon icon="mdi:close-circle" color='red' width={22} sx={{ mr: 5 }}  />
                        <span style={{color: "red"}}> Disabled </span>
                    </Button>
                }
        </Grid>
        <Grid item xs={12}>
          <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
                <AccordionSummary expandIcon={<Icon icon="solar:double-alt-arrow-up-bold-duotone" color='violet' width={22} sx={{ mr: 5 }}  />} aria-controls="panel1-content">
                  View uplines
                </AccordionSummary>
                <AccordionDetails id="panel1-content">
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            None
                          </td>
                          <td>
                            Yet
                          </td>
                          <td>
                            For now
                          </td>
                        </tr>
                      </tbody>
                    </table>
                </AccordionDetails>
              </Accordion>
        </Grid>



      </Grid>

      <Grid container justifyContent="flex-end">

          <Grid item xs={4} >
              <Button onClick={ondialogClose}>Cancel</Button>
              <Button type="submit">Save Account</Button>
          </Grid>

      </Grid>

        </DialogContent>



        <DialogActions>
            

        </DialogActions>

      </Dialog>

  );
}
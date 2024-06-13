
import { useState, useEffect } from 'react';
import axios from 'axios';
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
import * as Imp from 'src/hooks/importants'
import * as Thm from 'src/hooks/theme'

import { RawApplications } from 'src/hooks/raw/applications'
import { RawRoles } from 'src/hooks/raw/roles'
import { RawUsers } from 'src/hooks/raw/users'

import {AlertDialog} from 'src/items/alert'

import { UpsertData, UpsertLink } from 'src/hooks/upsert/upsert-data'


export default function AddingAccount(receivedData) {
  
  const item        = receivedData.receivedData

  const rawApp      = RawApplications().data
  const rawRoles    = RawRoles("LOWERMID").data
  const rawUsers    = RawUsers().data

  const [dataList, setdataList] = useState(item);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const ondialogClose = () => {
    setOpen(false);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onchangeItem = (val, x) => {

      const newArray = [item];

      if(x == "statusLabel"){

          if(val == "Active"){
              item[x] = "Pending"
              newArray[x] = "Pending";
              item["status"]       = 1
              newArray["status"]   = 1
          } else if(val == "Pending"){
              item[x] = "Disabled"
              newArray[x] = "Disabled";
              item["status"]       = 2
              newArray["status"]   = 2
          } else {
              item[x] = "Active"
              newArray[x] = "Active";
              item["status"]       = 0
              newArray["status"]   = 0
          }

      } else {

        item[x] = val
        newArray[x] = val;

      }

      if(x == "appName"){
        const x = rawApp.find((o) => o.name == val);
        item["appID"]       = x.id
        newArray["appID"]   = x.id
      }

      if(x == "accountRole"){
        const x = rawRoles.find((o) => o.name == val);
        item["accountRoleID"]       = x.id
        newArray["accountRoleID"]   = x.id
      }

      if(x == "userNickname"){
        const x = rawUsers.find((o) => o.nickname == val);
        item["userID"]       = x.id
        newArray["userID"]   = x.id
      }

      setdataList(newArray);
  };

  const onSubmitting =(i,ii)=>{

     async function proceedSubmit() {
        try {
          const response = await axios.post(UpsertLink(ii),UpsertData(i));
          const feed =  response.data;
          console.log("Sent"+feed)
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
    }
    
    if(UpsertData(i)){
      proceedSubmit();
      if(
        item.accountID.length > 5 && 
        item.accountNickname.length > 3 &&
        item.accountRole &&
        item.appName
      ){
        
      }
      
    }


  }

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
            sx={{
                  "& .MuiOutlinedInput-input": { color: 'gray' }, // Change text color
                  "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: 'gray', // Change border color on focus
                  },
                  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: '#EE82EE', // Change border color on selection
                  },
              }}
            InputLabelProps={{ style: { color: 'violet' }, }}
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

        <Grid item xs={6}>
                <FormControl fullWidth size='small'>
                    <InputLabel id="filter-select-label">Select user</InputLabel>
                    <Select
                      labelId="filter-select-label"
                      id="filter-select"
                      value={item.userNickname}
                      label="Select user"
                      onChange={(e) => onchangeItem(e.target.value, "userNickname")}
                    >
                      {
                          rawUsers.map((i, index) => (
                            <MenuItem key={index} value={i.nickname} >{i.nickname}</MenuItem>
                            ))
                      }
                    </Select>
                </FormControl>
        </Grid>

        <Grid item xs={12}>
                {
                  item.statusLabel == "Active" ? 
                    <Button onClick={(e) => onchangeItem("Active","statusLabel")} size='large'>
                        <Icon icon="mdi:check-circle" color='green' width={22} sx={{ mr: 0 }}  /> 
                        <span style={{color: "green"}}> Active </span>
                    </Button>
                  : item.statusLabel == "Pending" ? 
                    <Button onClick={(e) =>onchangeItem("Pending","statusLabel")} size='large'>
                        <Icon icon="mdi:clock-outline" color='orange' width={22} sx={{ mr: 0 }}  />
                        <span style={{color: "orange"}}> Pending </span>
                    </Button>
                  :
                    <Button onClick={(e) =>onchangeItem("Disabled","statusLabel")} size='large'>
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
              <Button onClick={ondialogClose} sx={{ color: 'gray'}} >Cancel</Button>
              <Button onClick={()=>onSubmitting(item,'accounts')} color="secondary">Save Account</Button>
          </Grid>

      </Grid>

        </DialogContent>



      </Dialog>

  );
}
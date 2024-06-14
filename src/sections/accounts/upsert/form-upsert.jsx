
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
} from '@mui/material';

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'

import { RawApplications } from 'src/hooks/raw/applications'
import { RawRoles } from 'src/hooks/raw/roles'
import { RawUsers } from 'src/hooks/raw/users'

import {AlertSnack} from 'src/items/alert_snack'

import { UpsertData, UpsertLink } from 'src/hooks/upsert/upsert-data'

import OnMobileScreen from 'src/items/screen/resize';

export  function AddingItem({receivedData,submittedResult}) {
  
  const item        = receivedData

  const rawApp      = RawApplications().data
  const rawRoles    = RawRoles("LOWERMID").data
  const rawUsers    = RawUsers().data

  const [dataList, setdataList] = useState(item);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  const [onAlertShow, setonAlertShow] = useState(false);
  const [onAlertType, setonAlertType] = useState("");
  const [onAlertMessage, setonAlertMessage] = useState("");
  const [onSubmitLoad, setonSubmitLoad] = useState(false);

  const [onEdit, setonEdit] = useState(false);
  const [onAdd, setonAdd] = useState(false);

  const OnMobile= OnMobileScreen();

  const dataUsers = rawUsers.map(i => {
    return {
              label:                        i.nickname,
              value:                        i.nickname,
            };
            })


  const ondialogClose = () => {
    if(onAdd){
      setOpen(false);
      //window.location.reload();
    } else {
      setOpen(false);
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onchangeItem = (val, x) => {

      const newArray = [item];

      if(!newArray.status){
        item["status"]       = 2
        newArray["status"]   = 2
        item["accountClubsCount"]       = 0
        newArray["accountClubsCount"]   = 0
        item["accountAsUpline"]       = 0
        newArray["accountAsUpline"]   = 0
        item["accountAsDownline"]       = 0
        newArray["accountAsDownline"]   = 0
        item["modal"]       = 'Open'
        newArray["modal"]   = 'Open'
      }

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
        item["appImage"]       = x.imageFull
        newArray["appImage"]   = x.imageFull
      }

      if(x == "accountRole"){
        const x = rawRoles.find((o) => o.name == val);
        item["accountRoleID"]       = x.id
        newArray["accountRoleID"]   = x.id
        item["accountRole"]       = x.name
        newArray["accountRole"]   = x.name
      }

      if(x == "userNickname"){
        const x = rawUsers.find((o) => o.nickname == val);
        item["userID"]       = x.id
        newArray["userID"]   = x.id
        item["userNickname"]       = x.nickname
        newArray["userNickname"]   = x.nickname
        item["userAvatar"]       = x.avatarFull
        newArray["userAvatar"]   = x.avatarFull
        item["userRole"]       = x.roleID
        newArray["userRole"]   = x.roleID
      }

      setonEdit(true)
      setdataList(newArray);
  };


  const inputComplete = (i,ii) => {
    if(i == "" || i == null || i == undefined){
      return true
    } else {
      return false
    }
  };

  const checkIfComplete = (i) => {
    if(i.accountID == "" || i.accountID == undefined  || i.accountNickname == "" || i.accountNickname == undefined || i.accountRole == "" || i.accountRole == undefined || i.userNickname == "" || i.userNickname == undefined || i.appName == "" || i.appName == undefined || i.statusLabel == "" || i.statusLabel == undefined  || i.userID == "" || i.userID == undefined){
      return true
    } else {
      return false
    }
  };

  const onSubmitting =(i,ii)=>{
    if( checkIfComplete(i) ){
      showAlert('warning',2000,"Please complete all details")
      setonAlertShow(true)
    } else {
        setonSubmitLoad(true)
        proceedSubmit()
    }

    async function proceedSubmit() {

      try {
        const response = await axios.post(UpsertLink(ii),UpsertData(i));
        const feed =  response.data;

        if(feed == "Updated"){
          showAlert('success',2500,'Account successfully updated!','update')
        } else if(feed.includes("Added New")){
          onchangeItem(feed.replace(/.*\(|\).*/g, ''),'id')
          showAlert('success',2500,'Account successfully added! ','add')
          setonAdd(true)
        } else {
          showAlert('warning',3000,feed,'none')
          setonEdit(true)
        }
        setonAlertShow(true)
        setonSubmitLoad(false)

      } catch (error) {
        setonAlertShow(true)
        setonSubmitLoad(false)
        showAlert('error',3000,'Sorry! Something went wrong...','none')
      }
    }

  }

  const showAlert = (i,ii,iii,iiii) => {
    setonAlertType(i)
    setonAlertMessage(iii)
    setonEdit(false)
    submittedResult({
                    status: true,
                    alert: i,
                    duration: ii,
                    message: iii,
                    items: item,
                    type: iiii,
                  })
    const T = setTimeout(() => {
      setonAlertShow(false)
    }, ii);
    return () => clearTimeout(T);

  };


  useEffect(() => {

    if(item.modal == "Open"){
        item.modal = "Openned";
        setExpanded(false)
        setOpen(true);
    } else {
        setOpen(false);
    }
    setonAdd(false)
    setonEdit(false)
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


      <Grid container spacing={OnMobile ? 1 : 2} sx={{ padding: OnMobile ? '0rem' : '2rem' }}>
        <Grid item xs={12}>
          <Typography variant="h6" component="div">
            ACCOUNT FORM
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Account ID"
            name="Account ID"
            size="small"
            error={inputComplete(item.accountID)}
            //InputLabelProps={{ style: { color: '#BA55D3' }, }}
            inputProps={{ maxLength: 22 }}
            value={item.accountID ? item.accountID : ''}
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
            error={inputComplete(item.accountNickname)}
            //nputLabelProps={{ style: { color: '#BA55D3' }, }}
            inputProps={{ maxLength: 18 }}
            value={item.accountNickname ? item.accountNickname : ''}
            onChange={(e) => onchangeItem(Fnc.wordNoSpace(e.currentTarget.value), "accountNickname")}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={6}>
                <FormControl fullWidth size='small'>
                    <InputLabel 
                        id="filter-select-label" 
                        //style={{color: '#BA55D3'}}
                        >Role</InputLabel>
                    <Select
                      labelId="filter-select-label"
                      id="filter-select"
                      error={inputComplete(item.accountRole)}
                      value={item.accountRole ? item.accountRole : ''}
                      label="Role"
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
                    <InputLabel 
                        id="filter-select-label" 
                        //style={{color: '#BA55D3'}}
                        >Application</InputLabel>
                    <Select
                      labelId="filter-select-label"
                      id="filter-select"
                      error={inputComplete(item.appName)}
                      value={item.appName ? item.appName : ''}
                      label="Application"
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
                    <InputLabel 
                        id="filter-select-label" 
                        //style={{color: '#BA55D3'}}
                        >
                          User
                    </InputLabel>
                    <Select
                      labelId="filter-select-label"
                      id="filter-select"
                      error={inputComplete(item.userNickname)}
                      value={item.userNickname ? item.userNickname : ''}
                      label="User"
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
      { OnMobile ? <br/> : null}
        <Grid container justifyContent="flex-end">

              { 
                onEdit ? 
                <Grid item xs={OnMobile ? 4 : 2.7} >
                {
                  onSubmitLoad ?
                  <Button  color="secondary" >SUBMITTING...</Button>
                  :
                  <Button onClick={()=>onSubmitting(item,'accounts')} color="secondary">SAVE</Button>
                }
                  
                </Grid>
                : 
                null
              }
            
            <Grid item xs={2} >
              <Button onClick={ondialogClose} sx={{ color: 'gray'}} >{onEdit ? "CANCEL" : "CLOSE" }</Button>
            </Grid>
        </Grid>
                
        </DialogContent>

        {onAlertShow ? AlertSnack(onAlertType,onAlertMessage) : null}

      </Dialog>

  );
}
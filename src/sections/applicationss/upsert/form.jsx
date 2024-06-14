
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


} from '@mui/material';

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'


import { RawRoles } from 'src/hooks/raw/roles'
import { RawImages } from 'src/hooks/raw/images'
import { RawCompany } from 'src/hooks/raw/company'

import { AlertSnack } from 'src/items/alert_snack'

import { UpsertData, UpsertLink } from 'src/hooks/upsert/upsert-data'

import OnMobileScreen from 'src/items/screen/resize';

export  function AddingItem({receivedData,submittedResult}) {
  
  const item        = receivedData

  const rawRoles    = RawRoles("LOWERMID").data
  const rawCompany  = RawCompany("ALL").data


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

      if(!item.id || item.id == undefined || item.id == 0 || item.id == null){
          item["status"]       = 2
          newArray["status"]   = 2

          item["imageID"]       = 20
          newArray["imageID"]   = 20

          item["image"]       = "default.jpg"
          newArray["image"]   = "default.jpg"

          item["imageFull"]       = "/images/applications/default.jpg"
          newArray["imageFull"]   = "/images/applications/default.jpg"

          item["activeAccounts"]       = 0
          newArray["activeAccounts"]   = 0

          item["pendingAccounts"]       = 0
          newArray["pendingAccounts"]   = 0

          item["allAccounts"]       = 0
          newArray["allAccounts"]   = 0

          item["activeClubs"]       = 0
          newArray["activeClubs"]   = 0

          item["pendingClubs"]       = 0
          newArray["pendingClubs"]   = 0

          item["modal"]       = 'Open'
          newArray["modal"]   = 'Open'
          console.log("NULLLLE")
      }

      if(x == "company"){
          const z = rawCompany.find((o) => o.name == val);
          item["companyID"]       = z.id
          newArray["companyID"]   = z.id
      }
      
      if(x == "statusLabel"){

          if(val == "Active"){
              item[x] = "Pending"
              newArray[x] = "Pending";
              item["status"]       = "1"
              newArray["status"]   = "1"
          } else if(val == "Pending"){
              item[x] = "Disabled"
              newArray[x] = "Disabled";
              item["status"]       = "2"
              newArray["status"]   = "2"
          } else {
              item[x] = "Active"
              newArray[x] = "Active";
              item["status"]       = "0"
              newArray["status"]   = "0"
          }

      } else {
        
        item[x] = val
        newArray[x] = val;

        item["roleName"]       = x.name
        newArray["roleName"]   = x.name
      }

      if(x == "imageID"){

        item["imageID"]       = x.imageID
        newArray["imageID"]   = x.imageID

        item["image"]       = x.image
        newArray["image"]   = x.image

        item["imagePath"]       = x.imagePath
        newArray["imagePath"]   = x.imagePath

        item["imageFull"]       = x.imageFull
        newArray["imageFull"]   = x.imageFull

      }
      console.log("Value: "+JSON.stringify(newArray,null,2))
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
    if(i.name == "" || i.name == undefined  || i.companyID == "" || i.companyID == undefined || i.status == "" || i.status == undefined ){
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
          showAlert('success',2500,'User successfully updated!','update')
        } else if(feed.includes("Added New")){
          onchangeItem(feed.replace(/.*\(|\).*/g, ''),'id')
          showAlert('success',2500,'User successfully added! ','add')
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
        showAlert('error',3000,'Failed! Something went wrong...','none')
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
                  console.log("Dee "+JSON.stringify(item,null,2))
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
            APPLICATION FORM
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Name"
            name="Name"
            size="small"
            error={inputComplete(item.name)}
            //InputLabelProps={{ style: { color: '#BA55D3' }, }}
            inputProps={{ maxLength: 22 }}
            value={item.name ? item.name : ''}
            onChange={(e) => onchangeItem(Fnc.wordNoSpace(e.currentTarget.value), "name")}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12}>
          
                <FormControl fullWidth size='small'>
                    <InputLabel 
                        id="filter-select-label" 
                        //style={{color: '#BA55D3'}}
                        >Company</InputLabel>
                    <Select
                      labelId="filter-select-label"
                      id="filter-select"
                      error={inputComplete(item.company)}
                      value={item.company ? item.company : ''}
                      label="Company"
                      required
                      onChange={(e) => onchangeItem(e.target.value, "company")}
                    >
                      {
                          rawCompany.map((i, index) => (
                            <MenuItem key={index} value={i.name} >{i.name}</MenuItem>
                            ))
                      }
                    </Select>
                </FormControl>

        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Details"
            name="Details"
            multiline
            rows={2}
            defaultValue="Default value"
            variant="outlined"
            error={inputComplete(item.details)}
            //InputLabelProps={{ style: { color: '#BA55D3' }, }}
            inputProps={{ maxLength: 100 }}
            value={item.details ? item.details : ''}
            onChange={(e) => onchangeItem(Fnc.wordNoSpace(e.currentTarget.value), "details")}
            fullWidth
            required

          />

        </Grid>

      {
        item.id ? 
        <Grid item xs={12}>

                <Typography variant="subtitle1" fontSize="small" sx={{ color: 'text.secondary' }} noWrap style={{ marginTop: '-5px' }}>
                    <span style={{fontSize:"12px"}}>
                      {item.activeAccounts == 0 ? 'No active account' : item.activeAccounts == 1 ? '1 active account' : item.activeAccounts+' active accounts' }
                    </span>
                </Typography>

                <Typography variant="subtitle1" fontSize="small" sx={{ color: 'text.secondary' }} noWrap style={{ marginTop: '-5px' }}>
                    <span style={{fontSize:"12px"}}>
                      {item.pendingAccounts == 0 ? 'No active account' : item.pendingAccounts == 1 ? '1 pending account' : item.pendingAccounts+' pending accounts' }
                    </span>
                </Typography>

        </Grid>
        :
        null
      }


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
                  <Button onClick={()=>onSubmitting(item,'applications')} color="secondary">SAVE</Button>
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
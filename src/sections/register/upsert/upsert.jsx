import { useState, useEffect } from 'react';
import axios from 'axios';
import { Stack, Button, Container, Grid, Avatar, Typography, Card, Box, TextField, Divider, Alert  } from '@mui/material/';

import { UpsertDATA, LinkUPLOAD, ImageLink } from 'src/hooks/upsert/upsert-data'

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'
import * as Imp from 'src/hooks/importants'

import { imagetoRESIZE, imagetoUPLOAD, imageUPLOADS,  } from 'src/hooks/imageupload'
import { Icon } from '@iconify/react';
import {Alerting} from 'src/items/alert_snack/'

// ----------------------------------------------------------------------

export default function Upsert({TheFor,TheTitle}) {
  const onMobile = Fnc.OnMobile()
  const [onAlert, setonAlert]             = useState({onOpen: 0, severity: '', message: ''});
  const [data, setData] = useState({
                                      avatarpreview:       '',
                                      avatar:       'default_img_avatar.jpg',
                                      nickname:     '',
                                      firstname:     '',
                                      lastname:     '',
                                      ifnickname:   false,
                                      telegram:     '',
                                      email:        '',
                                      ifemail:      false,
                                      username:     '',
                                      ifusername:   false,
                                      password:     '',
                                      ifpassword:   false,
                                      repassword:   '',
                                      ifrepassword: false,
                                      })
    const [modified, setModified]       = useState(false)
    const [submitted, setSubmitted]     = useState('')
    const [submitting, setSubmitting]   = useState(false)

    const handleChange =(i,ii)=>{

        const val   = ii == 'username' ? Fnc.textUsername(i) 
                    : ii == 'password' || ii == 'repassword' ? Fnc.textPassword(i) 
                    : ii == 'nickname' ? Fnc.textNickname(i)
                    : ii == 'firstname' ? Fnc.textName(i)
                    : ii == 'lastname' ? Fnc.textName(i) : i

        if(ii == 'username' && data['avatarpreview'] != ''){
          setData({ ...data,  [ii]: val, avatar: val+'.jpg' })
        } else {
          setData({ ...data,  [ii]: val, })
        }

    }

    const isvalidPassword = (i,e)=>{

      const hasNumber = /\d/; 
      const hasLowerCase = /[a-z]/;
      const hasUpperCase = /[A-Z]/; 
      const hasSpecialChar = /[\W_]/;

      if( hasNumber.test(i) && hasLowerCase.test(i) && hasUpperCase.test(i) && hasSpecialChar.test(i)&& i?.length > 5 && i == e) {
        return true
      } else {
        return false
      }
    }


    const handleCheck =()=>{
        
        const pass    = Fnc.checkPassword(data['password'])
        const email   = data['email'] !='' ? Fnc.checkEmail(Fnc.checkClean(data['email'])) : true;
        const uname   = Fnc.checkInput(data['username'],5)
        const nname   = Fnc.checkInput(Fnc.checkClean(data['nickname']),5)
        const repass  = data['password'] == data['repassword'] ? true : false

          setData({
                    ...data,
                    avatar:       data['avatarpreview'] != '' ? Fnc.checkClean(data['username'])+'.jpg' : 'default_img_avatar.jpg',
                    nickname:     Fnc.checkClean(data['nickname']),
                    firstname:    Fnc.checkClean(data['firstname']),
                    lastname:     Fnc.checkClean(data['lastname']),
                    email:        Fnc.checkClean(data['email']),
                    telegram:     Fnc.checkClean(data['telegram']),
                    username:     Fnc.checkClean(data['username']),
                    password:     Fnc.checkClean(data['password']),
                    ifnickname:   nname,
                    ifemail:      email,
                    ifusername:   uname,
                    ifpassword:   pass,
                    ifrepassword: repass,
                  })

          setSubmitted('')
          setSubmitting(true)

        if( pass && email && uname && nname && repass ){
          handleSubmit()
        } else {
          setModified(true)
          setSubmitting(false)
        }

    }

    async function handleSubmit() {

      try {

          const response = await axios.post(LinkUPLOAD('register'),data);

          const feed =  response.data;
          console.log(feed)
          if(feed == 'ZERO' || feed?.feed == 'NONE'){
            setSubmitted('failed')
            setonAlert({onOpen: Fnc.numRandom(), severity:'error', message:'Please try again! Check your internet connection'})

          } else if(feed['state'] == 'duplicate'){

            setSubmitted('duplicate')
            setonAlert({onOpen: Fnc.numRandom(), severity:'warning', message:'Account already taken!'})

          } else if(feed['state'] == 'added'){

            if( !Fnc.isNull(data['avatarpreview']) ){
              imageUPLOADS('users',data['avatarpreview'],feed['feed'])          
            }

            setonAlert({onOpen: Fnc.numRandom(), severity:'success', message:'Registered!'})
            setSubmitted('success')

          }
          setSubmitting(false)
      } catch (error) {
          setonAlert({onOpen: Fnc.numRandom(), severity:'error', message:'Something went wrong!'})
          setSubmitting(false)
      }
    }

    // ==================================================
    // =================== ++ FILTER ++ ===============================

    const handleUploadImage = async (event) => {
      const file            = event.target.files[0];
      const imagePreview    = await imagetoRESIZE(file);
      setData({ ...data,  avatar:data['username']+'.jpg', avatarpreview: imagePreview })
    };
    
    useEffect(() => {

    }, [data]); 


  return (
<>

<Button variant="text" 
        size='small' 
        color="inherit" 
        onClick={()=>( window.history.go(-1)  )}
        startIcon={<Icon icon="eva:arrow-ios-back-fill" />} 
        style={{marginTop:'20px', marginLeft: '10px'}} >
          Go back 
</Button>

<Container >


<Stack alignItems="center" justifyContent="center" sx={{ height: 1 }} style={{marginTop:'10px'}}>
  <Card
    sx={{
      p: 5,
      width: 1,
      maxWidth: 750,
    }}
  >
    <Typography variant={onMobile ? 'h5' : 'h4'}>
      REGISTER
    </Typography>

    <Divider/>

    <Grid container spacing={{ xs: 2, md: 1 }} columns={{ xs: 12, sm: 12, md: 12 }} style={{marginTop:"20px"}}>
          <Grid item xs={12} sm={12} md={12} padding={'10px'}>
            <Box
              height={200}
              width='100%'
              my={4}
              display="flex"
              alignItems="center"
              gap={4}
              p={2}
              sx={{ border: '2px solid grey' }}
            >
            <Avatar
              alt="image"
              src={data['avatarpreview']}
              sx={{ width: 126, height: 126 }}
            />
              <input type="file" accept='.jpeg, .jpg, .png' onChange={handleUploadImage} />
            </Box>

          </Grid>

          <Grid item xs={12} sm={12} md={12} padding={'10px'}>
              <TextField 
                  error ={modified && !data['ifnickname']  ? true : false}
                  name="text"
                  style={{minWidth: '50%'}}
                  required
                  size='small'
                  InputProps={{  maxLength: 22, sx: { fontSize: onMobile ? '12px' : '',  }, }}
                  InputLabelProps={{  sx: { fontSize: onMobile ? '11px' : '',  }, }}
                  label={modified && !data['ifnickname'] ? "Nickname (atleast 5 characters)" : "Nickname"}
                  value={data['nickname']}
                  onChange={(e) => handleChange(e.target.value,'nickname')} />
          </Grid>

          <Grid item xs={12} sm={6} md={6} padding={'10px'}>
              <TextField 
                  name="text"
                  size='small'
                  style={{minWidth: '100%'}}
                  label={"Firstname (optional)"}
                  value={data['firstname']}
                  InputProps={{  maxLength: 35, sx: { fontSize: onMobile ? '12px' : '',  }, }}
                  InputLabelProps={{  sx: { fontSize: onMobile ? '11px' : '',  }, }}
                  onChange={(e) => handleChange(e.target.value,'firstname')} />
          </Grid>

          <Grid item xs={12} sm={6} md={6} padding={'10px'}>
              <TextField 
                  name="text"
                  size='small'
                  style={{minWidth: '100%'}}
                  label={"Lastname (optional)"}
                  value={data['lastname']}
                  InputProps={{  maxLength: 35, sx: { fontSize: onMobile ? '12px' : '',  }, }}
                  InputLabelProps={{  sx: { fontSize: onMobile ? '11px' : '',  }, }}
                  onChange={(e) => handleChange(e.target.value,'lastname')} />
          </Grid>

    </Grid>

      <br></br>
      <Typography variant="div" sx={{fontSize: onMobile ? '11px' : ''}}>Contacts:</Typography>
      <Divider/>

    <Grid container spacing={{ xs: 2, md: 1 }} columns={{ xs: 12, sm: 12, md: 12 }} style={{marginTop:"10px"}}>

          <Grid item xs={12} sm={6} md={6} padding={'10px'}>
              <TextField 
                  error ={modified && !data['ifemail']  ? true : false}
                  name="text"
                  size='small'
                  fullWidth
                  label={modified && !data['ifemail'] && data['email'] != '' ? "Email (invalid format)" : "Email (optional)"}
                  value={data['email']}
                  InputProps={{  maxLength: 55, sx: { fontSize: onMobile ? '12px' : '',  }, }}
                  InputLabelProps={{  sx: { fontSize: onMobile ? '11px' : '',  }, }}
                  onChange={(e) => handleChange(e.target.value,'email')} />
          </Grid>

          <Grid item xs={12} sm={6} md={6} padding={'10px'}>

              <TextField 
                  error ={false}
                  name="text"
                  size='small'
                  fullWidth
                  label="Telegram (optional)"
                  value={data['telegram']}
                  InputProps={{  maxLength: 55, sx: { fontSize: onMobile ? '12px' : '',  }, }}
                  InputLabelProps={{  sx: { fontSize: onMobile ? '11px' : '',  }, }}
                  onChange={(e) => handleChange(e.target.value,'telegram')} />

          </Grid>
    </Grid>

    <br></br>
    <Typography variant="div" sx={{fontSize: onMobile ? '11px' : ''}}>Credentials:</Typography>
    <Divider/>

    <Grid container spacing={{ xs: 2, md: 1 }} columns={{ xs: 12, sm: 12, md: 12 }} style={{marginTop:"10px"}}>
          <Grid item xs={12} sm={12} md={12} padding={'10px'}>

              <TextField 
                  error ={modified && !data['ifusername']  ? true : false}
                  name="text"
                  size='small'
                  style={{minWidth: '50%'}}
                  required
                  label={data['ifusername'] ? "Username" : "Username (atleast 5 characters)" }
                  value={data['username']}
                  InputProps={{  maxLength: 22, sx: { fontSize: onMobile ? '12px' : '',  }, }}
                  InputLabelProps={{  sx: { fontSize: onMobile ? '11px' : '',  }, }}
                  onChange={(e) => handleChange(e.target.value,'username')} />

          </Grid>

          <Grid item xs={12} sm={12} md={6} padding={'10px'}>

              <TextField 
                  error ={data?.password?.length > 0 && !isvalidPassword(data?.password,data?.repassword)}
                  name="text"
                  fullWidth
                  required
                  type='password'
                  label={"Password"}
                  value={data['password']}
                  InputProps={{  maxLength: 22, sx: { fontSize: onMobile ? '12px' : '',  }, }}
                  InputLabelProps={{  sx: { fontSize: onMobile ? '11px' : '',  }, }}
                  onChange={(e) => handleChange(e.target.value,'password')} />
          </Grid>

          <Grid item xs={12} sm={12} md={6} padding={'10px'}>
                <TextField 
                    error ={data?.password?.length > 0 && !isvalidPassword(data?.password,data?.repassword)}
                    name="text"
                    fullWidth
                    required
                    type='password'
                    label={modified && !data['ifrepassword'] && data['repassword'] ? 'Password do not match' : 'Re-type Password'}
                    value={data['repassword']}
                    InputProps={{  maxLength: 22, sx: { fontSize: onMobile ? '12px' : '',  }, }}
                    InputLabelProps={{  sx: { fontSize: onMobile ? '11px' : '',  }, }}
                    onChange={(e) => handleChange(e.target.value,'repassword')} />

          </Grid>
          { modified && !data['ifpassword'] ?
            <Grid item xs={12} sm={12} md={12}>
              <Alert severity="error">Password must atleast be 5 characters long with have 1 capital letter, 1 lowercase letter, 1 special character, and 1 numeric character.</Alert>
            </Grid>
              : 
              null
          }


      </Grid>

      <br/>
      <Box
      sx={{
        display: 'flex',
        justifyContent: 'center', // Horizontal centering
        alignItems: 'center',     // Vertical centering

      }}
    >
      
        {
          submitted == 'success' 
          ?
            <>
              <Button variant='outlined' onClick={()=>window.location.href = '/login'} sx={{...Cls.buttonClass('outlined','violet'), minWidth:'150px',borderRadius:'0',fontSize: onMobile ? '11px' : ''}}>Go to Login Page </Button>
            </>
          : 
          submitting ? 
            <Button variant='outlined' sx={{...Cls.buttonClass('outlined','violet'), minWidth:'150px',borderRadius:'0',fontSize: onMobile ? '11px' : ''}}>Submitting... </Button>
          :
            <Button variant='contained' size="large" onClick={()=>handleCheck()} sx={{...Cls.buttonClass('contained','violet'), minWidth:'150px',borderRadius:'0',fontSize: onMobile ? '11px' : ''}}>Submit </Button>
        }

    </Box>


  </Card>
</Stack>
{Fnc.JSONS(data,true)}
</Container>
<Alerting onOpen={onAlert.onOpen} severity={onAlert.severity} title={onAlert.title} message={onAlert.message} />
</>

  );
}


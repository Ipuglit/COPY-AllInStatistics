import axios from 'axios';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert'

import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'src/routes/hooks';
// import { Login } from '../../hooks/raw/login'
import { bgGradient } from 'src/theme/css';

import * as Imp from '../../hooks/importants'
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();

  const [username, setUsername]           = useState("");
  const [password, setPassword]           = useState("");
  const [showPassword, setShowPassword]   = useState(false);
  const [showAlert, setShowAlert]         = useState(false);
  const [showRed, setshowRed]             = useState(false);
  // const [whenLogin, setSwhenLogin]        = useState(false);

  useEffect(() => {

    localStorage.removeItem('slk-token');

    const T = setTimeout(() => {
      localStorage.removeItem('slk-user');
      localStorage.removeItem('slk-token');
      localStorage.removeItem('slk-route');
      sessionStorage.setItem('slk-announce', 'false');
    }, 200);
    return () => clearTimeout(T);

  },[]);


  async function logging() {
    try {
      const response = await axios.post(Imp.Upsert['login'], {
                                                                un: username,
                                                                pw: password,
                                                                tz: Imp.TimeZoned,
                                                            });

      const feed =  response.data[0];

      if(response.data == "NONE" || response.data == "INC" || response.data == "ERR"){

        clearLogin()
        setshowRed(true)
        setShowAlert(true)
        console.log("Failed Logging!")

        localStorage.removeItem("slk-theme")

      } else {

        localStorage.setItem('slk-token', JSON.stringify({
                                                          id:         feed.uid,
                                                          gadget:     feed.gadget,
                                                          token:      feed.token,
                                                          timezone:   Imp.TimeZoned,
                                                      }));
                                                      
        localStorage.setItem('slk-user', JSON.stringify({
                                                          role:       feed.role,
                                                          roleID:     feed.roleID,
                                                          nickname:   feed.nickname,
                                                          username:   feed.username,
                                                          firstname:  feed.firstname,
                                                          lastname:   feed.lastname,
                                                          avatar:     feed.avatar,
                                                          email:      feed.email,
                                                          telegram:   feed.telegram,
                                                          status:     feed.status,
                                                      }));

        localStorage.setItem('slk-route', JSON.stringify({
                                                          apps:         feed.forApp,
                                                          clubs:        feed.forClubs,
                                                          clubpercent:  feed.forClubPercent,
                                                          unions:       feed.forUnions,
                                                          users:        feed.forUsers,
                                                          deals:        feed.forDeals,
                                                          accounts:     feed.forAccounts,
                                                          uplines:      feed.forUplines,
                                                          uppercent:    feed.forUpPercent,
                                                          notification: feed.forNotification,
                                                          records:      feed.forRecords,
                                                          formula:      feed.forFormula,
                                                          history:      feed.forHistory,
                                                          fxrates:      feed.forFXRates,
                                                          csvup:        feed.forCSVUp,
                                                          announce:     feed.forAnnounce,
                                                      }));    

        localStorage.setItem('slk-dataview', 'card');    

        localStorage.setItem("slk-theme",JSON.stringify({
                                                          id: 1,
                                                          theme: 'dark',
                                                        }))
        
        sessionStorage.setItem('slk-announce', 'false');              

       console.log("Success! Logging in...")

        const Timed = setTimeout(() => {
            router.push('/');
        }, 500);
        return () => clearTimeout(Timed);

      }



    } catch (error) {
      console.error("Cannot login!");
    }
  }


  const handleChange = (i,ii) => {
    const newValue = i.replace(/\s/g, ''); // Remove spaces using regex
    ii(newValue)
  };

  const handleClick = () => {
    if(username && password){
      setshowRed(false) 
      setShowAlert(false)
      logging()
    } else {
      setshowRed(true)
      setShowAlert(true)
    }
  };

  const thatClick = () => {
    setshowRed(false)
  };

  const clearLogin = () => {
    localStorage.removeItem('slk-token');
    localStorage.removeItem('slk-user');

    const T = setTimeout(() => {
      localStorage.removeItem('slk-user');
      localStorage.removeItem('slk-token');
    }, 200);
    return () => clearTimeout(T);
  };


  const renderForm = (
    <>
      <Stack spacing={0}>

        <TextField 
          error ={showRed ? true : false}
          name="text" 
          label="Username"
          value={username}
          onClick={thatClick}
          onChange={(e) => handleChange(e.target.value,setUsername)} />

        <TextField
          error ={showRed ? true : false}
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onClick={thatClick}
          onChange={(e) => handleChange(e.target.value,setPassword)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          style={{marginTop: "15px"}}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover" style={{cursor:"pointer"}}>
          Forgot password?
        </Link>
      </Stack>


      <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="inherit"
          onClick={handleClick}
        >
          Login
        </LoadingButton>

      {
        showAlert ?
        <Alert variant="outlined" severity="error" style={{marginTop:"30px"}}>
          Incorrect username and password!
        </Alert>
        :
        null
      }


    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Poker Analytics Sign in</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Don’t have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }} href='./register' style={{cursor:"pointer"}}>
              Register!
            </Link>
          </Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}

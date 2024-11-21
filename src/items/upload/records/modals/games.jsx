
import { useState, useEffect } from 'react';
import axios from 'axios';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Select,
  MenuItem,
  Chip,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
} from '@mui/material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { Icon } from '@iconify/react';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

import {AlertSnack} from 'src/items/alert_snack'



export default function UpdateGames({dataReceived,dataSubmitted}) {
  
  const [item, setItem]           = useState([]);
  const [games, setGames]         = useState([]);
  const [onOpen, setonOpen]       = useState(false);
  const [onEdit, setonEdit]   = useState(false);
  const [onSubmit, setonSubmit]   = useState(false);
  const [onAlert, setonAlert]     = useState(false);
  const [semiTotal,setsemiTotal]  = useState(0)
  const [negaTotal,setnegaTotal]  = useState(0)
  const [posiTotal,setposiTotal]  = useState(0)

  const onPC = useMediaQuery('(min-width: 700px)');

  const ondialogClose = () => {
    setonOpen(false);
    setonEdit(false)
    setItem([])
    setsemiTotal(0)
    dataReceived = null
    setonAlert(false)
  };

  const onchangeItem = (val,id,ndx) => {

    const updt = [...games];
    updt[ndx].value = val

    setGames(updt)
    sumGames(updt)
    setonEdit(true)

  };

  const sumGames = (x) => {
    var sumArr = []
    x.map((i,index) => (
      sumArr = [...sumArr,parseFloat(i.value)]
    ))

    setsemiTotal(Fnc.addNumbers(sumArr))
    if(dataReceived.TYPE =='WINLOSS'){
      setnegaTotal(Fnc.sumNega(sumArr))
      setposiTotal(Fnc.sumPosi(sumArr))
    }

  };

  const onsubmitItem = (i) => {

      dataSubmitted({
        type: item.TYPE,
        total: semiTotal,
        win: posiTotal,
        loss: negaTotal,
        index: item.INDEX,
        values: i,
      })

      const T = setTimeout(() => {
        ondialogClose()
      }, 500);
      return () => clearTimeout(T);

  };

  useEffect(() => {
    if(dataReceived.DIALOG == true){
        setItem(dataReceived)
        setGames(dataReceived.GAMES)
        setonOpen(dataReceived.DIALOG)
        sumGames(dataReceived.GAMES)
        dataReceived.DIALOG = false
       // console.log(dataReceived.GAMES)
    }
  }, [dataReceived]);

  return (

      <Dialog open={onOpen} >

        <DialogTitle style={{marginTop: '10px'}}>

            <Typography variant="h4" component="div" >
              {item.TYPE =='WINLOSS' ? 'WIN/LOSS' : item.TYPE =='BONUS' ? 'BONUS' : ''} TOTAL
            </Typography>

            <Typography variant="subtitle1" component="div" style={{marginTop: '-2px',marginBottom: '12px'}}>
              <Chip label={'Total: '+item.TOTAL} size='small' /> {semiTotal != 0 && semiTotal != item.TOTAL ? <Chip label={'New Total: '+semiTotal} size='small' color="success" /> : null}
              {
                item.TYPE == 'WINLOSS' && (posiTotal != '' || posiTotal != 0) ? 
                  <Chip variant='outlined' style={{fontSize:'11px'}} label={'Win: '+posiTotal} size='small' />
                : null
              }
              &nbsp;
              {
                item.TYPE == 'WINLOSS' && (negaTotal != '' || negaTotal != 0) ? 
                    <Chip variant='outlined' style={{fontSize:'11px'}} label={'Loss: '+negaTotal} size='small' />
                : null
              }


            </Typography>

            {
              item.PLAYER ?
              <Typography variant="caption" component="div">
                {item.PLAYER}
              </Typography>
              : null
            }
            {
              item.CLUB ?
              <Typography variant="caption" component="div">
                Club: {item.CLUB}
              </Typography>
              : null
            }
            {
              item.DATE ?
              <Typography variant="caption" component="div">
                Closed: {Fnc.dateWord(item.DATE)}
              </Typography>
              : null
            }
        </DialogTitle>

        <DialogContent>
        <Divider />

      <Grid container spacing={ onPC ? 1 : 2} sx={{ padding: '0rem', marginTop:'20px' }}>
        
        <Grid item xs={12} md={12} xl={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 250 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell >Poker Games</TableCell>
                  <TableCell align="center">Values</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>

              {games.map((i,index) => (
                    <TableRow key={i.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >

                      <TableCell align="left" sx={Cls.labelResizing('14','9.5','300','190')}>{i.syn}</TableCell>
                      
                      <TableCell align="right">
                          <TextField
                            size="small"
                            sx={Cls.inputResizing('13','0','9.5','0','','center')}
                            InputProps={{ maxLength: 18, }}
                            value={i.value ? i.value : 0}
                            onChange={(e) => onchangeItem(Fnc.numUnpure(e.currentTarget.value), i.id, index)}
                          />
                      </TableCell>

                    </TableRow>
                ))}

              </TableBody>
            </Table>
          </TableContainer>
        </Grid>



      </Grid>



                
        </DialogContent>

        { onPC ? <br/> : null}

        <Divider />
        <DialogActions sx={{marginBottom:'15px', marginRight:'40px', marginTop: '10px',display: 'flex', justifyContent: 'center'}}>
        {
          onAlert ? 
          <>
          <Button color="secondary" >SAVING...</Button>
          </>
          :
          <>
          {
            onEdit ? 
            <Button onClick={()=>{setonAlert(true),onsubmitItem(games)}} color="secondary">SAVE CHANGES</Button>
            : null
          }
          <Button onClick={ondialogClose} sx={{ color: 'gray'}} >{onSubmit ? "CANCEL" : "CLOSE" }</Button>
          </>
        }


        </DialogActions>



      </Dialog>

  );
}
import {
  Table,
  Tooltip,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputBase,
  IconButton,
  TablePagination,
  TextField,
  Divider,
  InputAdornment,
  Fade,
  Chip,
  Accordion, AccordionSummary, AccordionDetails,
  List, ListItem, ListItemText,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  Stack
} from '@mui/material';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'



const textLeft = {fontSize:'11.5px',borderRadius:'0%', height:'22px', minWidth:'120px',justifyContent:'flex-start'}
const textRight = {fontSize:'11.5px',borderRadius:'0%', height:'22px', minWidth:'120px',justifyContent:'flex-end'}

export default function Patch({DATA,RETURN}) {

    const i = DATA

    const onReturn =(i,e,u)=>{

      if(u != 'view'){
        RETURN({
                data: i,
                what: e,
              })
      }

    }

    if(i.what == 'date'){

      return  <TableCell onClick={()=> onReturn(i.data,i.what,i.for) }>
                {
                  i?.dateStatus == 'WRONG'
                  ?
                  <p style={{color:"red"}}>Wrong date</p>
                  :
                  <>
                  <p style={{fontSize:'11.5px',color:'gray',marginBottom:'-15px'}}>{i?.dateOpen} until</p> 
                  <p style={{fontSize:'11.5px'}}>{i?.dateClose}</p>
                  </>
                }

                {
                  i?.dateStatus == 'FUTURE' && <p style={{color:"red",marginTop:'-15px'}}>Future date?</p>
                }
              </TableCell>
              
    } else if(i.what == 'club'){

      return  <TableCell onClick={()=> onReturn(i.data,i.what,i.for) }>
                {
                  !Fnc.isNull(i.clubID)
                  ?
                  <>
                  <p style={{fontSize:'11.5px',color:'gray',marginBottom:'-15px'}}>{i?.appName} </p> 
                  <p style={{fontSize:'11.5px',marginBottom:'-15px'}}>{i?.clubName}</p>
                  <p style={{fontSize:'11.5px',color:'gray'}}>ID: {i?.clubID} </p>
                  </>
                  :
                    !Fnc.isNull(i.sub)
                    ?
                    <>
                    <p style={{fontSize:'11.5px',marginBottom:'-15px',color:"red",fontWeight:'700'}}>{i?.sub}</p>
                    <p style={{fontSize:'11.5px',color:'gray'}}>Club not found </p>
                    </>
                    :
                    <span style={{color:"red"}}>No club</span>
                }
 
                
              </TableCell>

    } else if( ['player','upline','agency','downline'].includes(i.what) ){

      const isNegative = i.rake < 0 ? true : false

      return  <TableCell onClick={()=> onReturn(i.data,i.what,i.for) }>
                {
                  i.id != 0 && i.id != null
                  ?
                  <>
                  <p style={{fontSize:'11.5px',marginBottom:'-15px'}}>ID: {i.id}</p>

                  <p style={{fontSize:'11.5px',marginBottom:'-13px',color: !Fnc.isNull(i.name) && i.sub =='' ? 'gray' : i.sub =='WRONG' ? 'red' : 'orange'}}>
                    {i.name && i.sub =='' ? i.name : i.sub =='WRONG' ? 'Wrong application!':  i.sub =='NEW' ? 'New account?': 'No user'} 
                  </p>

                  { !Fnc.isNull(i.chip,0) && <p style={{fontSize:'11.5px',marginBottom:'-15px',color:'gray'}}>{i.chip} {i.what == 'player' ? 'Chip rate' : 'Chip cut'}</p> }
                  <p style={{fontSize:'11.5px',color: i.rake && !isNegative ? 'gray' : isNegative ? 'red' : 'orange'}}>
                    {i.rake ? i.rake + '% Rakeback' : 'No rakeback'} 
                  </p>
                  </>
                  :
                    i.for == 'view'
                    ?
                    <span style={{color:"orange"}}>No {i.what}</span>
                    :
                    <span style={{color:"red"}}>No {i.what}</span>
                  }
              </TableCell>

    } else if(i.what == 'deal'){

      return  <TableCell onClick={()=> onReturn(i.data,i.what,i.for) }>
                    <Chip variant='outlined' 
                          color={i.rakeback != 0 ? "info" : "error"} 
                          style={{fontSize:'13px',borderRadius:'0%',height:'30px', fontWeight: '900', width:'100px'}}
                          label={String(i.rakeback ? i.rakeback  : 0) + ' / '+ String(i.rebate ? i.rebate  : 0)}  />
                  {
                    !Fnc.isNull(i.chip,0) && <><br/><span style={{fontSize:'11.5px',color:"gray"}}>Chip rate: {i.chip}</span></>
                  }
              </TableCell>

    } else if(i.what == 'fx' || i.what == 'rate'){

      return  <TableCell onClick={()=> onReturn(i.data,i.what,i.for) }>

                   <Tooltip title={i.provider}>
                      <p style={{fontSize:'11.5px',marginBottom:'-5px'}}>
                          {
                                  i.currency == 'USD'
                                  ?
                                  <>{i?.usd} USD</>
                                  :
                                  <>{i?.usd} USD <br/><span style={{color:"gray",fontSize:'10px'}}>per {i.currency}</span></>
                          }
                      </p>
                  </Tooltip>
                  <span style={{color:"gray",fontSize:'10px'}}> {i.date ? i.date : null}</span>
              </TableCell>

    } else if( ['points','bonus'].includes(i.what) ){

      const x           = i.data

      const mBorder     = ['points','bonus'].includes(i.what) ? {border:'0px'} : ''
      
      const mNegatives  = i.currency != 'USD' && i.positive != 0 ? {marginTop:'-15px'} : ''

      const arrayTotals = i?.games?.map((g,index)=>{
        const arrValue = x[i.what+'_'+(g.gameAcro)]
        return {
                  title: g.gameName,
                  acro:  g.gameAcro,
                  value: arrValue
                }
      })

      return (
        <TableCell onClick={()=>onReturn(i.data,i.what,i.for) } align='right' sx={{verticalAlign: 'top','&:hover': {backgroundImage: 'linear-gradient(to bottom, rgba(148,0,211,.2), rgba(0,0,0,0))'}}}>

            {Fnc.JSONS(arrayTotals,false)}
            <Accordion sx={{backgroundColor:'transparent'}} >
            <AccordionSummary   style={{ display: 'inline-block' }}
              //expandIcon={<Icon icon={"oui:arrow-up"} style={{marginLeft:'13px'}}/>}
              >
              <div> 
                    <Tooltip title={i.formula} >
                        <Chip variant='outlined' 
                              color={"default"} 
                              style={{...textRight,...mBorder,}}
                              label={<> {Fnc.intoUSD(i.value,i.usd)} &nbsp; USD</>}  />

                    </Tooltip>


                  {
                    i.currency != 'USD' && <Chip variant='outlined' 
                                                  color={"default"} 
                                                  sx={{...textRight, ...mBorder,color:'darkgray', marginTop:'-10px'}}
                                                  label={<>{i.value} &nbsp; {i.currency}</>}  />
                  }

                  <div style={{marginTop:'-5px'}}>
                  {
                    i.positive != 0 && i.what == 'points' && <Chip variant='outlined' 
                                                color={"default"} 
                                                sx={{...textRight, color:'gray',border:'0px'}}
                                                label={<>{i.positive} &nbsp; Win</>}  />
                  }
                  {
                    i.negative != 0 && i.what == 'points' && <Chip variant='outlined' 
                                                color={"default"} 
                                                sx={{...textRight, ...mNegatives, color:'gray',border:'0px'}}
                                                label={<>{i.negative} &nbsp; Loss</>}  />
                  }
                  </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
                <List sx={{ width: '100%',}}>
                  {
                    (arrayTotals ? arrayTotals : []).map((x,index)=>{
                      if(!Fnc.isNull(x.value,0)){
                        return <ListItem  key={index} 
                                          sx={{p: -5, border: '1px dashed grey', height: '50px'}}>
                                  <ListItemText >
                                    <span style={{fontSize:'11.5px', color:'lightgray'}}>
                                      {x.value} USD
                                    </span>
                                    <div style={{marginTop:'-8px'}}>
                                      <span style={{fontSize:'11.5px', color:'gray',}}>
                                      {x.title}
                                      </span>
                                    </div>
                                  </ListItemText>
                              </ListItem>
                      }
                    })
                  }
                  </List>
            </AccordionDetails>
          </Accordion>

        </TableCell>
      );


    } else if( ['bonuspercent','result'].includes(i.what) ){

      const mBorder = ['bonuspercent','result'].includes(i.what) ? {border:'0px'} : ''
      
      const mNegatives  = i.currency != 'USD' && i.positive != 0 ? {marginTop:'-15px'} : ''

      return  <TableCell onClick={()=>onReturn(i.data,i.what,i.for) } align='right' >

                   <Tooltip title={i.formula}>
                      <Chip variant='outlined' 
                            color={"default"} 
                            style={{...textRight,...mBorder,}}
                            label={<> {Fnc.intoUSD(i.value,i.usd)} &nbsp; USD</>}  />
                    </Tooltip>


                  {
                    i.currency != 'USD' && <Chip variant='outlined' 
                                                  color={"default"} 
                                                  sx={{...textRight, ...mBorder,color:'gray', marginTop:'-5px'}}
                                                  label={<>{i.value} &nbsp; {i.currency}</>}  />
                  }

                  {
                    i.positive != 0 && i.what == 'points' && <Chip variant='outlined' 
                                                color={"default"} 
                                                sx={{...textRight, color:'gray',border:'0px'}}
                                                label={<>{i.positive} &nbsp; Win</>}  />
                  }
                  {
                    i.negative != 0 && i.what == 'points' && <Chip variant='outlined' 
                                                color={"default"} 
                                                sx={{...textRight, ...mNegatives, color:'gray',border:'0px'}}
                                                label={<>{i.negative} &nbsp; Loss</>}  />
                  }


              </TableCell>

    } else if( ['agencyaction','agencybonus','playerresult'].includes(i.what) ){

      return  <TableCell onClick={()=>onReturn(i.data,i.what,i.for) } align='right'>

                   <Tooltip title={i.operation}>
                      <Chip variant='outlined' 
                            color={i.value == '0.00' ? 'default' : "warning"} 
                            style={{...textRight,color: i.value == '0.00' ? 'gray' : 'gold'}}
                            label={<>{i.value} &nbsp; USD</>}  />
                    </Tooltip>
                  {
                    i.currency != 'USD'&& <Chip variant='outlined' 
                                                color={"default"} 
                                                style={{...textRight,color:'gray'}}
                                                label={<>{Fnc.intoBASE(i.value,i.usd)} &nbsp; {i.currency}</>}  />
                  }
                  <Tooltip title={i.formula}>
                    <span style={{color:"gray",fontSize:'10px'}}> {i.formulaName ? i.formulaName : 'STANDARD'}</span>
                  </Tooltip>
              </TableCell>

    } else if( i.what == 'remarks' ){

      return  <TableCell onClick={()=>onReturn(i.data,i.what,i.for) }>

                   <span style={{fontSize:'11.5px'}}> {i.value}</span>
                    
              </TableCell>

    }
}

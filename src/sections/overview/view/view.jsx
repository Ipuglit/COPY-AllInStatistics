import { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';

import {
        Container,
        Grid,
        Typography,
        Button,
        CardHeader,
        Box,
        Paper,
        LinearProgress,
        Tooltip,
        FormControl, InputLabel, Select, MenuItem,

      } from '@mui/material/';

import * as math from 'mathjs';

import * as Vv from './values'

import Iconify from 'src/components/iconify';

import {CardToppers} from '../cards/card-toppers'

import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
import ChartPie from '../charts/chart-pie';


import { RawFetch } from 'src/hooks/raw/';

import {
        Charts_Records,
        Charts_Apps,
        Charts_Clubs,
        Charts_Users,
        Charts_Accounts,
        Charts_Pieces,
        Charts_MiniPie,
        Charts_RadialBars,
        Charts_Points,
        Swiper_Info,
        ChartsList_Games,
        ChartsList_Accounts,
        Carousel_News,
        Announcements,
        LinePercent
      } from './index'

import {DialogFilter, DialogAnnouncement} from './index';

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

// ----------------------------------------------------------------------

export default function AppView() {

  const [rawRELOAD, setrawRELOAD]       = useState(1)

  const rawDEFAULTS = {
                          FOR:            "ALL",
                          SEARCH:         "ALL",
                          STATUS:         'ALL',
                          APP:            'ALL',
                          CLUB:           'ALL',
                          ACCOUNT:        'ALL',
                          USER:           'ALL',
                          ROLE:           'ALL',
                          DATETYPE:       'WEEK',
                          DATECOUNT:      'ALL',
                          DATEFROM:       'ALL',
                          DATEUNTIL:      'ALL',
                          IFZERO:         'ALL',
                      }

                      
  const [rawFETCHES,  setrawFETCHES]          = useState(rawDEFAULTS);
  const [rawFETCHER,  setrawFETCHER]          = useState(rawDEFAULTS);

  const [openFILTER,  setopenFILTER]          = useState({modal: false, title: ''})
  const [openANNOUNCE,  setopenANNOUNCE]      = useState({modal: false, title: ''})

  const [dateFilter,  setdateFilter]          = useState('weeks')

  const [getAnnounce,  setgetAnnounce]        = useState({open: true, data: []})

  const defaultAPPS         = RawFetch(rawFETCHER,rawRELOAD,'applications')
  const defaultCLUBS        = RawFetch(rawFETCHER,rawRELOAD,'clubs')
  const defaultACCOUNTS     = RawFetch(rawFETCHER,rawRELOAD,'accounts')
  const defaultUSERS        = RawFetch(rawFETCHER,rawRELOAD,'userz')
  const defaultGAMES        = RawFetch(rawFETCHER,rawRELOAD,'games')

  const fetchRECORDS        = RawFetch(rawFETCHES,rawRELOAD,'recordslist')

  const [gainWHAT, setgainWHAT]     = useState('total_agencybonus')
  const [gainAPP, setgainAPP]       = useState([])
  const [gainCLUB, setgainCLUB]     = useState([])
  const [gainACC, setgainACC]       = useState([])

  const gainHIGHEST = (arr,key) => {

    const ndX = arr?.[key]?.reduce((mx, currentValue, index, array) => {
      return currentValue > array[mx] ? index : mx;
    }, 0);

    const toT = arr?.[key]?.reduce((s, v) => s + v, 0)

    const PN = arr?.[key]?.reduce((A, value) => {
          if (value > 0) {
            A.poS += value;
          } else {
            A.neG += value; 
          }
          return A;
    }, { poS: 0, neG: 0 });

    const suM = arr?.[key]?.[ndX] < 0 ? PN?.neG : PN?.poS

    const perC = eval( ( arr?.[key]?.[ndX] / suM) * 100 ).toFixed(1)

    return {  
            name: arr?.name?.[ndX], 
            value: arr?.[key]?.[ndX], 
            total: toT < 0 ? PN?.neG : PN?.poS, 
            exact: toT,
            positives: PN?.poS,
            negatives: PN?.neG,
            percent: parseFloat(perC) 
          };
  };
  
  const closeFilter =(i)=>{
    setopenFILTER({modal: false, title: ''})
  }

  const returnedFILTER=(i)=>{
    setopenFILTER({modal: false, title: ''})

    const onFetch = {
                      APP:        i.values.APPS,
                      CLUB:       i.values.CLUBS,
                      USER:       i.values.USERS,
                      ACCOUNT:    i.values.ACCTS,
                      DATEFROM:   i.values.DATEFROM,
                      DATEUNTIL:  i.values.DATEUNTIL,
                    }

    setrawFETCHES({...rawFETCHES, ...onFetch})
    setrawRELOAD(Fnc.numRandom())

  }

  const returnedANNOUNCE=(i)=>{
    setopenANNOUNCE({modal: false, title: ''})
  }

  const returnedByDate=(i)=>{
    const thisDate = i == 'weeks' ? 'WEEK' : i == 'days' ? 'DAY' : i == 'years' ? 'YEAR' : 'ALL'
    setdateFilter(i)
    setrawFETCHES({
                          ...rawFETCHES,
                          DATETYPE: thisDate,
                        })
    setrawRELOAD(Fnc.numRandom())
  }

const pileRECORDS    = Vv.chartsRECORDS(fetchRECORDS?.data)


 const sumArrayValue =(arr,val)=>{

  const summed = arr?.reduce((accumulator, e) => {
   // if(val == 'total_agencyaction'){
     // return accumulator + parseFloat(e[val] > 0 ? e[val] : 0);
    //} else {
      return accumulator + parseFloat(e[val]);
    //}
  }, 0);

  return summed.toFixed(2)

 }
  
 const toArrayValues =(arr,val)=>{
    return (arr).map(i => {
        return {
          label: '',
          value: Fnc.numExceeds(Fnc.NumForce(i[val]))
        }
    }).filter(i => i.value != 0);
 }

 const fitArrayValues =(arr,val)=>{
    const E = arr.length > 0 ? arr : ['']
    const X = arr.map((e)=>{ return e[val] })
    const A = X.map(str => String(str).split(',').map(Number));
    const Z = A.reduce((acc, curr) => { curr.forEach(num => acc.push(num)); return acc; }, []);
    return {values: Array.from(new Set(Z)), count: Array.from(new Set(Z)).length};

}

const totalPath_Apps  = fetchRECORDS.data[0]?.countApps_total ? fetchRECORDS.data[0]?.countApps_total : 0
const totalPath_Clubs = fetchRECORDS.data[0]?.countClubs_total ? fetchRECORDS.data[0]?.countClubs_total : 0
const totalPath_Users = fetchRECORDS.data[0]?.countUsers_total ? fetchRECORDS.data[0]?.countUsers_total : 0
const totalPath_Accts = fetchRECORDS.data[0]?.countAccounts_total ? fetchRECORDS.data[0]?.countAccounts_total : 0

const getDate =(arr,val,what)=>{
  if(arr.length == 0){
    return ''
  } else {
    const A = arr.map(i => new Date(i[val]));
    const B = new Date(what == 'min' ? Math.min(...A) : Math.max(...A));
    const C = B.toISOString().split('T')[0];
    return C
  }

}

const percentApps = (val,wol) =>{
  const wholes = Fnc.isNull(wol) ? 0 : parseFloat(wol)
  const fracts = Fnc.isNull(val) ? 0 : parseFloat(val)
  const summed = eval((fracts/wholes)*100)
  return Fnc.NumForce(summed).toFixed(0)
}

const [loading, setLoading] = useState(true)

useEffect(()=>{

    setLoading(true)

    const T = setTimeout(() => {
      setLoading(false)
    }, 500);

  return () => clearTimeout(T);

},[])

  return (
    <Container maxWidth="xl">

      <Grid container spacing={3} sx={{marginTop:'2px', display: loading ? 'none' : ''}}>

        <Grid item xs={6} sm={3} md={3}>
          <Charts_Pieces
              title={'$'+sumArrayValue(fetchRECORDS?.data,'total_agencyaction')}
              subheader="Agency Actions"
              chart={{ series: toArrayValues(fetchRECORDS?.data,'total_agencyaction') }}
              vertical={true}
              horizontal={false}
            />
        </Grid>

        <Grid item xs={6} sm={3} md={3}>
          <Charts_Pieces
              title={'$'+sumArrayValue(fetchRECORDS?.data,'total_agencybonus')}
              subheader="Agency Bonuses"
              color=''
              chart={{ series: toArrayValues(fetchRECORDS?.data,'total_agencybonus') }}
              vertical={true}
              horizontal={false}
            />
        </Grid>

        <Grid item xs={6} sm={3} md={3}>
            <Charts_Pieces
              title={'$'+sumArrayValue(fetchRECORDS.data,'total_playerresult')}
              subheader="Player Results"
              color=''
              chart={{ series: toArrayValues(fetchRECORDS.data,'total_playerresult') }}
              vertical={true}
              horizontal={false}
            />
        </Grid>

      <Grid item xs={12} md={3} lg={3} sx={{}} >
          <span style={{fontSize:'14px'}}>Top Performers</span>
          <div style={{display: 'flex',justifyContent: 'flex-end', marginTop:'-24px'}}>
          <Select value={gainWHAT}
                    onChange={(e)=>setgainWHAT(e.target.value)}
                    size='small'
                    sx={{ '& .MuiOutlinedInput-notchedOutline': {  border: 'none',  }, 
                          '& .MuiSelect-select': { border: 'none',  fontSize: '11px', height: '15px', marginTop:'-8px', minWidth:'80px', textAlign: 'right'  }, 
                          '& .MuiInputLabel-root': { fontSize: '11px',  }, }} >
                <MenuItem sx={{fontSize:'11px', height: '22px'}} value="total_bonus_usd">Bonuses</MenuItem>
                <MenuItem sx={{fontSize:'11px', height: '22px'}} value="total_points_usd">Points</MenuItem>
                <MenuItem sx={{fontSize:'11px', height: '22px'}} value="total_win_usd">Winnings</MenuItem>
                <MenuItem sx={{fontSize:'11px', height: '22px'}} value="total_loss_usd">Losses</MenuItem>
                <MenuItem sx={{fontSize:'11px', height: '22px'}} value="total_agencyaction">Agency Actions</MenuItem>
                <MenuItem sx={{fontSize:'11px', height: '22px'}} value="total_agencybonus">Agency Bonuses</MenuItem>
                <MenuItem sx={{fontSize:'11px', height: '22px'}} value="total_playerresult">Player Results</MenuItem>
            </Select>
          </div>


          <Box sx={{ p: 1.2, border: '0px dashed grey', width:'100%' }}>

            <LinePercent onData={{
                                  title:'Application', 
                                  name: gainHIGHEST(gainAPP,gainWHAT).name, 
                                  value: gainHIGHEST(gainAPP,gainWHAT).value+' USD',  
                                  percent:gainHIGHEST(gainAPP,gainWHAT).percent
                                  }} />

            <LinePercent onData={{
                                  title:'Club', 
                                  name: gainHIGHEST(gainCLUB,gainWHAT).name, 
                                  value: gainHIGHEST(gainCLUB,gainWHAT).value+' USD', 
                                  percent:gainHIGHEST(gainCLUB,gainWHAT).percent
                                  }} />

            <LinePercent onData={{
                                  title:'Account', 
                                  name: 'ID: '+gainHIGHEST(gainACC,gainWHAT).name, 
                                  value: gainHIGHEST(gainACC,gainWHAT).value+' USD', 
                                  percent:gainHIGHEST(gainACC,gainWHAT).percent
                                  }} />

          </Box>
                                  {Fnc.JSONS(gainHIGHEST(gainACC,gainWHAT),false)}
                                  {Fnc.JSONS(gainAPP,false)}
        </Grid>

        <Grid item xs={12} md={3} lg={4} sx={{}} hidden>
          <Box sx={{ p: 2, border: '0px dashed grey' }}>
            <Carousel_News />
          </Box>
        </Grid>


        <Grid item xs={12} md={12} lg={9}>
          <Charts_Records
            onTitle="Agency Results"
            dataReceived={{load: fetchRECORDS?.load, tally: fetchRECORDS?.tally}}
            filter={setopenFILTER}
            filterHidden={false}
            iHeight='290'
            bydate={(i)=>returnedByDate(i)}
            what=''
            subheader={
                        getDate(fetchRECORDS.data,'recorded_first','min') == '' || getDate(fetchRECORDS.data,'recorded_last','max') == ''
                        ?
                        ''
                        : getDate(fetchRECORDS.data,'recorded_first','min') == getDate(fetchRECORDS.data,'recorded_last','max')
                        ?
                        Fnc.dateText(getDate(fetchRECORDS.data,'recorded_first','min'))
                        :
                        Fnc.dateText(getDate(fetchRECORDS.data,'recorded_first','min'))+' to '+Fnc.dateText(getDate(fetchRECORDS.data,'recorded_last','max'))
                      }
            chart={{
              labels: pileRECORDS?.dateOrder,
              series: [
                {
                  name: 'Agency Action',
                  type: 'area',
                  fill: 'gradient',
                  data: pileRECORDS?.total_agencyaction,
                },
                {
                  name: 'Agency Bonus',
                  type: 'area',
                  fill: 'gradient',
                  data: pileRECORDS?.total_agencybonus,
                },

              ],
            }}
          />

        </Grid>

        <Grid item xs={12} md={12} lg={3} >
          <CardToppers />sa
          {
            false && 
            <Swiper_Info onReturned={(e)=>setgetAnnounce({open: true,data: e})} />
          }

        </Grid>

        <Grid item xs={12} md={12} lg={12}>
          <Charts_Records
            onTitle="Player Results"
            dataReceived={{load: fetchRECORDS?.load, tally: fetchRECORDS?.tally}}
            filter={setopenFILTER}
            filterHidden={true}
            iHeight='200'
            bydate={(i)=>returnedByDate(i)}
            what=''
            subheader={
                        getDate(fetchRECORDS.data,'recorded_first','min') == '' || getDate(fetchRECORDS.data,'recorded_last','max') == ''
                        ?
                        ''
                        : getDate(fetchRECORDS.data,'recorded_first','min') == getDate(fetchRECORDS.data,'recorded_last','max')
                        ?
                        Fnc.dateText(getDate(fetchRECORDS.data,'recorded_first','min'))
                        :
                        Fnc.dateText(getDate(fetchRECORDS.data,'recorded_first','min'))+' to '+Fnc.dateText(getDate(fetchRECORDS.data,'recorded_last','max'))
                      }
            chart={{
              labels: pileRECORDS?.dateOrder,
              series: [
                {
                  name: 'Player Result',
                  type: 'area',
                  fill: 'gradient',
                  data: pileRECORDS?.total_playerresult,
                },

              ],
            }}
          />

        </Grid>

        <Grid item xs={12} md={6} lg={4} >

          <Paper elevation={1}>
          <Typography variant="h5" gutterBottom style={{padding: '20px', marginBottom:'-10px'}}>
            Cumulative Uses 
          </Typography>

            <Box sx={{ p: 1, gap: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 2fr)', }} >

                <Paper variant="outlined" sx={{ py: 3.5, textAlign: 'center', borderStyle: 'none', backgroundColor:'transparent' }} >
                  <Charts_RadialBars subValue={percentApps(fitArrayValues(fetchRECORDS.data,'list_appIDs').count,totalPath_Apps)} subTitle='Applications' subHeight='150' subColor='#BA55D3' style={{marginBottom:'-20px'}} />
                </Paper>

                <Paper variant="outlined" sx={{ py: 3.5, textAlign: 'center', borderStyle: 'none', backgroundColor:'transparent' }} >
                  <Charts_RadialBars subValue={percentApps(fitArrayValues(fetchRECORDS.data,'list_clubIDs').count,totalPath_Clubs)} subTitle='Clubs' subHeight='150' subColor='#9370DB' style={{marginBottom:'-20px'}} />
                </Paper>

                <Paper variant="outlined" sx={{ py: 3.5, textAlign: 'center', borderStyle: 'none', backgroundColor:'transparent' }} >
                  <Charts_RadialBars subValue={percentApps(fitArrayValues(fetchRECORDS.data,'list_userIDs').count,totalPath_Users)} subTitle='Users' subHeight='150' subColor='#8A2BE2' style={{marginBottom:'-20px'}} />
                </Paper>

                <Paper variant="outlined" sx={{ py: 3.5, textAlign: 'center', borderStyle: 'none', backgroundColor:'transparent' }} >
                  <Charts_RadialBars subValue={percentApps(fitArrayValues(fetchRECORDS.data,'list_playerIDs').count,totalPath_Accts)} subTitle='Accounts' subHeight='150' subColor='' style={{marginBottom:'-20px'}} />
                </Paper>

            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={12} lg={5}>
        <Charts_Points
          onData={{data: pileRECORDS, load: fetchRECORDS.load, filteredDate: dateFilter}}
          onTitle={'Win-Loss Summary'}
          onFiltered={rawFETCHES}
          subheader=""
          barWidth='50'
          sublabel='USD' />
      </Grid>

      <Grid item xs={12} md={6} lg={3.5}>
        <ChartsList_Games onData={{data: pileRECORDS, load: fetchRECORDS.load, filteredDate: dateFilter}}
                          onTitle={'Games Point Ratio'} 
                          onWhat='points' 
                          onItems={defaultGAMES.data}/>
      </Grid>

      <Grid item xs={12} md={6} lg={3.5}>
        <ChartsList_Games onData={{data: pileRECORDS, load: fetchRECORDS.load, filteredDate: dateFilter}} 
                          onTitle={'Games Bonus Ratio'} 
                          onWhat='bonus' 
                          onItems={defaultGAMES.data}/>
      </Grid>

      <Grid item xs={12} md={12} lg={6}>
        <Charts_Apps 
          onTitle="Applications Performance"
          sendData={setgainAPP}
          onFiltered={rawFETCHES}
          subheader=""
          barWidth='50'
          sublabel='USD' />
      </Grid>

      <Grid item xs={12} md={12} lg={6}>
        <Charts_Clubs 
          onTitle="Clubs Performance"
          sendData={setgainCLUB}
          onFiltered={rawFETCHES}
          subheader=""
          barWidth='50'
          sublabel='USD' />
      </Grid>

      <Grid item xs={12} md={12} lg={6}>
        <Charts_Users 
          onTitle="Users Performance"
          onFiltered={rawFETCHES}
          subheader=""
          barWidth='50'
          sublabel='USD' />
      </Grid>

      <Grid item xs={12} md={12} lg={6} hidden>
        <Charts_Accounts 
          onTitle="Accounts Performance"
          //sendData={setgainACC}
          onFiltered={rawFETCHES}
          subheader=""
          barWidth='50'
          sublabel='USD' />
      </Grid>



      
      <Grid item xs={12} md={12} lg={6} >
        <ChartsList_Accounts onData={{data: pileRECORDS, load: fetchRECORDS.load, filteredDate: dateFilter}}
                          sendData={setgainACC}
                          onFiltered={rawFETCHES}
                          onTitle={'Players Result Ratio'} 
                          onWhat='points' 
                          onItems={defaultGAMES.data}/>
      </Grid>



        <Grid item xs={12} md={6} lg={8} hidden>
          <AppNewsUpdate
            title="News Update"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: faker.person.jobTitle(),
              description: faker.commerce.productDescription(),
              image: `/assets/images/covers/cover_${index + 1}.jpg`,
              postedAt: faker.date.recent(),
            }))}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4} hidden>
        <AppOrderTimeline
          title="Order Timeline"
          list={[...Array(5)].map((_, index) => ({
            id: faker.string.uuid(),
            title: [
              '1983, orders, $4220',
              '12 Invoices have been paid',
              'Order #37745 from September',
              'New order placed #XF-2356',
              'New order placed #XF-2346',
            ][index],
            type: `order${index + 1}`,
            time: faker.date.past(),
          }))}
        />
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
          {
           Fnc.JSONS(fetchRECORDS?.data,false)
          }
        </Grid>      

      </Grid>

      <DialogFilter DATA={openFILTER} ITEMS={{ APPS: defaultAPPS, CLUBS: defaultCLUBS, USERS: defaultUSERS, ACCOUNTS: defaultACCOUNTS, }} RETURN={returnedFILTER} DIALOG={closeFilter} />

      <DialogAnnouncement DATA={openANNOUNCE} ITEMS={{ APPS: defaultAPPS, CLUBS: defaultCLUBS, USERS: defaultUSERS, ACCOUNTS: defaultACCOUNTS, }} RETURN={returnedANNOUNCE}  />


    </Container>
  );
}

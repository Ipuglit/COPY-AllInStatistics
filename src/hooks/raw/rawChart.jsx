import axios from 'axios';
import { useState, useLayoutEffect } from 'react';

import * as Imp from '../importants'
import * as Fnc from '../functions'

export default function RawFetch(i,ii,iii) {

  const Token = JSON.parse( localStorage.getItem('slk-token') );

  const [load, setLoad]       = useState(false)
  const [data, setData]       = useState([])
  const [tally, setTally]     = useState(0)

    const Auth = {
                        A:              Token.id,
                        B:              Token.token,
                        C:              Token.gadget,
                        D:              Imp.TimeZoned,
                        FOR:            i?.FOR       ? i.FOR     : "ALL",
                        STATUS:         i?.STATUS    ? i.STATUS  : 'ACTIVE',
                        APP:            i?.APP       ? i.APP     : 'ALL',
                        CLUB:           i?.CLUB      ? i.CLUB    : 'ALL',
                        ACCOUNT:        i?.ACCOUNT   ? i.ACCOUNT : 'ALL',
                        DATEFROM:       i?.DATEFROM  ? i.DATEFROM   : 'ALL',
                        DATEUNTIL:      i?.DATEUNTIL ? i.DATEUNTIL  : 'ALL',
                }; 
            
    async function fetching() {

        setLoad(false)
        setData([]);
        setTally(0)

        try {
        
            const response = await axios.post(Imp.Fetch[iii ? iii : ''], Auth);

            if(response.data.Values == "NOTFOUND" || response.data.Values == "ZERO" || response.data.Values == "ERR"  ){
                Fnc.NotFound()
                setData([]);
                setTally(0)
                setLoad(true)
            } else {
                var arrValue = response.data.Values
                setData(arrValue);
                setTally(response.data.Count)
                setLoad(true)
            }
            //console.log(response.data)
        } catch (error) {
                Fnc.NotFound()
                setData([]);
                setTally(0)
                setLoad(true)
                //console.error(response.data)
        }
    }

  useLayoutEffect(() => {
      fetching();
    }, [i,ii,iii]);

  return ({load, data, tally})
}
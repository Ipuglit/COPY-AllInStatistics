import axios from 'axios';
import { useState, useLayoutEffect } from 'react';

import * as Imp from '../importants'
import * as Fnc from '../functions'

export default function RawFetch(i,ii,iii) {

  const Token = JSON.parse( localStorage.getItem('slk-token') );

  const [load, setLoad]       = useState(false)
  const [data, setData]       = useState([])
  const [tally, setTally]     = useState(0)
  const [roled, setRoled]     = useState(0)

    const Auth = {
                        A:              Token.id,
                        B:              Token.token,
                        C:              Token.gadget,
                        D:              Imp.TimeZoned,
                        FOR:            i?.FOR       ? i.FOR        : "ALL",
                        STATUS:         i?.STATUS    ? i.STATUS     : 'ACTIVE',
                        SEARCH:         i?.SEARCH    ? i.SEARCH     : 'ALL',
                        SORTBY:         i?.SORTBY    ? i.SORTBY     : 'ALL',
                        SORT:           i?.SORT      ? i.SORT       : 'DESC',
                        LIMIT:          i?.LIMIT     ? i.LIMIT      : 'ALL',
                        APP:            i?.APP       ? i.APP        : 'ALL',
                        CLUB:           i?.CLUB      ? i.CLUB       : 'ALL',
                        PLAYER:         i?.PLAYER    ? i.PLAYER     : 'ALL',
                        UPLINE:         i?.UPLINE    ? i.UPLINE     : 'ALL',
                        AGENCY:         i?.AGENCY    ? i.AGENCY     : 'ALL',
                        DOWNLINE:       i?.DOWNLINE  ? i.DOWNLINE   : 'ALL',
                        ACCOUNT:        i?.ACCOUNT   ? i.ACCOUNT    : 'ALL',
                        USER:           i?.USER      ? i.USER       : 'ALL',
                        UNIONS:         i?.UNIONS    ? i.UNIONS     : 'ALL',
                        UNIONTYPE:      i?.UNIONTYPE ? i.UNIONTYPE  : 'ALL',
                        ROLE:           i?.ROLE      ? i.ROLE       : 'ALL',
                        DATETYPE:       i?.DATETYPE  ? i.DATETYPE   : 'ALL',
                        DATECOUNT:      i?.DATECOUNT ? i.DATECOUNT  : 'ALL',
                        DATEFROM:       i?.DATEFROM  ? i.DATEFROM   : 'ALL',
                        DATEUNTIL:      i?.DATEUNTIL ? i.DATEUNTIL  : 'ALL',
                        IFZERO:         i?.IFZERO    ? i.IFZERO     : 'ALL',
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
            setRoled(response.data.Role)
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

  return ({load, data, tally, role: roled})
}
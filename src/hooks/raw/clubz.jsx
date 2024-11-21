import axios from 'axios';
import { useState, useLayoutEffect } from 'react';

import * as Imp from '../importants'
import * as Fnc from '../functions'

export default function RawClubz(i,ii,iii) {

  const Token = JSON.parse( localStorage.getItem('slk-token') );

  const [load, setLoad]       = useState(false)
  const [data, setData]       = useState([])
  const [tally, setTally]     = useState(0)

    const Auth = {
                        A:              Token.id,
                        B:              Token.token,
                        C:              Token.gadget,
                        D:              Imp.TimeZoned,
                        FOR:            i.FOR       ? i.FOR     : "ALL",
                        STATUS:         i.STATUS    ? i.STATUS  : 'ACTIVE',
                        SORTBY:         i.SORTBY    ? i.SORTBY  : 'ALL',
                        SORT:           i.SORT      ? i.SORT    : 'DESC',
                        LIMIT:          i.LIMIT     ? i.LIMIT   : 1000,
                        SEARCH:         i.SEARCH    ? i.SEARCH  : 'ALL',
                        APP:            i.APP       ? i.APP     : 'ALL',
                        CLUB:           i.CLUB      ? i.CLUB    : 'ALL',
                        PLAYER:         i.PLAYER    ? i.PLAYER  : 'ALL',
                        UPLINE:         i.UPLINE    ? i.UPLINE  : 'ALL',
                }; 

    async function fetching() {

        setLoad(false)
        setData([]);
        setTally(0)

        try {
        
            const response = await axios.post(Imp.Fetch['clubz'], Auth);

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
        }
    }

  useLayoutEffect(() => {
      fetching();
    }, [i,ii]);

  return ({load, data, tally, what: 'CLUBS'})
}
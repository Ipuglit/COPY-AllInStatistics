import axios from 'axios';
import { useState, useLayoutEffect } from 'react';

import * as Imp from '../importants'
import * as Fnc from '../functions'

export default function RawUsers(i,ii) {

  const Token = JSON.parse( localStorage.getItem('slk-token') );

  const [load, setLoad]       = useState(false)
  const [data, setData]       = useState([])
  const [tally, setTally]     = useState(0)

    const Auth = {
                        A:              Token.id,
                        B:              Token.token,
                        C:              Token.gadget,
                        D:              Imp.TimeZoned,
                        FOR:            i    ? i.FOR     : "ALL",
                        STATUS:         i    ? i.STATUS  : 'ACTIVE',
                        SORTBY:         i    ? i.SORTBY  : 'ALL',
                        SORT:           i    ? i.SORT    : 'DESC',
                        LIMIT:          i    ? i.LIMIT   : 1000,
                        SEARCH:         i    ? i.SEARCH  : 'ALL',
                }; 

    async function fetching() {

        setLoad(false)
        setData([]);
        setTally(0)

        try {
        
            const response = await axios.post(Imp.Fetch['userz'], Auth);

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

  return ({load, data, tally})
}
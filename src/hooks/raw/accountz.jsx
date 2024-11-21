import { useLayoutEffect, useState } from 'react';
import axios from 'axios';
import * as Imp from '../importants'
import * as Fnc from '../functions'

export default function RawAccountz(i,ii) {

    const Token = JSON.parse( localStorage.getItem('slk-token') );

    const [load, setLoad]       = useState(false)
    const [data, setData]       = useState([])
    const [tally, setTally]     = useState(0)
    const [loaded, setLoaded]   = useState(0)
    const Auth = {
                        A:              Token.id,
                        B:              Token.token,
                        C:              Token.gadget,
                        D:              Imp.TimeZoned,
                        FOR:            i.FOR       ? i.FOR     : "ALL",
                        STATUS:         i.STATUS    ? i.STATUS  : 'ACTIVEPENDING',
                        SORTBY:         i.SORTBY    ? i.SORTBY  : 'ALL',
                        SORT:           i.SORT      ? i.SORT    : 'DESC',
                        LIMIT:          i.LIMIT     ? i.LIMIT   : 1000,
                        SEARCH:         i.SEARCH    ? i.SEARCH  : 'ALL',
                        FILTER:         i.FILTER    ? i.FILTER  : 'ALL',
                        APP:            i.APP       ? i.APP     : 'ALL',
                        ROLE:           i.ROLE      ? i.ROLE    : 'ALL',
                }; 

    async function fetching() {
        setLoad(false)
    
        try {

            const response = await axios.post(Imp.Fetch['accounts'], Auth);

            if(response.data.Values == "NOTFOUND" || response.data.Values == "ZERO" || response.data.Values == "ERR"  ){
                Fnc.NotFound()
                setData([]);
                setTally(0)
                setLoad(true)
                setLoaded(0)
            } else {
                var arrValue = response.data.Values
                setData(arrValue);
                setTally(response.data.Count)
                setLoad(true)
                setLoaded(response.data.Loaded)
            }

        } catch (error) {
            Fnc.NotFound()
            setData([]);
            setTally(0)
            setLoad(true)
            setLoaded(0)
        }
    }

    useLayoutEffect(() => {
        fetching();
      }, [i,ii]);
  
    return ({load, data, tally, loaded})
}

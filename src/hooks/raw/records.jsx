import { useLayoutEffect, useState } from 'react';
import axios from 'axios';
import * as Imp from '../importants'
import * as Fnc from '../functions'

export default function RawRecords(i,ii) {
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
                        DATE:           i.DATE      ? i.DATE    : 'ALL',
                        APP:            i.APP       ? i.APP     : 'ALL',
                        CLUB:           i.CLUB      ? i.CLUB    : 'ALL',
                        PLAYER:         i.PLAYER    ? i.PLAYER  : 'ALL',
                        UPLINE:         i.UPLINE    ? i.UPLINE  : 'ALL',
                    }; 
                    
    async function fetching() {
        setLoad(false)
        setTally(0)
        setData([])
        try {

            const response = await axios.post(Imp.Fetch['records'], Auth);

            if(response.data.Values == "NOTFOUND" || response.data.Values == "ZERO"  ){
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
           // console.log("Records items fetched...")
        } catch (error) {
            console.error("Error fetching data ".error);
        }
    }

    useLayoutEffect(() => {
        fetching();
        console.log(Auth)
    }, [ii]);

    return ({load, data, tally})
}

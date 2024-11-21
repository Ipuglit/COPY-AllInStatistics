import { useLayoutEffect, useState } from 'react';
import axios from 'axios';
import * as Imp from '../importants'
import * as Fnc from '../functions'

export const RawAccounts = (aa,bb,cc,dd,ee,ff,gg,hh) => {

    const Token = JSON.parse( localStorage.getItem('slk-token') );

    const [load, setLoad]       = useState(false)
    const [data, setData]       = useState([])
    const [tally, setTally]     = useState(0)
    
    const Auth = {
                A:              Token.id,
                B:              Token.token,
                C:              Token.gadget,
                D:              Imp.TimeZoned,
                FOR:            aa ? aa : "ALL",
                STATUS:         bb ? bb : 'ALL',
                SORTBY:         cc ? cc : 'ALL',
                SORT:           dd ? dd : 'DESC',
                LIMIT:          ee ? ee : 200,
                SEARCH:         ff ? ff : 'ALL',
                ROLE:           gg ? gg : 'ALL', 
                APP:            hh ? hh : 'ALL',
            }; 

    async function fetching() {
        setLoad(false)
        try {
            const response = await axios.post(Imp.Fetch['accounts'], Auth);
            if(response.data.Values == "NOTFOUND" || response.data.Values == "ZERO" ){
                Fnc.NotFound()
                setData([]);
                setTally(0)
                setLoad(true)
            } else {
                setData(response.data.Values);
                setTally(response.data.Count)
                setLoad(true)
            }
        
           // console.log("Accounts items fetched...")
        } catch (error) {
            console.error("Error fetching data");
        }
    }

    useLayoutEffect(() => {
        fetching();
    }, [aa,bb,cc,dd,ee,ff,gg,hh]);

    return ({load, data, tally})
}

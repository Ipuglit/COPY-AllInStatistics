import { useLayoutEffect, useState } from 'react';
import axios from 'axios';
import * as Imp from '../importants'
import * as Fnc from '../functions'

export const RawAccounts = (i,ii,iii,iiii,iiiii,iiiiii) => {

    const Token = JSON.parse( localStorage.getItem('slk-token') );

    const [load, setLoad] = useState(false)
    const [data, setData] = useState([])
    
    const Auth = {
                A:      Token.id,
                B:      Token.token,
                C:      Token.gadget,
                D:      Imp.TimeZoned,
                STATUS:     i ? i : 'ALL',
                ROLE:       ii ? ii : 'EVERYONE', 
                APP:        iii ? iii : 'ALL',
                SORT:       iiii ? iiii : 'DESC',
                SORTBY:     iiiii ? iiiii : 'NONE',
                SEARCH:     iiiiii ? iiiiii : '',
            }; 

    async function fetching() {
        setLoad(false)
        try {
            const response = await axios.post(Imp.Fetch['accounts'], Auth);
            if(response.data == "NOTFOUND"){
                Fnc.NotFound()
            } else {
                setData(response.data);
                setLoad(true)
            }
        
            //console.log("Accounts items fetched..."+JSON.stringify(response.data,null,2))
        } catch (error) {
            console.error("Error fetching data");
        }
    }

    useLayoutEffect(() => {
        fetching();
        }, [i,ii,iii,iiii,iiiii,iiiiii]);

    return ({load, data})
}

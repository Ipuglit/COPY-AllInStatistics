import { useLayoutEffect, useState } from 'react';
import axios from 'axios';
import * as Imp from '../importants'
import * as Fnc from '../functions'

export const RawUplines = (f,i,ii,iii,iiii,iiiii,iiiiii,iiiiiii) => {

    const Token = JSON.parse( localStorage.getItem('slk-token') );

    const [load, setLoad] = useState(false)
    const [data, setData] = useState([])
    
    const Auth = {
                A:      Token.id,
                B:      Token.token,
                C:      Token.gadget,
                D:      Imp.TimeZoned,
                FOR:        f ? f : "ALL",
                STATUS:     i ? i : 'ALL',
                CLUB:       ii ? ii : 'ALL', 
                APP:        iii ? iii : 'ALL',
                SORT:       iiii ? iiii : 'DESC',
                SORTBY:     iiiii ? iiiii : 'NONE',
                SEARCH:     iiiiii ? iiiiii : '',
                LIMIT:      iiiiiii ? iiiiiii : '300',
            }; 

    async function fetching() {
        setLoad(false)
        try {
            const response = await axios.post(Imp.Fetch['uplines'], Auth);
            if(response.data == "NOTFOUND"){
                Fnc.NotFound()
            } else {
                setData(response.data);
                setLoad(true)
            }
        
            //console.log("Uplines items fetched..."+JSON.stringify(response.data,null,2))
        } catch (error) {
            console.error("Error fetching data");
        }
    }

    useLayoutEffect(() => {
        fetching();
        }, [i,ii,iii,iiii,iiiii,iiiiii,iiiiiii]);

    return ({load, data})
}

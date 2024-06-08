import { useLayoutEffect, useState } from 'react';
import axios from 'axios';
import * as Imp from '../importants'

export const RawAccounts = (i,ii) => {

    const Token = JSON.parse( localStorage.getItem('slk-token') );

    const [load, setLoad] = useState(false)
    const [data, setData] = useState([])
    
    const Auth = {
                A:      Token.id,
                B:      Token.token,
                C:      Token.gadget,
                D:      Imp.TimeZoned,
                FOR:    i,
                WHAT:   ii, 
            }; 

    async function fetching() {
        setLoad(false)
        try {
        const response = await axios.post(Imp.Fetch['accounts'], Auth);
        setData(response.data);
        setLoad(true)
        //console.log("Accounts items fetched..."+JSON.stringify(response.data,null,2))
        } catch (error) {
        console.error("Error fetching data: ", error);
        }
    }

    useLayoutEffect(() => {
        fetching();
        }, []);

    return ({load, data})
}

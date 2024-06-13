import axios from 'axios';
import { useState, useLayoutEffect } from 'react';

import * as Imp from '../importants'
import * as Fnc from '../functions'

export const RawHistory = (i) => {

  const Token = JSON.parse( localStorage.getItem('slk-token') );

  const [load, setLoad] = useState(false)
  const [data, setData] = useState([])

  const Auth = {
              A:  Token.id,
              B:  Token.token,
              C:  Token.gadget,
              D:  Imp.TimeZoned,
              FOR: i ? i : "MY",
          }; 

  async function fetching() {
      setLoad(false)
    try {
      const response = await axios.post(Imp.Fetch['history'], Auth);
      if(response.data == "NOTFOUND"){
        Fnc.NotFound()
    } else {
        setData(response.data);
        setLoad(true)
    }
      //console.log("Users items fetched..."+JSON.stringify(response.data,null,2))
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

  useLayoutEffect(() => {
      fetching();
    }, []);

  return ({load, data})
}
import axios from 'axios';
import { useState, useLayoutEffect } from 'react';

import * as Imp from '../importants'

export const RawApplications = (i) => {

  const Token = JSON.parse( localStorage.getItem('slk-token') );

  const [load, setLoad] = useState(false)
  const [data, setData] = useState([])

  const Auth = {
              A:    Token.id,
              B:    Token.token,
              C:    Token.gadget,
              D:    Imp.TimeZoned,
              FOR:  i ? i : "ALL",
          }; 

  async function fetching() {
      setLoad(false)
    try {
      const response = await axios.post(Imp.Fetch['applications'], Auth);
      setData(response.data);
      setLoad(true)
      console.log("Applications items fetched..."+JSON.stringify(response.data,null,2))
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

  useLayoutEffect(() => {
      fetching();
    }, []);

  return ({load, data})
}
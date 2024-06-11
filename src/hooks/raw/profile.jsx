import axios from 'axios';
import { useState, useLayoutEffect } from 'react';

import * as Imp from '../importants'

export const RawProfile = () => {

  const Token = JSON.parse( localStorage.getItem('slk-token') );

  const [load, setLoad] = useState(false)
  const [data, setData] = useState([])

  async function fetching() {
      setLoad(false)
    try {
      const response = await axios.post(Imp.Fetch['profile'], {
                                                                    A: Token.id,
                                                                    B: Token.token,
                                                                    C: Token.gadget,
                                                                    D: Imp.TimeZoned,
                                                                });
      const raw =  response.data
      setData(response.data);

      if(response.data == "NOTFOUND"){
        window.location.replace("/login"); 
        window.location.href = "/login";
    }
      
            localStorage.setItem('slk-user', JSON.stringify({
                                                              role:       raw.rolename,
                                                              nickname:   raw.nickname,
                                                              username:   raw.username,
                                                              avatar:     raw.avatarFull,
                                                              email:      raw.email,
                                                              telegram:   raw.telegram,
                                                              status:     raw.statusLabel,
                                                              status00:     raw.statusLabel,
                                                          }));

      setLoad(true)
      //console.log("Profile items fetched..."+JSON.stringify(response.data,null,2))
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

    useLayoutEffect(() => {
        fetching();
    }, []);

  return ({load, data})
}
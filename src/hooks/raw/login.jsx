import axios from 'axios';

import { useState, useLayoutEffect } from 'react';

import * as Imp from '../importants'

export const Login = (i,ii) => {

  const [load, setLoad] = useState("no")
  const [data, setdata] = useState("")

  const Auth = {
                    un: i,
                    pw: ii,
                    tz: Imp.TimeZoned,
                }; 

  async function logging() {
    try {
      const response = await axios.post(Imp.Fetch['login'], Auth);

      const feed =  response.data;
      
      if(feed != "NONE" || feed != "INC" || (feed['status'] == 1 || feed['status'] == 2)){

        const Token = {
                            id:         feed['uid'],
                            gadget:     feed['gadget'],
                            token:      feed['token'],
                            timezone:   Imp.TimeZoned,
                        }

        const User = {
                            role:       feed['rolename'],
                            roleID:     feed['role'],
                            nickname:   feed['nickname'],
                            username:   feed['username'],
                            firstname:   feed['firstname'],
                            lastname:   feed['lastname'],
                            avatar:     feed['avatar'],
                            email:      feed['email'],
                            telegram:   feed['telegram'],
                            status:     feed['status'],
                        }

        localStorage.setItem('slk-token', JSON.stringify(Token));
        localStorage.setItem('slk-user', JSON.stringify(User));
        console.log("Success! Logging in..."+JSON.stringify(User))
  
      } else {
        console.log("Failed Logging!")
      }

      setdata(feed);
      setLoad("yes")
      
    } catch (error) {
      setLoad("err")
      console.error("Error fetching data");
    }
  }

  useLayoutEffect(() => {
        logging();
    }, []);

  return ({data, load})
}

import axios from 'axios';
import { useState, useLayoutEffect } from 'react';

import * as Imp from '../importants'
import * as Fnc from '../functions'


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
      Fnc.NotFound(response.data)
      
            localStorage.setItem('slk-user', JSON.stringify({
                                                              roleID:     raw.role,
                                                              role:       raw.rolename,
                                                              nickname:   raw.nickname,
                                                              username:   raw.username,
                                                              firstname:  raw.firstname,
                                                              lastname:   raw.lastname,
                                                              avatar:     raw.avatarFull,
                                                              email:      raw.email,
                                                              telegram:   raw.telegram,
                                                              status:     raw.statusLabel,
                                                          }));

            localStorage.setItem('slk-route', JSON.stringify({
                                                              apps:         raw.forApp,
                                                              clubs:        raw.forClubs,
                                                              clubpercent:  raw.forClubPercent,
                                                              unions:       raw.forUnions,
                                                              users:        raw.forUsers,
                                                              deals:        raw.forDeals,
                                                              accounts:     raw.forAccounts,
                                                              formula:      raw.forFormula,
                                                              uplines:      raw.forUplines,
                                                              uppercent:    raw.forUpPercent,
                                                              notification: raw.forNotification,
                                                              fxrates:      raw.forFXRates,
                                                              records:      raw.forRecords,
                                                              myrecords:      raw.forMyRecords,
                                                              history:      raw.forHistory,
                                                              csvup:        raw.forCSVUp,
                                                              announce:     raw.forAnnounce,
                                                          }));    

      setLoad(true)
      //console.log("Profile items fetched..."+JSON.stringify(response.data,null,2))
    } catch (error) {
      console.error("Error fetching data");
    }
  }

    useLayoutEffect(() => {
        fetching();
    }, []);

  return ({load, data})
}
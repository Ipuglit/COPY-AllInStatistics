import axios from 'axios';
import { useState, useLayoutEffect } from 'react';

import * as Imp from '../importants'
import * as Fnc from '../functions'

export const RawHistory = (aa,bb,cc,dd,ee,ff,gg,hh,ii) => {

  const Token = JSON.parse( localStorage.getItem('slk-token') );

  const [load, setLoad] = useState(false)
  const [data, setData] = useState([])

  const Auth = {
              A:          Token.id,
              B:          Token.token,
              C:          Token.gadget,
              D:          Imp.TimeZoned,
              FOR:        aa ? aa : "MINE",
              USER:       bb ? bb : "ALL",
              GADGET:     cc ? cc : "ALL",
              ACTION:     dd ? dd : "ALL",
              DASH:       ee ? ee : "ALL",
              SORT:       ff ? ff : 'DESC',
              SORTBY:     gg ? gg : 'NONE',
              SEARCH:     hh ? hh : '',
              LIMIT:      ii ? ii : '300',
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
     //console.log("History items fetched..."+JSON.stringify(response.data,null,2))
    } catch (error) {
      console.error("Error fetching data");
    }
  }

  useLayoutEffect(() => {
      fetching();
    }, [aa,bb,cc,dd,ee,ff,gg,hh,ii]);

  return ({load, data})
}
import { useEffect, useState } from 'react';
import { RawProfile } from 'src/hooks/raw/profile';
// ----------------------------------------------------------------------


export function useProfiling() {

  const token = localStorage.getItem("slk-token") ;
  const user = localStorage.getItem("slk-user");
  
  const rawprofile = RawProfile()
  
  const [profile,setProfile] = useState([])
  const [results,setResults] = useState("")

  useEffect(() => {

      setProfile(rawprofile.data)

      if(rawprofile.load == true){
        if (token !== null && user !== null) {

          const stored = JSON.parse(token);
          const raw = rawprofile.data
  
          if(raw.id != stored.id){
            setResults("NO MATCH")
          } else {
            setResults("FOUND")
          }
  
        } else {
          setResults("LOST")
        }
      }

  }, [rawprofile.load == true]);
  
  return results

}

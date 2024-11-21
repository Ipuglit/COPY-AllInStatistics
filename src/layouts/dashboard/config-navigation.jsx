import { useEffect, useState } from 'react';
import SvgColor from 'src/components/svg-color';
import { GoTo } from 'src/layouts/dashboard/control';
// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);



const dashFull = [
                    {
                      title: 'dashboard',
                      path: '/',
                      icon: icon('ic_dashboard'),
                    },
                    {
                      title: 'My accounts',
                      path: '/myaccounts',
                      icon: icon('ic_accounts3'),
                    },
                    {
                      title: 'My records',
                      path: '/myrecords',
                      icon: icon('ic_record'),
                    },
                    {
                      title: 'My history',
                      path: '/myhistory',
                      icon: icon('ic_history'),
                    },
                  ];

const dashUser = [
                    {
                      title: 'My accounts',
                      path: '/myaccounts',
                      icon: icon('ic_accounts3'),
                    },
                    {
                      title: 'My records',
                      path: '/myrecords',
                      icon: icon('ic_record'),
                    },
                    {
                      title: 'My history',
                      path: '/myhistory',
                      icon: icon('ic_history'),
                    },
                  ];

export const navPublic  =(i)=>{
  const A         = JSON.parse( localStorage.getItem('slk-user') )
  const checkUser = A?.roleID > 3 ? dashFull : dashUser

  return checkUser
} 


export const navPrivate = ()  => {
  
  const [Go, setGo] = useState([])

  const navvi  = [];

  useEffect(() => {

    const slkUser   = JSON.parse( localStorage.getItem('slk-user') )
    const slkRoute  = JSON.parse( localStorage.getItem('slk-route') )

    setGo( GoTo(slkUser,slkRoute) )

  }, []);

  if ( Go.Records == true ) { 
    navvi.push({
                      title: 'Records',
                      path: '/records',
                      icon: icon('ic_record'),
                    });
  }

  if ( Go.Apps == true ) { 
    navvi.push({
                      title: 'Applications',
                      path: '/applications',
                      icon: icon('ic_apps'),
                    });
  }
  
  if ( Go.Clubs == true ) { 
    navvi.push({
                      title: 'Clubs',
                      path: '/clubs',
                      icon: icon('ic_clubs'),
                    });
  }
  
  
  if ( Go.Deals == true ) { 
    navvi.push({
                      title: 'Deals',
                      path: '/deals',
                      icon: icon('ic_deals'),
                    });
  }

  if ( Go.Formula == true ) { 
    navvi.push({
                      title: 'Formula',
                      path: '/formula',
                      icon: icon('ic_formula'),
                    });
  }

  if ( Go.Users == true ) { 
    navvi.push({
                      title: 'Users',
                      path: '/users',
                      icon: icon('ic_users'),
                    });
  }

  if ( Go.Accounts == true ) { 
    navvi.push({
                      title: 'Accounts',
                      path: '/accounts',
                      icon: icon('ic_accounts'),
                    });
  }

  if ( Go.Announce == true ) { 
    navvi.push({
                      title: 'Announcements',
                      path: '/announce',
                      icon: icon('ic_announce'),
                    });
  }

  if ( Go.Rates == true ) { 
    navvi.push({
                      title: 'FX Rates',
                      path: '/fxrates',
                      icon: icon('ic_usd'),
                    });
  }
  
  if ( Go.History == true ) { 
    navvi.push({
                      title: 'History',
                      path: '/history',
                      icon: icon('ic_history'),
                    });
  }
  
  if ( Go.CSVUp == 'hide' ) { 
    navvi.push({
                      title: 'CSV Upload',
                      path: '/csvupload',
                      icon: icon('ic_upload'),
                    });
  }
  
  return navvi

}

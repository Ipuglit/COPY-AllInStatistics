import { useEffect, useState } from 'react';

export const GoTo = (slkUser,slkRoute) => {

        const Move  = slkRoute ? true : false;
        const Upper = ['6','7','8'];
        //Formula
        if(Move){
            
            var userRole     = slkUser?.roleID

            var Apps         = Upper.includes(userRole) ? true :  slkRoute['apps'] == 'ALLOW'        || slkRoute['apps']      == 'VIEW' ? true : false
            var Clubs        = Upper.includes(userRole) ? true :  slkRoute['clubs'] == 'ALLOW'       || slkRoute['clubs']     == 'VIEW' ? true : false
            var Users        = Upper.includes(userRole) ? true :  slkRoute['users'] == 'ALLOW'       || slkRoute['users']     == 'VIEW' ? true : false
            var Deals        = Upper.includes(userRole) ? true :  slkRoute['deals'] == 'ALLOW'       || slkRoute['deals']     == 'VIEW' ? true : false
            var Acct         = Upper.includes(userRole) ? true :  slkRoute['accounts'] == 'ALLOW'    || slkRoute['accounts']  == 'VIEW' ? true : false
            var Unions       = Upper.includes(userRole) ? true :  slkRoute['unions'] == 'ALLOW'      || slkRoute['unions']    == 'VIEW' ? true : false
            var Uplines      = Upper.includes(userRole) ? true :  slkRoute['uplines'] == 'ALLOW'     || slkRoute['uplines']   == 'VIEW' ? true : false
            var Records      = Upper.includes(userRole) ? true :  slkRoute['records'] == 'ALLOW'     || slkRoute['records']   == 'VIEW' ? true : false
            var MyRecords    = Upper.includes(userRole) ? true :  slkRoute['myrecords'] == 'ALLOW'   || slkRoute['myrecords'] == 'VIEW' ? true : false
            var Formula      = Upper.includes(userRole) ? true :  slkRoute['formula'] == 'ALLOW'     || slkRoute['formula']   == 'VIEW' ? true : false
            var CSVUp        = Upper.includes(userRole) ? true :  slkRoute['csvup'] == 'ALLOW'     ? true : false
            var Rates        = Upper.includes(userRole) ? true :  slkRoute['fxrates']   == 'VIEW'  ? true : false
            var History      = Upper.includes(userRole) ? true :  slkRoute['history']   == 'VIEW'  ? true : false
            var Notifs       = Upper.includes(userRole) ? true :  slkRoute['notification'] == 'ALLOW' || slkRoute['notification'] == 'VIEW' ? true : false
            var Announce     = Upper.includes(userRole) ? true :  slkRoute['announce'] == 'ALLOW' || slkRoute['announce'] == 'VIEW' ? true : false
        }

return {
        userRole:       userRole,
        Apps:           Apps,
        Clubs:          Clubs,
        Users:          Users,
        Deals:          Deals,
        Accounts:       Acct,
        Unions:         Unions,
        Uplines:        Uplines,
        Records:        Records,
        MyRecords:      MyRecords,
        Formula:        Formula,
        CSVUp:          CSVUp,
        Rates:          Rates,
        History:        History,
        Notifs:         Notifs,
        Announce:       Announce,
    }

}

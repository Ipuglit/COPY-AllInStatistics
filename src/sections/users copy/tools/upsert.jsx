import { useLayoutEffect, useState } from 'react';
import axios from 'axios';
import * as Imp from 'src/hooks/importants'
import * as Fnc from 'src/hooks/functions'

import { UpsertDATA, LinkUPSERTS } from 'src/hooks/upsert/upsert-data'

export default async function UpsertRegisterAccounts(i) {

        try {

            const response = await axios.post(LinkUPSERTS('useraccounts'),UpsertDATA(i));

            if(response.data.Values == "NOTFOUND" || response.data.Values == "ZERO" || response.data.Values == "ERR"  ){
                return 'ZERO'
            } else {
                return response.data
            }
            
        } catch (error) {
            return 'ZERO'
        }

}

import axios from 'axios';
import { useState, useEffect } from 'react';
import * as Imp from '../importants'
import * as Fnc from '../functions'

// -------------------------------

export function UpsertLINK(i,ii) {
    
    if(ii == 'upload'){

        return Imp.Uploads[i]

    } else if(ii == 'upsert'){

        return Imp.Upserts[i]

    } else if(ii == 'image'){

        return Imp.Images[i]

    }

}

export function LinkUPLOAD(i) {
    return Imp.Uploads[i]
}

export function ImageLink(i) {
    return Imp.Images[i]
}

export function LinkUPSERTS(i) {
    return Imp.Upserts[i]
}

export function UpsertDATA(i) {

    const Token = JSON.parse( localStorage.getItem('slk-token') );

    const Auth = {
                                                A:      Token.id,
                                                B:      Token.token,
                                                C:      Token.gadget,
                                                D:      Imp.TimeZoned,
                                                ...i,
                                            }; 
                                            
    return Auth

}



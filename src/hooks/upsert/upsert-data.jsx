import axios from 'axios';
import { useState, useEffect } from 'react';
import * as Imp from '../importants'
import * as Fnc from '../functions'

// -------------------------------

export function UpsertLink(i) {
    return Imp.Upserts[i]
}

export function UpsertData(i) {

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



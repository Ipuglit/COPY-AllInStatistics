import { useEffect, useState } from 'react'

export function useLocalStorage(key, initValue) {

    const [state, setState] = useState(() => {
        const value = localStorage.getItem(key);
        if (value !== null) {
            return JSON.parse(value);
        }

        localStorage.setItem(key, JSON.stringify(initValue));
        return initValue;
    })

    useEffect(() => {
        localStorage.setItem(key, state);
    }, [key, state])
    
    return [state, setState];
}
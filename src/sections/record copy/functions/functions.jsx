
export function dateSlash(i) {

    const today = new Date();
    const e = new Date(i);
    e.setDate(e.getDate());
    const year = e.getFullYear();
    const month = String(e.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const day = String(e.getDate()).padStart(2, '0');

    const o = { weekday: 'long'};
    const wkday = e.toLocaleDateString('en-US', o);

    if(isNaN(year)){
    return {value: '', state: 'FORMAT'}
    } else if(e > today){
    return {value: year+'-'+month+'-'+day, state:'FUTURE'}
    }
    return {value: year+'-'+month+'-'+day, state:wkday}

}

export function dateDash(i) {

  const today = new Date();
  const e = new Date(i);
  e.setDate(e.getDate());
  const year = e.getFullYear();
  const month = String(e.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
  const day = String(e.getDate()).padStart(2, '0');

  const o = { weekday: 'long'};
  const wkday = e.toLocaleDateString('en-US', o);

  if(isNaN(year)){
  return {value: '', state: 'FORMAT'}
  } else if(e > today){
  return {value: year+'-'+month+'-'+day, state:'FUTURE'}
  }
  return {value: year+'-'+month+'-'+day, state:wkday}

}

export function lastSunday(i) {

    const ddate = new Date(i);
    const numDay = ddate.getDay();
    const Sun = new Date(ddate);
    Sun.setDate(ddate.getDate() - numDay);
    const sunday = Sun.toDateString()
    return dateDash(sunday).value;

}


function numHas(value) {
    return /\d/.test(value);
}

export function numForce(i,e) {

    const val = !numHas(i) || i == undefined || i == null || isNaN(i) || i == '' ? 0 : i
    const num = String(val).replace(/[^0-9.-]/g, ''); // Replace any character that is not a number

    if ( num.includes('.') && /\d(?=\.)/.test(num) ) {
          const fix         = parseFloat(num).toFixed(e ? e : 2)
          const fixing      = fix.split('.')[0] + '.' + fix.split('.')[1].slice(0, e ? e : 2);
          const fixed       = fixing.replace(/\.0+$/, '');

          return parseFloat(fixed)

    } else {

          return parseFloat(num)

    }
  }

  export function numDecimal(i,e) {
    return (numForce(i)/100)
  }


  export const sumPositives = (i) => {
    return i.reduce((e, val) => {
        if (val > 0) {
            return e + val;
        }
        return e;
    }, 0);
  }
  
  export const sumNegatives = (i) => {
    return i.reduce((e, val) => {
        if (val < 0) {
            return e + val;
        }
        return e;
    }, 0);
  }

  export const sumNumbers = (i) => {
    let sum = 0;
    for (const number of i) {
      sum += parseFloat(number);
    }
    return sum
  }
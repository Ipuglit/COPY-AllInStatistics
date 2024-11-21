import { useState, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { isNaN } from 'lodash';


export const goTo = (i) => {

  window.location.replace(i);
  window.location.href = i;

} 

export const isMobile = () => {

  const isTrue = useMediaQuery('(max-width:700px)');
  
  if(isTrue){
    return true
  } else {
    return false
  }

} 

export const OnMobile =()=> {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800); // Adjust breakpoint as needed
    };

    window.addEventListener('resize', handleResize);

    handleResize(); 

    return () => window.removeEventListener('resize', handleResize); // Cleanup
  }, []);

return isMobile;
}

export const downloadFile=(address,file)=>{
 
  const link          = document.createElement('a');
        link.href     = address+file;
        link.download = file;
        link.click();
        
}

export const intoString = (i) => {
  return String(i ? i : 'NONE').toUpperCase()

}

export const sortArray = (i,by) =>{

  const o = i.map((item) => item)
  .sort((a, b) => {
      if (a[by].toLowerCase() < b[by].toLowerCase()) {
          return -1;
      }
      if (a[by].toLowerCase() > b[by].toLowerCase()) {
          return 1;
      }
      return 0;
      });
  return o

} 

export const sortArrayDate = (i,by) =>{

  const sortedData = [...i].sort((a, b) => {
    const dateA = new Date(a[by]); // Convert strings to Date objects
    const dateB = new Date(b[by]);
    return dateB - dateA; // Sort descending for latest first
  });
  return sortedData;

} 

export const arrayfromComma = (i) =>{

  const AA = String(i).split(',');
  return AA.map(x => ({ value: x }));
   
} 

export const arrayfromCommaColon =(i)=>{
  const clubValuePairs = i.split(',');
  const objectArray = clubValuePairs.map(pair => {
      const [title, value] = pair.split(': ');
      return { title, value };
  });
  return objectArray
}

export const arrayCurlies =(i)=>{
  { const elements = i?.split("},{").map(item => item.replace(/[{}]/g, '')); 
    const arrayOfObjects = elements?.map(item => { const pairs = item.split(',').map(pair => pair.split(':')); return pairs.reduce((obj, [key, value]) => { obj[key.trim()] = value.trim(); return obj; }, {}); }); 
    return arrayOfObjects
  }
}

export const arraygroupfromCommaColon =(i)=>{
  const clubValuePairs = i.split(',');
  const groupedByClub = clubValuePairs.reduce((acc, pair) => {
    const [title, value] = pair.split(': ');
    if (!acc[title]) {
      acc[title] = [];
    }
    acc[title].push(value);
    return acc;
  }, {});
  const objectArray = Object.keys(groupedByClub).map(title => ({
    title,
    value: groupedByClub[title].join(', '),
  }));
  return objectArray
}

export const arrayAdding = (i) => {

  const sum = i?.reduce((acc, curr) => {
    return acc + NumForce(curr);
  }, 0);

  return sum

}

export const arrayAddingPositives = (i) => {

  const sum = i?.reduce((acc, curr) => {
    return NumForce(curr) > 0 ? acc + NumForce(curr) : acc;
  }, 0);

  return sum

}

export const arrayAddingNegatives = (i) => {

  const sum = i?.reduce((acc, curr) => {
    return NumForce(curr) < 0 ? acc + NumForce(curr) : acc;
  }, 0);

  return sum

}

export const NotFound = (i) => {
    if(i == "NOTFOUND"){
        window.location.replace("/login"); 
        window.location.href = "/login";
    }
  }

export const numExceeds = (number) => {
  if (number >= 1e12) {
    return (number / 1e12).toFixed(0) + 'T';
  } else if (number >= 1e9) {
    return (number / 1e9).toFixed(0) + 'B';
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(0) + 'M';
  } else if (number >= 1e5) {
    return (number / 1e3).toFixed(0) + 'K';
  } else {
    return String(number);
  }
  };

  export const numExceedsBasic = (num) => {

    const isNegative = num < 0;
    const absNum = Math.abs(num);

    if (absNum >= 1e15) return (isNegative ? '-' : '') + (absNum / 1e15).toFixed(0) + 'Q'; // Quadrillion
    if (absNum >= 1e12) return (isNegative ? '-' : '') + (absNum / 1e12).toFixed(0) + 'T'; // Trillion
    if (absNum >= 1e9) return (isNegative ? '-' : '') + (absNum / 1e9).toFixed(0) + 'B';  // Billion
    if (absNum >= 1e6) return (isNegative ? '-' : '') + (absNum / 1e6).toFixed(0) + 'M';  // Million
    if (absNum >= 1e3) return (isNegative ? '-' : '') + (absNum / 1e3).toFixed(0) + 'K';  // Thousand

    return String(num);
  };

export const numberWhole = (i) => {
    const num = i.replace(/[^0-9]/g, ''); // Replace any character that is not a digit with an empty string
    if (num.key == 'e' || num.key == 'E') {
      num.preventDefault();
    }
    return num
  }

export const numberHundred = (i) => {
  const num = i.replace(/[^0-9]/g, ''); // Replace any character that is not a digit with an empty string
  if (num.key == 'e' || num.key == 'E' || num.key == '.') {
    num.preventDefault();
  }
  if(i >=0 && i<=100 ){
    if (num.length > 1 && num.charAt(0) === '0') {
      return num.slice(1);
    } else {
      return num
    }
  } else {
      return 0
  }
}

export const numberOnly = (i) => {
  if(i != null || i != undefined){
      const regex = /^\d+$/;
      const num = regex.test(i) ? parseInt(i, 10) : 0;
      return num;
  } else {
      return 0;
  }
}

export const numberDecOnly = (i) => {
  if(i != null || i != undefined){
      const regex = /^[-+]?[0-9]+\.[^0-9]+$/;
      const num = regex.test(i) ? parseInt(i, 10) : 0;
      return num;
  } else {
      return 0;
  }
}

export const textSanitizeFormula = (i) => {
  const val     = String(i).replace(/[^a-zA-Z0-9 )(/+.*-\s]/g, '')
  return val.replace(/ {2,}/g, ' ')
};

export const textSanitize = (i) => {
  const val     = String(i).replace(/[^a-zA-Z0-9 $!#&?.,-\s]/g, '').trim()
  return val.replace(/ {2,}/g, ' ')
};

export const textNickname = (i) => {
  const val     = String(i).replace(/([^a-zA-Z0-9])\+$/g, '');
  const allow   = val.replace(/[^a-zA-Z0-9.! @$&_+-.#]/g, "");
  return allow
};

export const textName = (i) => {
  const val     = String(i).replace(/[^a-zA-Z ]/g, "")
  const ret = val.charAt(0).toUpperCase() + val.slice(1);
  return ret.replace(/ {2,}/g, ' ')
};

export const textValidName = (i) => {
  const regex = /[^a-zA-Z\s-]/g;
  const sanitizedName = String(i).replace(regex, '');
  const regexValidate = /^[a-zA-Z]+(?:[\s'-][a-zA-Z]+)*$/;
  return regexValidate.test(sanitizedName) ? sanitizedName : null;
};

export const textUsername = (i) => {
  const val     = String(i).replace(/([^a-zA-Z0-9])\1+$/g, '');
  const allow   = val.replace(/[^a-zA-Z0-9.!@$&_+-.#]/g, "");
  const non     = allow.replace(/\s/g, '');
  return non
};

export const textPassword = (i) => {
  const allow   = String(i).replace(/[^a-zA-Z0-9.!@$&_+-.#]/g, "");
  const non     = allow.replace(/\s/g, '');
  return non
};

export const checkPassword = (i) => {
  let regex = /^(?=.*\d)(?=.*[~`!@#$-_+.%^&()--+={}\[\]|\\:;"'<>,.?/_₹])(?=.*[a-z])(?=.*[A-Z]).{5,10}$/;
  return regex.test(i)
};

export const checkEmail = (i) => {
  let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(i)
};

export const checkInput = (i,ii) => {
  if(i.length >= ii){
    return true;
  } else {
    return false;
  }
};

export const checkClean = (i) => {
  const allow   =  String(i).replace(/^\s+|\s+$/g, '');
  const non     = allow.replace(/\s+/g, ' '); 
  return non
};

export const firstTrail = (i) => {

  if (i.length >= 2 && i[0] === '0') {
    return i.slice(1); // Remove the first character
  } else {
      return i;
  }
};

export const Numb = (i) => {

  if(i != null || i != undefined){
    if (/^\d*\.?\d*$/.test(i)) {
      return firstTrail(i);
    }
  } else {
      return 0;
  }
};

export const numberNoTrailing = (i) => {
  const numberString = i.toString();
  if (numberString.includes('.') && /\d(?=\.)/.test(numberString)) {
    const formattedNumber = numberString.replace(/\.0+$/, '');
    return parseFloat(formattedNumber); // Convert back to number
  }
  return i;
}

export const numCheck = (i) => {
  if( isNull(i,0) ) {
    return 0
  } else {
    return parseFloat(i)
  }
}

export const numZero = (i,e) => {
  if( isNull(i,0) ) {
    return e ? e : 0
  } else {
    return parseFloat(i)
  }
}

function numHas(value) {
  return /\d/.test(value);
}

export const NumForce= (i,e) => {

  const val = !numHas(i) || i == undefined || i == null || i == '' ? 0 : i
  const num = String(val).replace(/[^0-9.-]/g, '');

    if ( num.includes('.') && /\d(?=\.)/.test(num) ) {

        const fix       = parseFloat(num).toFixed(2)
        const fixs      = fix.split('.')[0] + '.' + fix.split('.')[1].slice(0,2);
        const fixed     = fixs.replace(/\.0+$/, '');

        return parseFloat(fixed)

    } else {

        return parseFloat(num)

    }
}

export const NumForce3= (i,e) => {

  const val = !numHas(i) || i == undefined || i == null || i == '' ? 0 : i
  const num = String(val).replace(/[^0-9.-]/g, '');

    if ( num.includes('.') && /\d(?=\.)/.test(num) ) {

        const fix       = parseFloat(num).toFixed(3)
        const fixs      = fix.split('.')[0] + '.' + fix.split('.')[1].slice(0,3);
        const fixed     = fixs.replace(/\.0+$/, '');

        return parseFloat(fixed)

    } else {

        return parseFloat(num)

    }
}

export const numberBlurClean= (i,e) => {

  const val = !numHas(i) || i == undefined || i == null || i == '' ? 0 : i
  const num = String(val).replace(/[^0-9.-]/g, '');

    if ( num.includes('.') && /\d(?=\.)/.test(num) ) {

        const fix       = parseFloat(num)
        const fixs      = fix?.split('.')[0] + '.' + fix?.split('.')[1]?.slice(0,2);
        const fixed     = fixs?.replace(/\.0+$/, '');

        return parseFloat(fixed)

    } else {

        return parseFloat(num)

    }
}

export const numPush= (i,e) => {

  const val = !numHas(i) || i == undefined || i == null || i == '' || i == 0 ? 0 : i
  const num = String(val).replace(/[^0-9.-]/g, '');

    if ( num.includes('.') && /\d(?=\.)/.test(num) ) {

        const fix       = parseFloat(num).toFixed(2)
        const fixs      = fix.split('.')[0] + '.' + fix.split('.')[1].slice(0,2);
        const fixed     = fixs.replace(/\.0+$/, '');

        return parseFloat(fixed)

    } else {

        return parseFloat(num)

    }
}

export const numUnpure= (i,e) => {
  //check if number else return as zero
  const val = isNaN(i) || i == undefined || i == null || i == '' ? '' : i
  const pureNumber = String(val).replace(/[^0-9.-]/g, '');
  return pureNumber;
}

export const numDecPositive= (i,e) => {
  //check if number else return as zero
  const val = isNaN(i) || i == undefined || i == null || i == '' ? 0 : i
  const pureNumber = String(val).replace(/[^0-9.]/g, '');
  return parseFloat(pureNumber);
}

export const numUSD= (i,usd) => {
  const val = isNum(i) * isNum(usd)
  return val.toFixed(2);
}

export const numberAdding= (i,e) => {

  const num = String(i).replace(/[^0-9.]/g, '');
  const fix = parseFloat(num).toFixed(e ? e : 2)
  return parseFloat(fix.split('.')[0] + '.' + fix.split('.')[1].slice(0, e ? e : 2))

}

export const numHundred = (i) => {
  const num = i == 0 ? i : i.replace(/[^0-9]/g, ''); // Replace any character that is not a digit with an empty string
  if (num.key == 'e' || num.key == 'E' || num.key == '.') {
    num.preventDefault();
  }
  if(i >=0 && i<=100 ){
    if (num.length > 1 && num.charAt(0) === '0') {
      return num.slice(1);
    } else {
      return num
    }
  } else {
      return 0
  }
}

export const numDecimal = (i) => {

  const regex = /[^0-9.]/g;
  const regex2 = /(\.[0-9]*)\..*/g;
  let san = i.replace(regex, '');
  return san.replace(regex2, '');

}
export const numNum = (i) => {
  if( isNull(i,0) ) {
    return 0
  } else {
    return parseFloat(i)
  }
}
export const intoUSD= (i,usd) => {
  const val = NumForce(i) * NumForce(usd)
  return val.toFixed(2);
}

export const intoBASE= (i,usd) => {
  const val = NumForce(i) / NumForce(usd)
  return val.toFixed(2);
}

export const numberDecimals = (i,e) => {
  const regex = /[^0-9.]/g;
  const regex2 = /(\.[0-9]*)\..*/g;
  let san = i.replace(regex, '');
  return san.replace(regex2, '');
}

export const numberDecNegatives = (i,e) => {
  const regex = /^-?\d*\.?\d*$/;
  if (regex.test(i)) {
   return i;
  }
}

export const numRandom = (i) => {
  const num = Math.floor(Math.random() * (99 - 2 + 1)) + 2;
  return num*1.2
}

export const wordNormal = (i) => {
  const num = i.replace(/[^a-zA-Z0-9.,!@#?/*&$-_() ]/g, ''); // Replace any character that is not a digit with an empty string
  return num
}

export const wordName = (i) => {
  const num = i.replace(/[^a-zA-Z-. ]/g, ''); // Replace any character that is not a digit with an empty string
  return num
}

export const wordAlphaID = (i) => {
  const num = i.replace(/[^a-zA-Z0-9-.]/g, ''); // Replace any character that is not a digit with an empty string
  return num
}

export const wordAlphaIDs = (i) => {
  const num = i.replace(/[^a-zA-Z0-9-.,]/g, ''); // Replace any character that is not a digit with an empty string
  return num
}

export const wordUpper = (i) => {
  return String(i).split('').map(char => {
    if (/[a-z]/.test(char)) {
      return char.toUpperCase();
    }
    return char;
  }).join('');
}

export const toUpper = (i) => {
  return String(i).toUpperCase()
}

export const isDay =(i) => {
  return  toUpper(i) == 'MONDAY'     ? 'MONDAY' 
        : toUpper(i) == 'TUESDAY'    ? 'TUESDAY' 
        : toUpper(i) == 'WEDNESDAY'  ? 'WEDNESDAY'
        : toUpper(i) == 'THURSDAY'   ? 'THURSDAY'
        : toUpper(i) == 'FRIDAY'     ? 'FRIDAY'
        : toUpper(i) == 'SATURDAY'   ? 'SATURDAY'
        : 'SUNDAY'
}

export const isDayNumber =(i) => {
  return  wordDayName(i) == 'MONDAY'     ? 1 
        : wordDayName(i) == 'TUESDAY'    ? 2 
        : wordDayName(i) == 'WEDNESDAY'  ? 3
        : wordDayName(i) == 'THURSDAY'   ? 4
        : wordDayName(i) == 'FRIDAY'     ? 5
        : wordDayName(i) == 'SATURDAY'   ? 6
        : 0
}

export const wordNoSpace = (i) => {
    const num = i.replace(/[^a-zA-Z0-9!?#-_.]/g, ''); // Replace any character that is not a digit with an empty string
    return num
  }

export const wordNickPass = (i) => {
  const num = i.replace(/[^a-zA-Z0-9-!?@#$%&*_+.-]/g, ''); // Replace any character that is not a digit with an empty string
    return num
}

export const wordNickname = (i) => {
  const num = i.replace(/[^a-zA-Z0-9-!?@#$%&*_+.-\s]/g, ''); // Replace any character that is not a digit with an empty string
  return num
}

export const wordPassword = (i) => {
  const num = i.replace(/[^a-zA-Z0-9-!?@#$%&*_+.-]/g, ''); // Replace any character that is not a digit with an empty string
  return num
}

export const wordNorm = (i) => {
    const num = i.replace(/[^a-zA-Z0-9$!#()%*@/'&\-+?,.\s]/g, ''); // Replace any character that is not a digit with an empty string
    return num
  }


export const wordTitled = (i) => {
  const num = i.replace(/[^a-zA-Z0-9!&. ]/g, '').replace(/\s{2,}/g, ' ').toUpperCase()
  return num
}

export const wordCapital = (i) => {
  return i.charAt(0).toUpperCase() + i.slice(1).toLowerCase();
};

export const wordEquateCase = (i) => {
  return String(i).toUpperCase().replace(/(?<=[a-zA-Z]) (?=[a-zA-Z])/g, '').replace(/ {2,}/g, '').trim();
};

export const wordLowerCase = (i) => {
  return i.toLowerCase();
};

export const wordNoSpaceCapital = (i) => {
  const num = i.replace(/[^a-zA-Z0-9!?#-_.]/g, ''); // Replace any character that is not a digit with an empty string
  if (num.key == 'e' || num.key == 'E') {
    num.preventDefault();
  }
  return num.toUpperCase();
}

export const wordCapNoSpace =(i)=>{
  return i.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
}

export const wordDayName =(i)=>{
  return String(i).toUpperCase().replace(/ /g, "");
}

export const wordTitleCase =(i)=>{
  return String(i).toLowerCase().replace(/(?:^|\s)\S/g, (match) => match.toUpperCase());
}

export const lastSunday = (i) => {
  const ddate = new Date(i);
  const numDay = ddate.getDay();
  const Sun = new Date(ddate);
  Sun.setDate(ddate.getDate() - numDay);
  const sunday = Sun.toDateString()
  return dateDash(sunday);
}

// SAMPLE: July 18, 2023  =>  2023-07-19
export const dateSlashPlus = (i) => {

    const e = new Date(i);
    e.setDate(e.getDate() + 1);
    const year = e.getFullYear();
    const month = String(e.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const day = String(e.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;

}

// SAMPLE: July 18, 2023  =>  07/18/2023
export const dateSlash = (i) => {

  const e = new Date(i);
  e.setDate(e.getDate() + 1);
  const year = e.getFullYear();
  const month = String(e.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
  const day = String(e.getDate()).padStart(2, '0');
  return `${month}/${day}/${year}`;

}

// SAMPLE: July 18, 2023  =>  2023-07-18
export const dateDash = (i) => {

  const e = new Date(i);
  e.setDate(e.getDate());
  const year = e.getFullYear();
  const month = String(e.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
  const day = String(e.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;

}

export function dateDashed(i) {

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

export const dateCheck = (A) => {
  const i = new Date(A);
  if (Object.prototype.toString.call(i) === "[object Date]") {
    if (isNaN(i.getTime())) return false;
    return i.getTime() !== new Date(NaN).getTime();
  }
  return false;

}

export const dateGetDay = (i) => {

  const parsedDate = new Date(i);

  if (!isNaN(parsedDate)) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = days[parsedDate.getDay()]; // Get the day of the week
    return day
  } else {
    return ''
  }
};

export const dateGoBack = (A,B,C) => {

  if(B == 0 || B == 1 || B == 2 || B == 3 || B == 4 || B == 5 || B == 6 ){

    const targetDate = new Date(A);
    const day = targetDate.getDay();
    const diff = targetDate.getDate() - day + (day < B ? B - 7 : B);
    const D = new Date(targetDate.setDate(diff));
    return dateDash(D);

  } else {

    if(C == undefined){
      return lastSunday(A)
    } else {
      return dateDash(C);
    }

  }

}



// SAMPLE: 2024-07-23  =>  Tuesday, July 23, 2024
export const dateWord = (i) => {
  const n = new Date(i)
  const o = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  const w = n.toLocaleDateString('en-US', o);
  return w;
}

// SAMPLE: 2024-07-23  =>  July 23, 2024
export const dateText = (i) => {
  const n = new Date(i)
  const o = { month: 'long', day: 'numeric', year: 'numeric' };
  const w = n.toLocaleDateString('en-US', o);
  return w;
}

export const datetimeText = (i) => {
  const n = new Date(i)
  const o = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true, };
  const w = n.toLocaleDateString('en-US', o);
  return w;
}

export const dateYearMonth = (i) => {
  const [year, month] = String(i).split(' ');
  const dates = new Date(year, month - 1);
  const monthName = dates.toLocaleString('en-US', { month: 'long' });
  return `${year} ${monthName}`;
}


export const countbyComma =(i)=>{
  return i?.split(',')?.filter(e => e.trim())?.length;
}

export const addNumbers = (arr) => {
  let sum = 0;
  for (const number of arr) {
    sum += parseFloat(number);
  }
  return NumForce(sum)
}

export const sumNumbers = (arr) => {
  let sum = 0;
  for (const number of arr) {
    sum += parseFloat(number);
  }
  return NumForce(sum)
}

export const sumPosi = (arr) => {
  return arr.reduce((acc, curr) => {
      if (curr > 0) {
          return acc + NumForce(curr);
      }
      return acc;
  }, 0);
}

export const sumNega = (arr) => {
  return arr.reduce((acc, curr) => {
      if (curr < 0) {
        return acc + NumForce(curr);
      }
      return acc;
  }, 0);
}


export const JSONS = (i,e) => {
  if(e == true){
    return <pre style={{fontSize:'11px'}}>{JSON.stringify(i,null,2)}</pre>
  }
}

export const Statuses = (i) => {
  if(i == 'Active'){
    return {icon: 'mdi:check-circle', color:'green', alert:'success', label:i}
  } else if(i == 'Pending'){
    return {icon: 'mdi:clock-outline', color:'orange', alert:'warning', label:i}
  } else {
    return {icon: 'mdi:close-circle', color:'red', alert:'danger', label:i}
  }
}

export const isImage = (i,e) => {
  
    var exists = false;

    const img = new Image();
    img.src = i;
    img.onload = () => exists = true;
    img.onerror = () => exists = false;

  if(exists){
    return i
  } else {
    return e
  }

};

export const equalAutoComplete = (i, value)=>{
  if(value != null && value != 0 && value != ''){
    const ret = String(i.value).toLowerCase() == String(value).toLowerCase();
    return ret
  } else {
    return false
  }

}

export const isZERO =(i)=>{
  return i == 'NOTFOUND' || i == 'ZERO' || !i ? false : true
}

export const isEmptyThenZero =(i)=>{
  if( i == '' || i == null || i == undefined || (typeof i != 'number' && isNaN(i)) ){
    return 0
  } else {
    return i
  }
}


export const isNull =(i,ii)=>{
  if( i == '' || i == null || i == undefined || (ii == 'Num' || ii == 0 ? i == 0 || isNaN(i) : null) ){
    return true
  } else {
    return false
  }
}

export const isAllNull =(i,ii)=>{
  return i.some(v => {

    if (v === null || v === undefined || v === '') {
      return true;
    } else {
      if(ii == 0 && ( v == 0 || isNaN(v) )){
        return true;
      } else {
        return false;
      }
    }

  });
}

export const isNum =(i)=>{
  if( (i == '' || i == null || i == undefined|| isNaN(i) || i == 0)){
    return 0
  } else {
    return i
  }
}

export const isTrue =(i,ii)=>{
  if( i == ii ){
    return true
  } else {
    return false
  }
}

export const isNegative =(i)=>{
  const isNega = NumForce(i) < 0;
  return isNega
}

export const isEmail =(i)=>{
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(i);
}

export const  ifImage=(i,e)=>{
  if(!isNull(i)){
    const str = i.endsWith('.jpeg') || i.endsWith('.jpg') || i.endsWith('.png') ? true : false
    if(str){
      return i
    } else {
      return e
    }
  } else {
    return e
  }


}

export const  isSubmitted=(i,data)=>{

    if(i.added > 0){

      return {
                status: 'Added',
                data: {...data, id: i.id ? i.id : 0}
              }

  } else if(i.replaced > 0){

      return {
                status: 'Replaced',
                data: {...data, id: i.id ? i.id : 0}
              }

  } else if(i.removed > 0){

      return {
                status: 'Removed',
                data: {...data, id: i.id ? i.id : 0}
              }

  } else if(i.hits > 0){

      return {
                status: 'Duplicate',
                data: {...data, id: i.id ? i.id : 0}
              }

  } else {

      return {
                status: 'Failed',
                data: {...data, id: i.id ? i.id : 0}
              }

  }
}

export const antiArrayDuplicate =(arr,a,b)=> {
    return arr.filter((i, index, self) => {
                return self.findIndex((t) => t[a] === i[b]) === index;
            }); 
}

export const safeJSONParse = (i) => {
  try {
    return JSON.parse(i);
  } catch (e) {
    return null;
  }
};
export const JSONChecking =(u,uu,uuu,rawClubs,rawAccounts,rawUplines)=>{

  if(u != 'ERR'){

      const ArrayJSON = uu.map((rw) => {
          const e = {};
          for (let i = 0; i < rw.length; i++) {
          e[u[i]] = rw[i];
          }
          return e;
      });

      const arrClubs = [{

      }]

      const fillClubs =(VAL)=>{

          const x = rawClubs.find((e) => e.idd == VAL || e.name == VAL);
          if(x){

              return {
                        CLUB:           x.name,
                        CLUBIDD:        x.idd,
                        CLUBSUB:        'SAME',
                        CLUBPERCENT:    x.percent,
                        APPID:          x.appID,
                        APPNAME:        x.appName,
                      }
                      
          } else {

              return {
                        CLUB:           VAL,
                        CLUBIDD:        '0',
                        CLUBSUB:        'NONE',
                        CLUBPERCENT:    '0',
                        APPID:          '0',
                        APPNAME:        '',
                      }
          }
      }

      const fillPlayers =(VAL,APP,CLUB)=>{
          const xp = rawAccounts.find((e) => ( e.accountID == VAL ) );

          if(xp){
            if( xp.appID == APP ){

              return {
                PLAYERID:       xp.accountID,
                PLAYERNAME:     xp.accountNickname,
                PLAYERSTATUS:   xp.statusLabel,
                PLAYERSUB:      'SAME',
              }

            } else {

              return {
                        PLAYERID:       xp.accountID,
                        PLAYERNAME:     xp.accountNickname,
                        PLAYERSTATUS:   xp.statusLabel,
                        PLAYERSUB:      'WRONG',
                      }
            }
          } else {

              return {
                        PLAYERID:       VAL,
                        PLAYERNAME:     '',
                        PLAYERSTATUS:   '',
                        PLAYERSUB:      'NEW',
                      }
          }
      }


      const fillUplines =(VAL,APP,CLUB)=>{

        const x = rawUplines.find((e) => ( e.playerID == VAL && e.clubIDD == CLUB ) );

        if(x){

          if( x.appID == APP ){
            return {
                        UPLINEID:       x.uplineID,
                        UPLINENAME:     x.uplineNickname,
                        UPLINESTATUS:   x.uplineStatusLabel,
                        UPLINEPERCENT:  x.percentage,
                        UPLINESUB:      'SAME',
                    }

          } else {
            return {
                        UPLINEID:       '0',
                        UPLINENAME:     '',
                        UPLINESTATUS:   '',
                        UPLINEPERCENT:  '0',
                        UPLINESUB:      'WRONG',
                    }
          }
        } else {
            return {
                        UPLINEID:       '0',
                        UPLINENAME:     '',
                        UPLINESTATUS:   '',
                        UPLINEPERCENT:  '0',
                        UPLINESUB:      'NONE',
                    }
        }
    }

      if(uuu == 'SHORT'){

        const newArray = ArrayJSON.map( ii => {

          const iClub = ii['CLUB'] ? fillClubs(ii['CLUB']) : fillClubs(ii['CLUB']);
          const iPlayers = ii['PLAYERID'] ? fillPlayers(ii['PLAYERID'],iClub.APPID,iClub.CLUBIDD) : fillPlayers(ii['PLAYERID'],iClub.APPID,iClub.CLUBIDD);
          const iUplines = ii['PLAYERID'] ? fillUplines(ii['PLAYERID'],iClub.APPID,iClub.CLUBIDD) : fillUplines(ii['PLAYERID'],iClub.APPID,iClub.CLUBIDD);
           return {
                      ...ii,
                      CLUB:             iClub.CLUB,
                      CLUBIDD:          iClub.CLUBIDD,
                      CLUBID:           NumForce(ii['CLUBID']),
                      CLUBSUB:          iClub.CLUBSUB,
                      CLUBPERCENT:      iClub.CLUBPERCENT,
                      APPID:            iClub.APPID,
                      APPNAME:          iClub.APPNAME,
                      PLAYERNAME:       iPlayers.PLAYERNAME,
                      PLAYERSTATUS:     iPlayers.PLAYERSTATUS,
                      PLAYERSUB:        iPlayers.PLAYERSUB,
                      UPLINEID:         iUplines.UPLINEID,
                      UPLINENAME:       iUplines.UPLINENAME,
                      UPLINESTATUS:     iUplines.UPLINESTATUS,
                      UPLINEPERCENT:    iUplines.UPLINEPERCENT,
                      UPLINESUB:        iUplines.UPLINESUB,
                      FXCURRENCY:       'USD',
                      FXUSD:            1,
                      FXDATE:           '',
                      FXPROVIDER:       '',
                      DATECLOSED :      dateSlashPlus(ii['DATECLOSED']),
                      BONUS_SIX:          0,
                      BONUS_FLH:        0,
                      BONUS_FLOHI:      0,
                      BONUS_FLOHILO:    0,
                      BONUS_MIXED:      0,
                      BONUS_MTT:        0,
                      BONUS_NLH:        0,
                      BONUS_OFC:        0,
                      BONUS_OTHERS: NumForce(ii['BONUS_TOTAL']),
                      BONUS_PLOHI:      0,
                      BONUS_PLOHILO:    0,
                      BONUS_SNG:        0,
                      BONUS_SPIN:       0,
                      WINLOSS_SIX:        0,
                      WINLOSS_FLH:      0,
                      WINLOSS_FLOHI:    0,
                      WINLOSS_FLOHILO:  0,
                      WINLOSS_MIXED:    0,
                      WINLOSS_MTT:      0,
                      WINLOSS_NLH:      0,
                      WINLOSS_OFC:      0,
                      WINLOSS_OTHERS: NumForce(ii['WINLOSS_TOTAL']),
                      WINLOSS_PLOHI:    0,
                      WINLOSS_PLOHILO:  0,
                      WINLOSS_SNG:      0,
                      WINLOSS_SPIN:     0,
                      WINLOSS_TOTAL:    NumForce(ii['WINLOSS_TOTAL']),
                      BONUS_TOTAL:      NumForce(ii['BONUS_TOTAL']),
          }

        });

        return newArray

      } else if(uuu == 'LONG'){


        const newArray = ArrayJSON.map( ii => {

           const iClub = ii['CLUB'] ? fillClubs(ii['CLUB']) : fillClubs(ii['CLUB']);
           const iPlayers = ii['PLAYERID'] ? fillPlayers(ii['PLAYERID'],iClub.APPID,iClub.CLUBIDD) : fillPlayers(ii['PLAYERID'],iClub.APPID,iClub.CLUBIDD);
           const iUplines = ii['PLAYERID'] ? fillUplines(ii['PLAYERID'],iClub.APPID,iClub.CLUBIDD) : fillUplines(ii['PLAYERID'],iClub.APPID,iClub.CLUBIDD);
            return {
                      ...ii,
                      CLUB:             iClub.CLUB,
                      CLUBIDD:          iClub.CLUBIDD,
                      CLUBID:           NumForce(ii['CLUBID']),
                      CLUBPERCENT:      iClub.CLUBPERCENT,
                      CLUBSUB:          iClub.CLUBSUB,
                      APPID:            iClub.APPID,
                      APPNAME:          iClub.APPNAME,
                      PLAYERNAME:       iPlayers.PLAYERNAME,
                      PLAYERSTATUS:     iPlayers.PLAYERSTATUS,
                      PLAYERSUB:        iPlayers.PLAYERSUB,
                      UPLINEID:         iUplines.UPLINEID,
                      UPLINENAME:       iUplines.UPLINENAME,
                      UPLINESTATUS:     iUplines.UPLINESTATUS,
                      UPLINEPERCENT:    iUplines.UPLINEPERCENT,
                      UPLINESUB:        iUplines.UPLINESUB,
                      FXCURRENCY:       'USD',
                      FXUSD:            1,
                      FXDATE:           '',
                      FXPROVIDER:       '',
                      DATECLOSED :      dateSlashPlus(ii['DATECLOSED']),
                      BONUS_SIX:          NumForce(ii['BONUS_SIX']),
                      BONUS_FLH:        NumForce(ii['BONUS_FLH']),
                      BONUS_FLOHI:      NumForce(ii['BONUS_FLOHI']),
                      BONUS_FLOHILO:    NumForce(ii['BONUS_FLOHILO']),
                      BONUS_MIXED:      NumForce(ii['BONUS_MIXED']),
                      BONUS_MTT:        NumForce(ii['BONUS_MTT']),
                      BONUS_NLH:        NumForce(ii['BONUS_NLH']),
                      BONUS_OFC:        NumForce(ii['BONUS_OFC']),
                      BONUS_PLOHI:      NumForce(ii['BONUS_PLOHI']),
                      BONUS_PLOHILO:    NumForce(ii['BONUS_PLOHILO']),
                      BONUS_SNG:        NumForce(ii['BONUS_SNG']),
                      BONUS_SPIN:       NumForce(ii['BONUS_SPIN']),
                      BONUS_OTHERS:     NumForce(ii['BONUS_OTHERS']),
                      WINLOSS_SIX:      NumForce(ii['WINLOSS_SIX']),
                      WINLOSS_FLH:      NumForce(ii['WINLOSS_FLH']),
                      WINLOSS_FLOHI:    NumForce(ii['WINLOSS_FLOHI']),
                      WINLOSS_FLOHILO:  NumForce(ii['WINLOSS_FLOHILO']),
                      WINLOSS_MIXED:    NumForce(ii['WINLOSS_MIXED']),
                      WINLOSS_MTT:      NumForce(ii['WINLOSS_MTT']),
                      WINLOSS_NLH:      NumForce(ii['WINLOSS_NLH']),
                      WINLOSS_OFC:      NumForce(ii['WINLOSS_OFC']),
                      WINLOSS_PLOHI:    NumForce(ii['WINLOSS_PLOHI']),
                      WINLOSS_PLOHILO:  NumForce(ii['WINLOSS_PLOHILO']),
                      WINLOSS_SNG:      NumForce(ii['WINLOSS_SNG']),
                      WINLOSS_SPIN:     NumForce(ii['WINLOSS_SPIN']),
                      WINLOSS_OTHERS: NumForce(ii['WINLOSS_OTHERS']),
                      WINLOSS_TOTAL:    addNumbers([NumForce(ii['WINLOSS_NLH']),NumForce(ii['WINLOSS_FLH']),NumForce(ii['WINLOSS_SIX']),NumForce(ii['WINLOSS_PLOHI']),NumForce(ii['WINLOSS_PLOHILO']),NumForce(ii['WINLOSS_FLOHI']),NumForce(ii['WINLOSS_FLOHILO']),NumForce(ii['WINLOSS_MIXED']),NumForce(ii['WINLOSS_OFC']),NumForce(ii['WINLOSS_MTT']),NumForce(ii['WINLOSS_SNG']),NumForce(ii['WINLOSS_SPIN']),NumForce(ii['WINLOSS_OTHERS'])]),
                      BONUS_TOTAL:      addNumbers([NumForce(ii['BONUS_NLH']),NumForce(ii['BONUS_FLH']),NumForce(ii['BONUS_SIX']),NumForce(ii['BONUS_PLOHI']),NumForce(ii['BONUS_PLOHILO']),NumForce(ii['BONUS_FLOHI']),NumForce(ii['BONUS_FLOHILO']),NumForce(ii['BONUS_MIXED']),NumForce(ii['BONUS_OFC']),NumForce(ii['BONUS_MTT']),NumForce(ii['BONUS_SNG']),NumForce(ii['BONUS_SPIN']),NumForce(ii['BONUS_OTHERS'])]),
                    }

        });

        return newArray
      }

  } else {
        return []
  }

}

export const filterOptions = (options, params) => {
  const filtered = options.filter((option) => {
    const input = params.inputValue.toLowerCase();
    const label = String(option.label).toLowerCase();
    const name = String(option.name).toLowerCase();
    const description = String(option.description).toLowerCase();
    return label.includes(input) || description.includes(input) || name.includes(input);
  });
  return filtered;
}
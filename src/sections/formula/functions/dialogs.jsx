export const isOptionEqualToValue = (option, val) => {
    if (option && val) {
      return option.id === val.id;
    }
    return option === val;
  };
  
  export const filterOptions = (options, params) => {
    const filtered = options.filter((option) => {
      const input = params.inputValue.toLowerCase();
      const label = String(option.label).toLowerCase();
      const description = String(option.description).toLowerCase();
      return label.includes(input) || description.includes(input);
    });
    return filtered;
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

  export const numCheck = (i) => {
      if( isNull(i,0) ) {
        return 0
      } else {
        return parseFloat(i)
      }
  }

  export const numDecimal = (i) => {

    const regex = /[^0-9.]/g;
    const regex2 = /(\.[0-9]*)\..*/g;
    let san = i.replace(regex, '');
    return san.replace(regex2, '');

  }

  export const numRandom = (i) => {
    const num = Math.floor(Math.random() * (99 - 2 + 1)) + 2;
    return num*1.1
  }

  const isNegative =(i,A,B,C)=>{

    if(value){
        if(value.agencyRake < 0){
            return true
        } else if (Fn.isNull(ii.rakeback,0) || Fn.isNull(value.playerRake,0)){
            return true
        } else {
            return false
        }
    } else {
        return false
    }

}

  export const isNull =(i,ii)=>{
    if( i == '' || i == null || i == undefined || (ii == 0 ? i == 0 || isNaN(i) : null) ){
      return true
    } else {
      return false
    }
  }

  export const numLimit =(inumber, maxValue)=>{
    if (number > maxValue) {
      number = maxValue;
    }
    return number;
  }

  export const  isImage=(i)=>{
    const str = i.endsWith('.jpeg') || i.endsWith('.jpg') || i.endsWith('.png') ? true : false
    return str;
  }

  export const  byImage=(i,ii)=>{
    const str = i.endsWith('.jpeg') || i.endsWith('.jpg') || i.endsWith('.png') ? i : ii
    return str;
  }

  export const textCapital = (i) => {
    const num = i.replace(/[^a-zA-Z0-9!?#-_.]/g, '');
    return num.charAt(0).toUpperCase() + num.slice(1).toUpperCase();
  };

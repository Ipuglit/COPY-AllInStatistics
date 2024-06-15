export const NotFound = (i) => {
    if(i == "NOTFOUND"){
        window.location.replace("/login"); 
        window.location.href = "/login";
    }
  }

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

export const wordNoSpace = (i) => {
    const num = i.replace(/[^a-zA-Z0-9!?#-_.]/g, ''); // Replace any character that is not a digit with an empty string
    if (num.key == 'e' || num.key == 'E') {
      num.preventDefault();
    }
    return num
  }
export const wordTitled = (i) => {
  const num = i.replace(/[^a-zA-Z0-9!&. ]/g, '').replace(/\s{2,}/g, ' ').toUpperCase()
  return num
}


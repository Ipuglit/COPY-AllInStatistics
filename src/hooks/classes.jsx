import { Padding } from "@mui/icons-material"
import { InputAdornment,Chip } from '@mui/material';
import { Icon } from '@iconify/react';

export const inputDate =(base,label)=>{
    return {      
                    container: {
                    display: 'flex',
                    flexWrap: 'wrap',
                    },
                    textField: {
                    marginLeft: 1,
                    marginRight: 1,
                    width: 150,
                    },
                    '& .MuiInputLabel-root': { // Target label
                        fontSize: label+'px',
                        fontWeight: 'bold', // Set label weight
                        
                    },
                    '& .MuiInputBase-input': { 
                    fontSize: base+'px', 
                    //color: 'purple'
                    },
                    '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: 'violet', // change this value to whatever color you need
                        },
                    },
            }

}
                
export const inputResizing =(base,label,mbase,mlabel,labelcolor,centered)=>{
    return {
                    '& .MuiInputLabel-root': { // Target label
                        fontSize: label+'px',
                        fontWeight: 'bold', // Set label weight
                        color: labelcolor ? labelcolor : '',
                        '@media (max-width: 600px)': { // Media query for mobile screens
                            fontSize: mlabel+'px', // Font size for mobile
                          },
                    },
                        '& .MuiInputBase-input': { 
                        fontSize: base+'px', 
                        textAlign: centered ? centered : '',
                        '@media (max-width: 600px)': { // Media query for mobile screens
                            fontSize: mbase+'px', // Font size for mobile
                        },
                    },
                        '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: 'violet', // change this value to whatever color you need
                        },
                    },
                }

}

export const inputFormat =(base,label,labelcolor,centered)=>{
    return {
                    '& .MuiInputLabel-root': { // Target label
                        fontSize: label+'px',
                        fontWeight: 'bold', // Set label weight
                        color: labelcolor ? labelcolor : ''
                    },
                    '& .MuiInputBase-input': { 
                    fontSize: base+'px', 
                    textAlign: centered ? centered : '',
                    },
                    '& .MuiOutlinedInput-root': {
                        fontSize: label+'px',
                        '&.Mui-focused fieldset': {
                          borderColor: 'violet', // change this value to whatever color you need

                        },
                    },
                    '& label.Mui-focused': {
                        color: 'violet'
                      },
                }

}

export const labelResizing =(pc,mob,pcwid,mobwid)=>{
    return {
        fontSize: pc ? pc+'px' : '',
        minWidth: pcwid ? pcwid+'px' : '',
        '@media (max-width: 700px)': { // On Mobile
        fontSize: mob ? mob+'px' : '',
        minWidth: mobwid ? mobwid+'px' : '',
        },
    }
}

export const buttonClass =(i,ii)=>{
    if(i == 'contained'){
        return {
            backgroundColor: ii=='violet' ? '#9370db' : ii == 'red' ? '#d11919' : '#808080',
            color: 'white',
            '&:hover': {
              backgroundColor: ii=='violet' ? '#a88ce2' : ii == 'red' ? '#d63232' : '#a6a6a6',
            },
        }
    } if(i == 'outlined'){
        return {
            borderColor: ii=='violet' ? '#9370db' : ii == 'red' ? '#d11919' : '#808080',
            color: ii=='violet' ? '#9370db' : ii == 'red' ? '#d11919' : '#808080',
            '&:hover': {
              borderColor: ii=='violet' ? '#a88ce2' : ii == 'red' ? '#cc0000' : '#a6a6a6',
              color: ii=='violet' ? '#a88ce2' : ii == 'red' ? '#cc0000' : '#a6a6a6',
            },
        }
    }
}

export const TextCenter =          { '& .MuiInputBase-input': { textAlign: 'center', }, }

export const IconChip   =          { style: { textAlign: 'center',  },
                                startAdornment: (
                                <InputAdornment position="start">
                                    <Icon icon="mdi:poker-chip" />
                                </InputAdornment>
                                ),
                            }

export const IconPercent   =       {
                                style: { textAlign: 'center',  },
                                endAdornment: (
                                <InputAdornment position="end">
                                    <Icon icon="fa6-solid:percent" />
                                </InputAdornment>
                                ),
                            }

export const IconDollar   =       {
                                style: { textAlign: 'center',  },
                                startAdornment: (
                                <InputAdornment position="start">
                                    <Icon icon="bi:currency-dollar" />
                                </InputAdornment>
                                ),
                            }

export const IcoPlus   =       <Icon icon="mdi:poker-chip" />

export const BoxChip   = {fontSize:'10px', margin:'2px', height:'21px',borderRadius:'8%', '&:hover': { backgroundColor: '#a88ce2', cursor:'pointer' },}

export const BoxChipViolet   = {fontSize:'10px', margin:'2px', height:'21px',borderRadius:'8%',color: '#FFFFFF', backgroundColor: '#9370db', '&:hover': { backgroundColor: '#a88ce2', cursor:'pointer' },}


export const BoxChippy   =(type,size)=> {
    if(type == 'filled'){
        return {
                fontSize: size ? size+'px' : '10px', 
                margin:'2px', 
                borderRadius:'5%',
                color: '#FFFFFF', 
                backgroundColor: '#9370db', 
                '&:hover': { backgroundColor: '#a88ce2', cursor:'pointer' },
            }
    } else if(type == 'outlinedgray') {
        return {
                fontSize: size ? size+'px' : '10px', 
                margin:'2px', 
                borderRadius:'5%',
                border: '2px solid lightgray',
                color: 'lightgray', 
                //backgroundColor: '#9370db', 
                '&:hover': {  border: '2px solid #a88ce2', color: '#a88ce2', },
            }
    } else {

        return {
                fontSize: size ? size+'px' : '10px', 
                margin:'2px', 
                borderRadius:'5%',
                border: '2px solid #9370db',
                color: '#9370db', 
                //backgroundColor: '#9370db', 
                '&:hover': {  cursor:'pointer',border: '2px solid #a88ce2', color: '#a88ce2', },
            }
    }
   
}



export const RawDefault = {
                                FOR:            "ALL",
                                SEARCH:         "ALL",
                                STATUS:         'ALL',
                                APP:            'ALL',
                                CLUB:           'ALL',
                                ACCOUNT:        'ALL',
                                USER:           'ALL',
                                ROLE:           'ALL',
                                DATETYPE:       'ALL',
                                DATECOUNT:      'ALL',
                                DATEFROM:       'ALL',
                                DATEUNTIL:      'ALL',
                                IFZERO:         'ALL',

                            }


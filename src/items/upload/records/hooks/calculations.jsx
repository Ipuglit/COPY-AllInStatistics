// -------------------- ** ++ -__- ++ ** -------------------- COVERSIONS

const Num = (i,e) => {

    const num = String(i).replace(/[^0-9.]/g, ''); // Replace any character that is not a number

    if ( num.includes('.') && /\d(?=\.)/.test(num) ) {

        const fix       = parseFloat(num).toFixed(e ? e : 2)
        const fixs      = fix.split('.')[0] + '.' + fix.split('.')[1].slice(0, e ? e : 2);
        const fixed     = fixs.replace(/\.0+$/, '');

        return parseFloat(fixed)

    } else {
        return num
    }
}

const Usd = (i,e) => {
    return Num(i) * Num(e) 
}

const Percent = (i) => {
    return Num(i)/100 
}

const Percentage = (percent,total) => {
    if(percent != 0 || percent != null){
        const num = ( Num(percent) / Num(total != 0 || total != undefined || total != null || total != '' ? total : 100) ) * 100;
        return num.toFixed(2)
    } else {
        return 0
    }

}

// -------------------- ** ++ -__- ++ ** -------------------- CALCULATIONS

const ADD = (i) => {

    const n = i.filter(item => {
        const num = Num(item);
        return !isNaN(num);
    });

    const num = n.map(parseFloat);

    return num.reduce((a, b) => a + b, 0);

}

const FxUSD = (i,ii) => {
    return parseFloat(i*ii).toFixed(2)

}

const ADD_WINLOSS = (i) => {

    const n = i.filter(item => {
        const num = parseFloat(item);
        return !isNaN(num);
    });

    const num = n.map(parseFloat);

    const positiveNumbers = num.filter(x => x >= 0);
    const negativeNumbers = num.filter(x => x < 0);

    const resulted = ADD(positiveNumbers) > ADD(negativeNumbers) ? 'WIN' : 'LOSS'

    return { positives: positiveNumbers, negatives: negativeNumbers, result: resulted };

}



// -------------------- ** ++ -__- ++ ** -------------------- EXPORTATION

export const Compute = (e) => {

    var calc     = 0
    const i     = e.values

    const sum_total_WinLossBon = ADD([
                                        i.WINLOSS_TOTAL,
                                        i.BONUS_TOTAL,
                                    ])

    const sum_total_WinLoss = ADD([ 
                                        i.WINLOSS_SIX,
                                        i.WINLOSS_FLH,
                                        i.WINLOSS_FLOHI,
                                        i.WINLOSS_FLOHILO,
                                        i.WINLOSS_MIXED,
                                        i.WINLOSS_MTT,
                                        i.WINLOSS_NLH,
                                        i.WINLOSS_OFC,
                                        i.WINLOSS_PLOHI,
                                        i.WINLOSS_PLOHILO,
                                        i.WINLOSS_SNG,
                                        i.WINLOSS_SPIN,
                                        i.WINLOSS_OTHERS,
                                    ])

    const sum_total_Bonus     = ADD([ 
                                        i.BONUS_SIX,
                                        i.BONUS_FLH,
                                        i.BONUS_FLOHI,
                                        i.BONUS_FLOHILO,
                                        i.BONUS_MIXED,
                                        i.BONUS_MTT,
                                        i.BONUS_NLH,
                                        i.BONUS_OFC,
                                        i.BONUS_PLOHI,
                                        i.BONUS_PLOHILO,
                                        i.BONUS_SNG,
                                        i.BONUS_SPIN,
                                        i.BONUS_OTHERS,
                                    ])

    const sum_WinLoss_All     = ADD_WINLOSS([ 
                                        i.WINLOSS_NLH,
                                        i.WINLOSS_FLH,
                                        i.WINLOSS_SIX,
                                        i.WINLOSS_PLOHI,
                                        i.WINLOSS_PLOHILO,
                                        i.WINLOSS_FLOHI,
                                        i.WINLOSS_FLOHILO,
                                        i.WINLOSS_MIXED,
                                        i.WINLOSS_MTT,
                                        i.WINLOSS_SNG,
                                        i.WINLOSS_SPIN,
                                        i.WINLOSS_OTHERS,
                                    ])

    if(e.what == 'Total_WinLossBonus'){

        calc = {base: sum_total_WinLossBon, usd: FxUSD(sum_total_WinLossBon,i.FXUSD)}

    } else if(e.what == 'Total_WinLoss'){

        calc = {base: sum_total_WinLoss, usd: FxUSD(sum_total_WinLoss,i.FXUSD)}
    
    } else if(e.what == 'Total_Bonus'){

        calc = {base: sum_total_Bonus, usd: FxUSD(sum_total_Bonus,i.FXUSD)}

    } else if(e.what == 'Assorting_WinLoss'){

        calc = sum_WinLoss_All

    } else if(e.what == 'Upline_BonusRake'){

        const inPercent = Percentage(i.UPLINEPERCENT,i.BONUS_TOTAL)
        calc            = {base: inPercent, usd: FxUSD(inPercent,i.FXUSD)}

    } else if(e.what == 'Agency_BonusRake'){

        const inPercent = Percentage(i.CLUBPERCENT,i.BONUS_TOTAL)
        calc            = {base: inPercent, usd: FxUSD(inPercent,i.FXUSD)}

    } else if(e.what == 'Agency_Action'){

        const inPercent = parseFloat(sum_total_WinLossBon*i.FXUSD).toFixed(2)
        calc            = {base: inPercent, usd: FxUSD(inPercent,i.FXUSD)}

    }

    return calc


}

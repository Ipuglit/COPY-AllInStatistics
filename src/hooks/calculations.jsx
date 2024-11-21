import * as Fnc from 'src/hooks/functions'
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

    if( !Fnc.isNull(percent,'Num') ){
        const num = ( Num(percent) / Num( !Fnc.isNull(total,'Num') ? total : 100) ) * 100;
        return num.toFixed(2)
    } else {
        return 0
    }

}

// -------------------- ** ++ -__- ++ ** -------------------- CALCULATIONS

const Adds = (i) => {

    const n = i.filter(item => {
        const num = Num(item);
        return !isNaN(num);
    });

    const num = n.map(parseFloat);
    
    return num.reduce((a, b) => a + b, 0);

}

const Multiplies = (i) => {

    const n = i.filter(item => {
        const num = Num(item);
        return !isNaN(num);
    });

    const num = n.map(parseFloat);
    
    return num.reduce((a, b) => a * b, 0);

}

const FxUSD = (i,ii) => {
    return parseFloat(i*ii).toFixed(2)

}

const PositiveNegative = (i) => {

    const n = i.filter(item => {
        const num = parseFloat(item);
        return !isNaN(num);
    });

    const num = n.map(parseFloat);

    const positiveNumbers = num.filter(x => x >= 0);
    const negativeNumbers = num.filter(x => x < 0);

    const resulted = Adds(positiveNumbers) > Adds(negativeNumbers) ? 'WIN' : 'LOSS'

    return { positives: positiveNumbers, negatives: negativeNumbers, result: resulted };

}


const Total_WL_Usd = (i) => {
    
}


const Total_WL_Percent = (i) => {
    
}


const Total_Bonus = (i) => {
    
}

const Total_Bonus_Usd = (i) => {
    
}

// ================================== *_* ==================================
export const RakeAgency = (percent,bonus,usd) => {
    const conv = Percentage(percent,bonus)
    return {base: conv, usd: FxUSD(conv,usd)}
}

export const RakeUpline = (upline,club,winloss,bonus,usd) => {
    const clubBase = Percentage(club,bonus)
    const adding   = parseFloat(winloss) + parseFloat(clubBase)
    const multiply = adding * usd * Percent(upline)
    const val      = Fnc.NumForce(multiply)
    return {base: val, usd: FxUSD(val,usd)}
}



// ================================== *_* ==================================
// ================================== *_* ==================================

export const Compute = (e) => {

    var cal     = 0
    const i     = e.values

    const sum_total_WinLossBon = Adds([
                                        i.WINLOSS_TOTAL,
                                        i.BONUS_TOTAL,
                                    ])
    const sum_total_WinLoss = Adds([ 
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
    const sum_total_Bonus     = Adds([ 
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
    const sum_WinLoss_PN     = PositiveNegative([ 
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

        cal = {base: sum_total_WinLossBon, usd: FxUSD(sum_total_WinLossBon,i.FXUSD)}

    } else if(e.what == 'Total_WinLoss'){

        cal = {base: sum_total_WinLoss, usd: FxUSD(sum_total_WinLoss,i.FXUSD)}
    
    } else if(e.what == 'Total_Bonus'){

        cal = {base: sum_total_Bonus, usd: FxUSD(sum_total_Bonus,i.FXUSD)}

    } else if(e.what == 'Assorting_WinLoss'){
        cal = sum_WinLoss_PN
    } else if(e.what == 'Upline_BonusRake'){

        const addCals   = Percentage(i.UPLINEPERCENT,i.BONUS_TOTAL)

        cal             = {base: addCals, usd: FxUSD(addCals,i.FXUSD)}

    } else if(e.what == 'Agency_BonusRake'){

        const addCals = Percentage(i.CLUBPERCENT,i.BONUS_TOTAL)

        cal             = {base: addCals, usd: FxUSD(addCals,i.FXUSD)}

    } else if(e.what == 'Agency_Action'){

        const addCals = Multiplies(sum_total_WinLossBon,i.FXUSD)

        cal             = {base: addCals, usd: FxUSD(addCals,i.FXUSD)}

    }

    return cal


}

export const convertDATA = (i,ii) => {

    const renamedArr = i.map(({ 
                                dateOpen,
                                dateClose,
                                appID, 
                                appName, 
                                clubID, 
                                clubName, 
                                uplineRake,
                                playerID,
                                playerName,
                                uplineID,
                                uplineName,
                                agencyRake,
                                fxCurrency,
                                fxUSD,
                                fxDate,
                                fxProvider,
                                winlossNLH,
                                winlossFLH,
                                winlossSIX,
                                winlossPLOHI,
                                winlossPLOHILO,
                                winlossFLOHI,
                                winlossFLOHILO,
                                winlossMIXED,
                                winlossOFC,
                                winlossMTT,
                                winlossSNG,
                                winlossSPIN,
                                winlossOTHERWINLOSS,
                                sumWinLoss,
                                sumWin,
                                sumLoss,
                                bonusNLH,
                                bonusFLH,
                                bonusSIX,
                                bonusPLOHI,
                                bonusPLOHILO,
                                bonusFLOHI,
                                bonusFLOHILO,
                                bonusMIXED,
                                bonusOFC,
                                bonusMTT,
                                bonusSNG,
                                bonusSPIN,
                                bonusOTHERBONUS,
                                sumBonus,
                                stated,
                                increment,
                                id,
                                playerUserName,
                                ...rest }) => ({
      DATEOPENNED:          dateOpen,
      DATECLOSED:           dateClose,
      APPID:                Fnc.NumForce(appID),
      APPNAME:              appName,
      CLUBIDD:              clubID,
      CLUB:                 clubName,
      CLUBPERCENT:          Fnc.NumForce(uplineRake),
      PLAYERID:             playerID,
      PLAYERNAME:           playerName,
      PLAYERUSER:           playerUserName,
      PLAYERAPPID:          appID,
      UPLINEID:             uplineID,
      UPLINENAME:           uplineName,
      UPLINEPERCENT:        Fnc.NumForce(agencyRake),
      FXCURRENCY:           fxCurrency,
      FXUSD:                Fnc.NumForce(fxUSD),
      FXDATE:               fxDate,
      FXPROVIDER:           fxProvider,
      WINLOSS_NLH:           winlossNLH,
      WINLOSS_FLH:           winlossFLH,
      WINLOSS_SIX:           winlossSIX,
      WINLOSS_PLOHI:         winlossPLOHI,
      WINLOSS_PLOHILO:       winlossPLOHILO,
      WINLOSS_FLOHI:         winlossFLOHI,
      WINLOSS_FLOHILO:       winlossFLOHILO,
      WINLOSS_MIXED:         winlossMIXED,
      WINLOSS_OFC:           winlossOFC,
      WINLOSS_MTT:           winlossMTT,
      WINLOSS_SNG:           winlossSNG,
      WINLOSS_SPIN:          winlossSPIN,
      WINLOSS_OTHERS:        winlossOTHERWINLOSS,
      WINLOSS_TOTAL:         sumWinLoss,
      WINLOSS_WIN:           sumWin,
      WINLOSS_LOSS:          sumLoss,
      BONUS_NLH:             bonusNLH,
      BONUS_FLH:             bonusFLH,
      BONUS_SIX:             bonusSIX,
      BONUS_PLOHI:           bonusPLOHI,
      BONUS_PLOHILO:         bonusPLOHILO,
      BONUS_FLOHI:           bonusFLOHI,
      BONUS_FLOHILO:         bonusFLOHILO,
      BONUS_MIXED:           bonusMIXED,
      BONUS_OFC:             bonusOFC,
      BONUS_MTT:             bonusMTT,
      BONUS_SNG:             bonusSNG,
      BONUS_SPIN:            bonusSPIN,
      BONUS_OTHERS:          bonusOTHERBONUS,
      BONUS_TOTAL:           sumBonus,
      STATED:                stated,
      ROW:                   increment,
      ID:                    Fnc.NumForce(id),
      ...rest,
      RECORD:               ii,
    }));

    return renamedArr

  };

import React, { useState, useEffect } from 'react';
import * as math from 'mathjs';
import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'


export function Calculate(i,form) {

    let bonus           = i?.bonus ? Fnc.numCheck(i.bonus)                          : 0
    let points          = i?.points ? Fnc.numCheck(i.points)                        : 0
    let pointsWin       = i?.pointsWin ? Fnc.numCheck(i.pointsWin)                  : 0
    let pointsLoss      = i?.pointsLoss ? Fnc.numCheck(i.pointsLoss)                : 0

    let rakeback        = i?.rakeback ? Fnc.numCheck(i.rakeback) / 100              : 0
    let rebate          = i?.rebate ? Fnc.numCheck(i.rebate) / 100                  : 0
    let chiprate        = i?.chiprate ? Fnc.numCheck(i.chiprate)                    : 0
    let fxUSD           = i?.fxCurrency != 'USD' ? Fnc.numCheck( !Fnc.isNull(i.fxUSD,0) ? i.fxUSD : 1)            : 1

    let playerChip      = i?.playerChip ? Fnc.numCheck(i.playerChip)                : 0
    let uplineChip      = i?.uplineChip ? Fnc.numCheck(i.uplineChip)                : 0
    let agencyChip      = i?.agencyChip ? Fnc.numCheck(i.agencyChip)                : 0
    let downlineChip    = i?.downlineChip ? Fnc.numCheck(i.downlineChip)            : 0

    let playerRebate    = i?.playerRebate ? Fnc.numCheck(i.playerRebate) / 100       : 0
    let uplineRebate    = i?.uplineRebate ? Fnc.numCheck(i.uplineRebate) / 100       : 0
    let agencyRebate    = i?.agencyRebate ? Fnc.numCheck(i.agencyRebate) / 100       : 0
    let downlineRebate  = i?.downlineRebate ? Fnc.numCheck(i.downlineRebate) / 100   : 0

    let playerRake      = i?.playerRake ? Fnc.numCheck(i.playerRake) / 100           : 0
    let uplineRake      = i?.uplineRake ? Fnc.numCheck(i.uplineRake) / 100           : 0
    let agencyRake      = i?.agencyRake ? Fnc.numCheck(i.agencyRake) / 100           : 0
    let downlineRake    = i?.downlineRake ? Fnc.numCheck(i.downlineRake) / 100       : 0

    let valueA          = i?.valueA ? Fnc.numCheck(i.valueA) / 100                   : 0
    let valueB          = i?.valueB ? Fnc.numCheck(i.valueB) / 100                   : 0

    const forming = !Fnc.isNull(form) ? form : ''

    const e = forming.replaceAll('POINTS', points)
                    .replaceAll('WINLOSS', points)
                    .replaceAll('WINNINGS', pointsWin)
                    .replaceAll('LOSSES', pointsLoss)
                    .replaceAll(new RegExp(`\\b${'TOTALPOINTS'}\\b`, 'g'), points)
                    .replaceAll(new RegExp(`\\b${'POINTSWIN'}\\b`, 'g'), pointsWin)
                    .replaceAll(new RegExp(`\\b${'POINTSLOSS'}\\b`, 'g'), pointsLoss)
                    .replaceAll(new RegExp(`\\b${'BONUS'}\\b`, 'g'), bonus)
                    .replaceAll(new RegExp(`\\b${'TOTALBONUS'}\\b`, 'g'), bonus)
                    .replaceAll(new RegExp(`\\b${'RAKEBACK'}\\b`, 'g'), rakeback)
                    .replaceAll('REBATE', rebate)
                    .replaceAll(new RegExp(`\\b${'CHIPRATE'}\\b`, 'g'), chiprate)
                    .replaceAll('FXUSD', fxUSD)
                    .replaceAll(new RegExp(`\\b${'USD'}\\b`, 'g'), fxUSD)
                    .replaceAll(new RegExp(`\\b${'PLAYERCHIPRATE'}\\b`, 'g'), playerChip)
                    .replaceAll(new RegExp(`\\b${'PLAYERCHIP'}\\b`, 'g'), playerChip)
                    .replaceAll('PLAYER CHIP RATE', playerChip)
                    .replaceAll(new RegExp(`\\b${'UPLINECHIPCUT'}\\b`, 'g'), uplineChip)
                    .replaceAll(new RegExp(`\\b${'UPLINECHIP'}\\b`, 'g'), uplineChip)
                    .replaceAll('UPLINE CHIP CUT', uplineChip)
                    .replaceAll(new RegExp(`\\b${'AGENCYCHIPCUT'}\\b`, 'g'), agencyChip)
                    .replaceAll(new RegExp(`\\b${'AGENCYCHIP'}\\b`, 'g'), agencyChip)
                    .replaceAll('AGENCY CHIP CUT', agencyChip)
                    .replaceAll(new RegExp(`\\b${'DOWNLINECHIPCUT'}\\b`, 'g'), downlineChip)
                    .replaceAll(new RegExp(`\\b${'DOWNLINECHIP'}\\b`, 'g'), downlineChip)
                    .replaceAll('DOWNLINE CHIP CUT', downlineChip)
                    .replaceAll('PLAYERRAKEBACK', playerRake)
                    .replaceAll('UPLINERAKEBACK', uplineRake)
                    .replaceAll('AGENCYRAKEBACK', agencyRake)
                    .replaceAll('DOWNLINERAKEBACK', downlineRake)
                    .replaceAll(new RegExp(`\\b${'PLAYERRAKE'}\\b`, 'g'), playerRake)
                    .replaceAll(new RegExp(`\\b${'UPLINERAKE'}\\b`, 'g'), uplineRake)
                    .replaceAll(new RegExp(`\\b${'AGENCYRAKE'}\\b`, 'g'), agencyRake)
                    .replaceAll(new RegExp(`\\b${'DOWNLINERAKE'}\\b`, 'g'), downlineRake)
                    .replaceAll(new RegExp(`\\b${'PLAYER RAKE'}\\b`, 'g'), playerRake)
                    .replaceAll(new RegExp(`\\b${'UPLINE RAKE'}\\b`, 'g'), uplineRake)
                    .replaceAll(new RegExp(`\\b${'AGENCY RAKE'}\\b`, 'g'), agencyRake)
                    .replaceAll(new RegExp(`\\b${'DOWNLINE RAKE'}\\b`, 'g'), downlineRake)
                    .replaceAll(new RegExp(`\\b${'PLAYERREBATE'}\\b`, 'g'), playerRebate)
                    .replaceAll(new RegExp(`\\b${'UPLINEREBATE'}\\b`, 'g'), uplineRebate)
                    .replaceAll(new RegExp(`\\b${'AGENCYREBATE'}\\b`, 'g'), agencyRebate)
                    .replaceAll(new RegExp(`\\b${'DOWNLINEREBATE'}\\b`, 'g'), downlineRebate)
                    .replaceAll(new RegExp(`\\b${'PLAYER REBATE'}\\b`, 'g'), playerRebate)
                    .replaceAll(new RegExp(`\\b${'UPLINE REBATE'}\\b`, 'g'), uplineRebate)
                    .replaceAll(new RegExp(`\\b${'AGENCY REBATE'}\\b`, 'g'), agencyRebate)
                    .replaceAll(new RegExp(`\\b${'DOWNLINE REBATE'}\\b`, 'g'), downlineRebate)
                    .replaceAll('VALUEA', valueA)
                    .replaceAll('VALUEB', valueB)
                    .replaceAll('OTHERA', valueA)
                    .replaceAll('OTHERB', valueB)
                    .replaceAll('PLUS', '+')
                    .replaceAll('ADD', '+')
                    .replaceAll('ADDED', '+')
                    .replaceAll('ADDED TO', '+')
                    .replaceAll('SUBTRACT', '-')
                    .replaceAll('MINUS', '-')
                    .replaceAll('DEDUCT', '-')
                    .replaceAll('DEDUCTED', '-')
                    .replaceAll('MULTIPLY', '*')
                    .replaceAll('MULTIPLIED BY', '*')
                    .replaceAll('DIVIDE', '/')

    try {
        const result = eval(e).toFixed(2);
        return({result : result, formula: forming, operation: e});
    } catch (error) {
        return({result : '0', formula: 'Invalid', operation: 'Invalid'});
    }
    
}

import * as Fn from './functions'
import * as Fnc from 'src/hooks/functions'

export const CalculateValues =(i)=>{
        return {
                bonus:        i?.BONUS_TOTAL,
                points:       i?.WINLOSS_TOTAL,
                pointsWin:    i?.WINLOSS_WIN,
                pointsLoss:   i?.WINLOSS_LOSS,

                rakeback:     i?.RAKEBACK,
                rebate:       i?.REBATE,
                chiprate:     i?.CHIPRATE == 0 ? 1 : i?.CHIPRATE,
                fxCurrency:   /^[A-Za-z]+$/.test(i?.FXCURRENCY) ? i?.FXCURRENCY : 'USD',
                fxUSD:        Fnc.numCheck(i?.FXCURRENCY == 'USD' ? 1 : (i?.FXUSD > 0 ? i?.FXUSD : 1)),

                playerRake:   i?.PLAYERRAKE,
                uplineRake:   i?.UPLINERAKE,
                agencyRake:   i?.AGENCYRAKE,
                downlineRake: i?.DOWNLINERAKE,

                playerRebate: i?.PLAYERREBATE,
                uplineRebate: i?.UPLINEREBATE,
                agencyRebate: i?.AGENCYREBATE,
                downlineRebate: i?.DOWNLINEREBATE,

                playerChip:   i?.PLAYERCHIP,
                uplineChip:   i?.UPLINECHIP,
                agencyChip:   i?.AGENCYCHIP,
                downlineChip: i?.DOWNLINECHIP,
              }
}

export const toCalculate =(i)=>{
        return {
                bonus:          i?.BONUS_TOTAL,
                points:         i?.POINTS_TOTAL,
                pointsWin:      i?.POINTS_WIN,
                pointsLoss:     i?.POINTS_LOSS,

                rakeback:       i?.RAKEBACK,
                rebate:         i?.REBATE,
                chiprate:       i?.CHIPRATE,
                fxCurrency:     /^[A-Za-z]+$/.test(i?.FXCURRENCY) ? i?.FXCURRENCY : 'USD',
                fxUSD:          Fnc.numCheck(i?.FXCURRENCY == 'USD' ? 1 : (i?.FXUSD > 0 ? i?.FXUSD : 1)),

                playerRake:     i?.PLAYERRAKE,
                uplineRake:     i?.UPLINERAKE,
                agencyRake:     i?.AGENCYRAKE,
                downlineRake:   i?.DOWNLINERAKE,

                playerRebate:   i?.PLAYERREBATE,
                uplineRebate:   i?.UPLINEREBATE,
                agencyRebate:   i?.AGENCYREBATE,
                downlineRebate: i?.DOWNLINEREBATE,

                playerChip:     i?.PLAYERCHIP,
                uplineChip:     i?.UPLINECHIP,
                agencyChip:     i?.AGENCYCHIP,
                downlineChip:   i?.DOWNLINECHIP,
              }
}

export const Default_Values = {        

                                ID:               0,   
                                DATEOPENNED:      '',         
                                DATECLOSED:       '', 
                                DATESTART:        'SUNDAY',
                                DATESUB:          '',  
                                
                                CLUBID:          0,
                                CLUBNAME:         '',
                                CLUBSUB:           '',

                                APPID:            '',
                                APPNAME:          '',

                                PLAYERID:         0,
                                PLAYERAPPID:      '',
                                PLAYERNICK:       '',
                                PLAYERUSERID:     0,
                                PLAYERUSERNICK:   '',
                                PLAYERUSERNAME:   '',
                                PLAYERRAKE:       0,
                                PLAYERCHIP:       0,
                                PLAYERREBATE:     0,
                                PLAYERSUB:        '',

                                UPLINEID:         0,
                                UPLINEAPPID:      '',
                                UPLINENICK:       '',
                                UPLINEUSERID:     0,
                                UPLINEUSERNICK:   '',
                                UPLINEUSERNAME:   '',
                                UPLINERAKE:       0,
                                UPLINECHIP:       0,
                                UPLINEREBATE:     0,
                                UPLINESUB:              '',

                                AGENCYID:         0,
                                AGENCYAPPID:      '',
                                AGENCYNICK:       '',
                                AGENCYUSERID:     0,
                                AGENCYUSERNICK:   '',
                                AGENCYUSERNAME:   '',
                                AGENCYRAKE:       0,
                                AGENCYCHIP:       0,
                                AGENCYREBATE:     0,
                                AGENCYSUB:      '',

                                DOWNLINEID:       0,
                                DOWNLINEAPPID:    '',
                                DOWNLINENICK:     '',
                                DOWNLINEUSERID:   0,
                                DOWNLINEUSERNICK: '',
                                DOWNLINEUSERNAME: '',
                                DOWNLINERAKE:     0,
                                DOWNLINECHIP:     0,
                                DOWNLINEREBATE:   0,
                                DOWNLINESUB:    '',

                                FXCURRENCY:       'USD',
                                FXUSD:            1,
                                FXDATE:           '',
                                FXPROVIDER:       'xe.com',
                                FXSUB:            '',

                                RAKEBACK:          0,
                                REBATE:            0,
                                CHIPRATE:          0,

                                FORMULA_AGENCYACTIONID:      2,
                                FORMULA_AGENCYBONUSID:       1,
                                FORMULA_PLAYERRESULTID:      3,

                                FORMULA_AGENCYACTION:      '',
                                FORMULA_AGENCYBONUS:       '',
                                FORMULA_PLAYERRESULT:      '',
                                FORMULA_BONUSPERCENT:      '',
                                FORMULA_RESULT:            '',
                                FORMULA_REMARKS:           '',

                                FORMULA_AGENCYACTIONNAME:      'STANDARD',
                                FORMULA_AGENCYBONUSNAME:       'STANDARD',
                                FORMULA_PLAYERRESULTNAME:      'STANDARD',
                                FORMULA_BONUSPERCENTNAME:      'STANDARD',
                                FORMULA_RESULTNAME:            'STANDARD',

                                FORMULA_AGENCYACTIONOPERATION:      '',
                                FORMULA_AGENCYBONUSOPERATION:       '',
                                FORMULA_PLAYERRESULTOPERATION:      '',
                                FORMULA_BONUSPERCENTOPERATION:      '',
                                FORMULA_RESULTOPERATION:            '',

                                RESULT_AGENCYACTION:      '',
                                RESULT_AGENCYBONUS:       '',
                                RESULT_PLAYERRESULT:      '',
                                RESULT_BONUSPERCENT:      '',
                                RESULT_RESULT:            '',
                                
                                OVERRIDE_AGENCYACTION:    false,
                                OVERRIDE_AGENCYBONUS:     false,
                                OVERRIDE_AGENCYACTIONVALUE:    '0',
                                OVERRIDE_AGENCYBONUSVALUE:     '0',

                                BONUS_SIX:        0,
                                BONUS_FLH:        0,
                                BONUS_FLOHI:      0,
                                BONUS_FLOHILO:    0,
                                BONUS_MIXED:      0,
                                BONUS_MTT:        0,
                                BONUS_NLH:        0,
                                BONUS_OFC:        0,
                                BONUS_PLOHI:      0,
                                BONUS_PLOHILO:    0,
                                BONUS_SNG:        0,
                                BONUS_SPIN:       0,
                                BONUS_OTHERS:      0,
                                BONUS_TOTAL:      0,
                                
                                POINTS_SIX:      0,
                                POINTS_FLH:      0,
                                POINTS_FLOHI:    0,
                                POINTS_FLOHILO:  0,
                                POINTS_MIXED:    0,
                                POINTS_MTT:      0,
                                POINTS_NLH:      0,
                                POINTS_OFC:      0,
                                POINTS_PLOHI:    0,
                                POINTS_PLOHILO:  0,
                                POINTS_SNG:      0,
                                POINTS_SPIN:     0,
                                POINTS_OTHERS:    0,
                                POINTS_TOTAL:    0,

                                POINTS_WIN:      0,
                                POINTS_LOSS:     0,

                                ID_PLAYERDEAL: 0,
                                ID_FORMULA: 0,


                                REMARKS:          '',
                                RECORD:          'NEW',
                        }



export const Default_Value = {        

                                ID:               0,   
                                DATEOPENNED:      '',         
                                DATECLOSED:       '', 
                                DATESTART:        'SUNDAY',
                                DATESUB:          '',  
                                
                                CLUBID:          0,
                                CLUBNAME:         '',
                                CLUBSUB:           '',

                                APPID:            '',
                                APPNAME:          '',

                                PLAYERID:         0,
                                PLAYERAPPID:      '',
                                PLAYERNICK:       '',
                                PLAYERUSERID:     0,
                                PLAYERUSERNICK:   '',
                                PLAYERUSERNAME:   '',
                                PLAYERRAKE:       0,
                                PLAYERCHIP:       0,
                                PLAYERREBATE:     0,
                                PLAYERSUB:        '',

                                UPLINEID:         0,
                                UPLINEAPPID:      '',
                                UPLINENICK:       '',
                                UPLINEUSERID:     0,
                                UPLINEUSERNICK:   '',
                                UPLINEUSERNAME:   '',
                                UPLINERAKE:       0,
                                UPLINECHIP:       0,
                                UPLINEREBATE:     0,
                                UPLINESUB:              '',

                                AGENCYID:         0,
                                AGENCYAPPID:      '',
                                AGENCYNICK:       '',
                                AGENCYUSERID:     0,
                                AGENCYUSERNICK:   '',
                                AGENCYUSERNAME:   '',
                                AGENCYRAKE:       0,
                                AGENCYCHIP:       0,
                                AGENCYREBATE:     0,
                                AGENCYSUB:      '',

                                DOWNLINEID:       0,
                                DOWNLINEAPPID:    '',
                                DOWNLINENICK:     '',
                                DOWNLINEUSERID:   0,
                                DOWNLINEUSERNICK: '',
                                DOWNLINEUSERNAME: '',
                                DOWNLINERAKE:     0,
                                DOWNLINECHIP:     0,
                                DOWNLINEREBATE:   0,
                                DOWNLINESUB:    '',

                                FXCURRENCY:       'USD',
                                FXUSD:            1,
                                FXDATE:           '',
                                FXPROVIDER:       'xe.com',
                                FXSUB:            '',

                                RAKEBACK:          0,
                                REBATE:            0,
                                CHIPRATE:          0,

                                FORMULA_AGENCYACTION:      '',
                                FORMULA_AGENCYBONUS:       '',
                                FORMULA_PLAYERRESULT:      '',
                                FORMULA_BONUSPERCENT:      '',
                                FORMULA_RESULT:            '',
                                FORMULA_REMARKS:           '',
                                ID_FORMULA:                '0',
                                ID_PLAYERDEAL:             '0',

                                FORMNAME_AGENCYACTION:      'STANDARD',
                                FORMNAME_AGENCYBONUS:       'STANDARD',
                                FORMNAME_PLAYERRESULT:      'STANDARD',
                                FORMNAME_BONUSPERCENT:      'STANDARD',
                                FORMNAME_RESULT:            'STANDARD',

                                RESULT_AGENCYACTION:      '',
                                RESULT_AGENCYBONUS:       '',
                                RESULT_PLAYERRESULT:      '',
                                RESULT_BONUSPERCENT:      '',
                                RESULT_RESULT:            '',

                                BONUS_SIX:        0,
                                BONUS_FLH:        0,
                                BONUS_FLOHI:      0,
                                BONUS_FLOHILO:    0,
                                BONUS_MIXED:      0,
                                BONUS_MTT:        0,
                                BONUS_NLH:        0,
                                BONUS_OFC:        0,
                                BONUS_PLOHI:      0,
                                BONUS_PLOHILO:    0,
                                BONUS_SNG:        0,
                                BONUS_SPIN:       0,
                                BONUS_TOTAL:      0,
                                
                                WINLOSS_SIX:      0,
                                WINLOSS_FLH:      0,
                                WINLOSS_FLOHI:    0,
                                WINLOSS_FLOHILO:  0,
                                WINLOSS_MIXED:    0,
                                WINLOSS_MTT:      0,
                                WINLOSS_NLH:      0,
                                WINLOSS_OFC:      0,
                                WINLOSS_PLOHI:    0,
                                WINLOSS_PLOHILO:  0,
                                WINLOSS_SNG:      0,
                                WINLOSS_SPIN:     0,
                                WINLOSS_TOTAL:    0,

                                WINLOSS_WIN:      0,
                                WINLOSS_LOSS:     0,

                                REMARKS:          '',
                        }

export function FillEditing(i) {


        return i.map((e)=> {
                const sumPoints = [ Fn.numForce(e.winlossSIX), Fn.numForce(e.winlossFLH), Fn.numForce(e.winlossMTT), Fn.numForce(e.winlossNLH), Fn.numForce(e.winlossOFC), Fn.numForce(e.winlossSNG), Fn.numForce(e.winlossSPIN), Fn.numForce(e.winlossFLOHI), Fn.numForce(e.winlossMIXED), Fn.numForce(e.winlossPLOHI), Fn.numForce(e.winlossFLOHILO), Fn.numForce(e.winlossPLOHILO), Fn.numForce(e.winlossOTHERWINLOSS) ]
                const sumBonus  = [ Fn.numForce(e.bonusSIX), Fn.numForce(e.bonusFLH), Fn.numForce(e.bonusMTT), Fn.numForce(e.bonusNLH), Fn.numForce(e.bonusOFC), Fn.numForce(e.bonusSNG), Fn.numForce(e.bonusSPIN), Fn.numForce(e.bonusFLOHI), Fn.numForce(e.bonusMIXED), Fn.numForce(e.bonusPLOHI), Fn.numForce(e.bonusFLOHILO), Fn.numForce(e.bonusPLOHILO), Fn.numForce(e.bonusOTHERBONUS) ]
                return {
                        ID:                     e.id,
                        ROW:                    'M'+e.increment+'J',   
                        DATEOPENNED:            e.dateOpen,         
                        DATECLOSED:             e.dateClose, 
                        DATESTART:              '',
                        DATESUB:                '',  
                        
                        CLUBID:                 e.clubID,
                        CLUBNAME:               e.clubName,
                        CLUBSUB:                '',

                        APPID:                  e.appID,
                        APPNAME:                e.appName,

                        PLAYERID:               e.playerID,
                        PLAYERAPPID:            e.playerAppID,
                        PLAYERNICK:             e.playerNick,
                        PLAYERUSERID:           e.playerUserID,
                        PLAYERUSERNICK:         e.playerUserNick,
                        PLAYERUSERNAME:         e.playerUserName,
                        PLAYERRAKE:             e.playerRake,
                        PLAYERCHIP:             e.playerChiprate,
                        PLAYERREBATE:           e.playerRebate,
                        PLAYERSUB:              '',

                        UPLINEID:               e.uplineID,
                        UPLINEAPPID:            e.uplineAppID,
                        UPLINENICK:             e.uplineNick,
                        UPLINEUSERID:           e.uplineUserID,
                        UPLINEUSERNICK:         e.uplineUserNick,
                        UPLINEUSERNAME:         e.uplineUserName,
                        UPLINERAKE:             e.uplineRake,
                        UPLINECHIP:             e.uplineChiprate,
                        UPLINEREBATE:           e.uplineRebate,
                        UPLINESUB:              '',

                        AGENCYID:               e.agencyID,
                        AGENCYAPPID:            e.agencyAppID,
                        AGENCYNICK:             e.agencyNick,
                        AGENCYUSERID:           e.agencyUserID,
                        AGENCYUSERNICK:         e.agencyUserNick,
                        AGENCYUSERNAME:         e.agencyUserName,
                        AGENCYRAKE:             e.agencyRake,
                        AGENCYCHIP:             e.agencyChiprate,
                        AGENCYREBATE:           e.agencyRebate,
                        AGENCYSUB:              '',

                        DOWNLINEID:             e.downlineID,
                        DOWNLINEAPPID:          e.downlineAppID,
                        DOWNLINENICK:           e.downlineNick,
                        DOWNLINEUSERID:         e.downlineUserID,
                        DOWNLINEUSERNICK:       e.downlineUserNick,
                        DOWNLINEUSERNAME:       e.downlineUserName,
                        DOWNLINERAKE:           e.downlineRake,
                        DOWNLINECHIP:           e.downlineChiprate,
                        DOWNLINEREBATE:         e.downlineRebate,
                        DOWNLINESUB:            '',

                        FXCURRENCY:             e.fxCurrency,
                        FXUSD:                  e.fxUSD ? e.fxUSD : 1,
                        FXDATE:                 e.fxDate,
                        FXPROVIDER:             e.fxProvider,
                        FXSUB:                  '',

                        RAKEBACK:               e.rakeback,
                        REBATE:                 e.rebate,
                        CHIPRATE:               e.chiprate,

                        FORMULA_AGENCYACTIONID:      e.agencyactionID,
                        FORMULA_AGENCYBONUSID:       e.agencybonusID,
                        FORMULA_PLAYERRESULTID:      e.playerresultID,

                        FORMULA_AGENCYACTION:      e.agencyactionFormula,
                        FORMULA_AGENCYBONUS:       e.agencybonusFormula,
                        FORMULA_PLAYERRESULT:      e.playerresultFormula,
                        FORMULA_BONUSPERCENT:      e.bonuspercentFormula,
                        FORMULA_RESULT:            e.resultFormula,
                        FORMULA_REMARKS:           '',
                        ID_PLAYERDEAL:             e.playerDeal,

                        FORMNAME_AGENCYACTION:      e.agencyactionName,
                        FORMNAME_AGENCYBONUS:       e.agencybonusName,
                        FORMNAME_PLAYERRESULT:      e.playerresultName,
                        FORMNAME_BONUSPERCENT:      'STANDARD',
                        FORMNAME_RESULT:            'STANDARD',

                        BONUS_SIX:        e.bonusSIX,
                        BONUS_FLH:        e.bonusFLH,
                        BONUS_FLOHI:      e.bonusFLOHI,
                        BONUS_FLOHILO:    e.bonusFLOHILO,
                        BONUS_MIXED:      e.bonusMIXED,
                        BONUS_MTT:        e.bonusMTT,
                        BONUS_NLH:        e.bonusNLH,
                        BONUS_OFC:        e.bonusOFC,
                        BONUS_PLOHI:      e.bonusPLOHI,
                        BONUS_PLOHILO:    e.bonusPLOHILO,
                        BONUS_SNG:        e.bonusSNG,
                        BONUS_SPIN:       e.bonusSPIN,
                        BONUS_OTHERS:     e.bonusOTHERBONUS,
                        BONUS_TOTAL:      Fn.sumNumbers( sumBonus ),

                        WINLOSS_SIX:        e.winlossSIX,
                        WINLOSS_FLH:        e.winlossFLH,
                        WINLOSS_FLOHI:      e.winlossFLOHI,
                        WINLOSS_FLOHILO:    e.winlossFLOHILO,
                        WINLOSS_MIXED:      e.winlossMIXED,
                        WINLOSS_MTT:        e.winlossMTT,
                        WINLOSS_NLH:        e.winlossNLH,
                        WINLOSS_OFC:        e.winlossOFC,
                        WINLOSS_PLOHI:      e.winlossPLOHI,
                        WINLOSS_PLOHILO:    e.winlossPLOHILO,
                        WINLOSS_SNG:        e.winlossSNG,
                        WINLOSS_SPIN:       e.winlossSPIN,
                        WINLOSS_OTHERS:     e.winlossOTHERWINLOSS,
                        WINLOSS_WIN:        Fn.sumPositives( sumPoints ),
                        WINLOSS_LOSS:       Fn.sumNegatives( sumPoints ),
                        WINLOSS_TOTAL:      Fn.sumNumbers( sumPoints ),
                        REMARKS:            e.remarks, 
                        RECORD:             'OLD',
                        }
                                          
                                })


}
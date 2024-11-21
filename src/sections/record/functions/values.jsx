import * as Fn from './functions'
import * as Fnc from 'src/hooks/functions'

export const CalculateValues =(i)=>{
        return {
                bonus:        i?.BONUS_TOTAL,
                points:       i?.POINTS_TOTAL,
                pointsWin:    i?.POINTS_WIN,
                pointsLoss:   i?.POINTS_LOSS,

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


export const toModify =(x,index)=>{

                return x?.map((i,index)=>{
                        return {

                                ID:                                     i?.id > 0 ? i?.id : 0,
                                
                                ROW:                                    'M'+index+'J',
                
                                DATECLOSED:                             Fnc.dateDash(i?.dateClose),
                                DATEOPENNED:                            Fnc.dateDash(i?.dateOpen),
                                DATESUB:                                '',
                
                                CLUB:                                   i?.clubID,
                                CLUBID:                                 i?.clubID,
                                CLUBNAME:                               i?.clubName,
                                CLUBSUB:                                '',
                
                                APPID:                                  i?.appID,
                                APPNAME:                                i?.appName,
                
                                PLAYERID:                               i?.playerID,
                                PLAYERAPPID:                            i?.playerAppID,
                                PLAYERNICK:                             i?.playerNick,
                                PLAYERUSERID:                           i?.playerUserID,
                                PLAYERUSERNICK:                         i?.playerUserNick,
                                PLAYERUSERNAME:                         i?.playerUserName,
                                PLAYERRAKE:                             i?.playerRake,
                                PLAYERCHIP:                             i?.playerChiprate,
                                PLAYERREBATE:                           i?.playerRebate,
                                PLAYERSUB:                              '',
                
                                UPLINEID:                               i?.uplineID,
                                UPLINEAPPID:                            i?.uplineAppID,
                                UPLINENICK:                             i?.uplineNick,
                                UPLINEUSERID:                           i?.uplineUserID,
                                UPLINEUSERNICK:                         i?.uplineUserNick,
                                UPLINEUSERNAME:                         i?.uplineUserName,
                                UPLINERAKE:                             i?.uplineRake,
                                UPLINECHIP:                             i?.uplineChiprate,
                                UPLINEREBATE:                           i?.uplineRebate,
                                UPLINESUB:                              '',
                
                                AGENCYID:                               i?.agencyID,
                                AGENCYAPPID:                            i?.agencyAppID,
                                AGENCYNICK:                             i?.agencyNick,
                                AGENCYUSERID:                           i?.agencyUserID,
                                AGENCYUSERNICK:                         i?.agencyUserNick,
                                AGENCYUSERNAME:                         i?.agencyUserName,
                                AGENCYRAKE:                             i?.agencyRake,
                                AGENCYCHIP:                             i?.agencyChiprate,
                                AGENCYREBATE:                           i?.agencyRebate,
                                AGENCYSUB:                              '',
                
                                DOWNLINEID:                               i?.downlineID,
                                DOWNLINEAPPID:                            i?.downlineAppID,
                                DOWNLINENICK:                             i?.downlineNick,
                                DOWNLINEUSERID:                           i?.downlineUserID,
                                DOWNLINEUSERNICK:                         i?.downlineUserNick,
                                DOWNLINEUSERNAME:                         i?.downlineUserName,
                                DOWNLINERAKE:                             i?.downlineRake,
                                DOWNLINECHIP:                             i?.downlineChiprate,
                                DOWNLINEREBATE:                           i?.downlineRebate,
                                DOWNLINESUB:                              '',
                
                                ID_PLAYERDEAL:                                  i?.playerDeal,
                
                                RAKEBACK:                                       i?.rakeback,
                                REBATE:                                         i?.rebate,
                                CHIPRATE:                                       i?.chiprate,
                                REMARKS:                                        i?.remarks,
                
                                FXCURRENCY:                                     i?.fxCurrency,
                                FXDATE:                                         i?.fxDate,
                                FXPROVIDER:                                     i?.fxProvider,
                                FXUSD:                                          i?.fxUSD,
                
                                FORMULA_AGENCYACTION:                           i?.agencyactionFormula,
                                FORMULA_AGENCYACTIONID:                         i?.form_agencyActionID,
                                FORMULA_AGENCYACTIONNAME:                       i?.agencyactionName,
                
                                FORMULA_AGENCYBONUS:                            i?.agencybonusFormula,
                                FORMULA_AGENCYBONUSID:                          i?.form_agencyBonusID,
                                FORMULA_AGENCYBONUSNAME:                        i?.agencybonusName,
                
                                FORMULA_PLAYERRESULT:                           i?.playerresultFormula,
                                FORMULA_PLAYERRESULTID:                         i?.form_playerResultID,
                                FORMULA_PLAYERRESULTNAME:                       i?.playerresultName,
                
                                FORMULA_RESULT:                                 i?.agencyactionFormula,
                                FORMULA_RESULTID:                               i?.agencyactionID,
                                FORMULA_RESULTNAME:                             i?.agencyactionName,
                
                                FORMULA_BONUSPERCENT:                           i?.bonuspercentFormula,
                                FORMULA_BONUSPERCENTID:                         i?.bonuspercentID,
                                FORMULA_BONUSPERCENTNAME:                       i?.bonuspercentName,
               
                                OVERRIDE_AGENCYACTION:                          i?.override_agencyaction == 'true' ? true : false,
                                OVERRIDE_AGENCYBONUS:                           i?.override_agencybonus  == 'true' ? true : false,
                                OVERRIDE_AGENCYACTIONVALUE:                     i?.total_agencyaction,
                                OVERRIDE_AGENCYBONUSVALUE:                      i?.total_agencybonus,

                                BONUS_FLH:                                      i?.bonus_FLH,
                                BONUS_FLOHI:                                    i?.bonus_FLOHI,
                                BONUS_FLOHILO:                                  i?.bonus_FLOHILO,
                                BONUS_MIXED:                                    i?.bonus_MIXED,
                                BONUS_MTT:                                      i?.bonus_MTT,
                                BONUS_NLH:                                      i?.bonus_NLH,
                                BONUS_OFC:                                      i?.bonus_OFC,
                                BONUS_OTHERS:                                   i?.bonus_OTHER,
                                BONUS_PLOHI:                                    i?.bonus_PLOHI,
                                BONUS_PLOHILO:                                  i?.bonus_PLOHILO,
                                BONUS_SIX:                                      i?.bonus_SIX,
                                BONUS_SNG:                                      i?.bonus_SNG,
                                BONUS_SPIN:                                     i?.bonus_SPIN,
                                BONUS_TOTAL:                                    i?.total_bonus,
                
                                POINTS_FLH:                                      i?.points_FLH,
                                POINTS_FLOHI:                                    i?.points_FLOHI,
                                POINTS_FLOHILO:                                  i?.points_FLOHILO,
                                POINTS_MIXED:                                    i?.points_MIXED,
                                POINTS_MTT:                                      i?.points_MTT,
                                POINTS_NLH:                                      i?.points_NLH,
                                POINTS_OFC:                                      i?.points_OFC,
                                POINTS_OTHERS:                                   i?.points_OTHER,
                                POINTS_PLOHI:                                    i?.points_PLOHI,
                                POINTS_PLOHILO:                                  i?.points_PLOHILO,
                                POINTS_SIX:                                      i?.points_SIX,
                                POINTS_SNG:                                      i?.points_SNG,
                                POINTS_SPIN:                                     i?.points_SPIN,
                                POINTS_TOTAL:                                    i?.total_points,
                                POINTS_WIN:                                      i?.total_win,
                                POINTS_LOSS:                                     i?.total_loss,
                
                              }
                })
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
                                POINTS_TOTAL:    0,

                                POINTS_WIN:      0,
                                POINTS_LOSS:     0,

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

                        POINTS_SIX:        e.winlossSIX,
                        POINTS_FLH:        e.winlossFLH,
                        POINTS_FLOHI:      e.winlossFLOHI,
                        POINTS_FLOHILO:    e.winlossFLOHILO,
                        POINTS_MIXED:      e.winlossMIXED,
                        POINTS_MTT:        e.winlossMTT,
                        POINTS_NLH:        e.winlossNLH,
                        POINTS_OFC:        e.winlossOFC,
                        POINTS_PLOHI:      e.winlossPLOHI,
                        POINTS_PLOHILO:    e.winlossPLOHILO,
                        POINTS_SNG:        e.winlossSNG,
                        POINTS_SPIN:       e.winlossSPIN,
                        POINTS_OTHERS:     e.winlossOTHERWINLOSS,
                        POINTS_WIN:        Fn.sumPositives( sumPoints ),
                        POINTS_LOSS:       Fn.sumNegatives( sumPoints ),
                        POINTS_TOTAL:      Fn.sumNumbers( sumPoints ),
                        REMARKS:            e.remarks, 
                        RECORD:             'OLD',
                        }
                                          
                                })


}
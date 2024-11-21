import React, { useState, useEffect } from 'react';

import * as XLSX from 'xlsx'; // Import XLSX library
import * as Fnc from 'src/hooks/functions'
import * as Fn from './functions'
import * as Cls from 'src/hooks/classes'


const Upper =(i)=>{
  return String(i).toUpperCase()
}

export default async function fillBLANKS(DATA,CLUBS,ACCOUNTS,FORMULA,DEALPLAYERS,DEALUPLINES,DEALFORMULA) {

    let increment = 1;

    const standard_AgencyAction   = FORMULA.filter( (e) => e.status == 0 && e.type == 'AGENCY ACTION' && e.name == 'STANDARD'  )
    const standard_AgencyBonus    = FORMULA.filter( (e) => e.status == 0 && e.type == 'AGENCY BONUS' && e.name == 'STANDARD'  )
    const standard_PlayerResult   = FORMULA.filter( (e) => e.status == 0 && e.type == 'PLAYER RESULT' && e.name == 'STANDARD'  )
    const standard_BonusPercent   = FORMULA.filter( (e) => e.status == 0 && e.type == 'BONUS PERCENT' && e.name == 'STANDARD'  )
    const standard_Result         = FORMULA.filter( (e) => e.status == 0 && e.type == 'RESULT' && e.name == 'STANDARD'  )

    const isDay =(i) => {
      return  Upper(i) == 'MONDAY'     ? 'MONDAY' 
            : Upper(i) == 'TUESDAY'    ? 'TUESDAY' 
            : Upper(i) == 'WEDNESDAY'  ? 'WEDNESDAY'
            : Upper(i) == 'THURSDAY'   ? 'THURSDAY'
            : Upper(i) == 'FRIDAY'     ? 'FRIDAY'
            : Upper(i) == 'SATURDAY'   ? 'SATURDAY'
            : 'SUNDAY'
    }

    const isDayNumber =(i) => {
      return  Fnc.wordDayName(i) == 'MONDAY'     ? 1 
            : Fnc.wordDayName(i) == 'TUESDAY'    ? 2 
            : Fnc.wordDayName(i) == 'WEDNESDAY'  ? 3
            : Fnc.wordDayName(i) == 'THURSDAY'   ? 4
            : Fnc.wordDayName(i) == 'FRIDAY'     ? 5
            : Fnc.wordDayName(i) == 'SATURDAY'   ? 6
            : Fnc.wordDayName(i) == 'SUNDAY'     ? 0
            : 101
    }

    // -------------------------- --__-- --------------------------

    const inNUMBERS = DATA.map( i => {

        const NEW = Object.entries(i).reduce((e, [key, value]) => {
  
          const lowKey = Upper(key);
  
          if (lowKey.startsWith('WINLOSS_') || lowKey.startsWith('BONUS_')) {
              e[key] = Fn.numForce(value);
          } else {
              e[key] = value;
          }
  
          return e;
          
        }, {});
  
        return NEW;
  
    })

    const inSUMS = inNUMBERS.map(i => {

      const winloss = [ i.WINLOSS_SIX,i.WINLOSS_FLH,i.WINLOSS_FLOHI,i.WINLOSS_FLOHILO,i.WINLOSS_MIXED,i.WINLOSS_MTT,i.WINLOSS_NLH,i.WINLOSS_OFC,i.WINLOSS_PLOHI,i.WINLOSS_PLOHILO,i.WINLOSS_SNG,i.WINLOSS_SPIN,i.WINLOSS_OTHERS ]
      const bonus   = [ i.BONUS_SIX,i.BONUS_FLH,i.BONUS_FLOHI,i.BONUS_FLOHILO,i.BONUS_MIXED,i.BONUS_MTT,i.BONUS_NLH,i.BONUS_OFC,i.BONUS_PLOHI,i.BONUS_PLOHILO,i.BONUS_SNG,i.BONUS_SPIN,i.BONUS_OTHERS ] 

        i.WINLOSS_TOTAL           = Fn.sumNumbers( winloss )
        i.WINLOSS_WIN             = Fn.sumPositives( winloss )
        i.WINLOSS_LOSS            = Fn.sumNegatives( winloss )
        i.BONUS_TOTAL             = Fn.sumNumbers( bonus )
        i.RESULT_RESULT           = Fn.sumNumbers( winloss ) + Fn.sumNumbers( bonus )
        i.ROW                     = 'M' + increment++ +'J';
        i.RECORD                  = 'NEW'

        i.PLAYERRAKE              = i.PLAYERRAKEBACK ? i.PLAYERRAKEBACK : '0'
        i.AGENCYRAKE              = i.AGENCYRAKEBACK ? i.AGENCYRAKEBACK : '0'
        i.UPLINERAKE              = 100 - ( Fnc.NumForce(i.PLAYERRAKEBACK,0) == 0 && Fnc.NumForce(i.AGENCYRAKEBACK,0) == 0 ? Fnc.NumForce(i.RAKEBACK,0) : Fnc.NumForce(i.PLAYERRAKEBACK,0) + Fnc.NumForce(i.AGENCYRAKEBACK,0) )
        i.DOWNLINERAKE            = i.DOWNLINERAKEBACK ? i.DOWNLINERAKEBACK : '0'

        i.PLAYERCHIP              = Fnc.numZero(i.PLAYERCHIPRATE)
        i.AGENCYCHIP              = Fnc.numZero(i.AGENCYCHIPCUT)
        i.UPLINECHIP              = Fnc.numZero(i.UPLINECHIPCUT)
        i.DOWNLINECHIP            = Fnc.numZero(i.DOWNLINECHIPCUT)

        i.AGENCYID                = Fnc.isNull(i.AGENCYID)    ? '' : i.AGENCYID
        i.UPLINEID                = Fnc.isNull(i.UPLINEID)    ? '' : i.UPLINEID
        i.DOWNLINEID              = Fnc.isNull(i.DOWNLINEID)  ? '' : i.DOWNLINEID

        i.PLAYERRAKEBACK          = undefined
        i.UPLINERAKEBACK          = undefined
        i.AGENCYRAKEBACK          = undefined
        i.DOWNLINERAKEBACK        = undefined

        i.BONUS_6                 = undefined
        i.WINLOSS_6               = undefined
        i.FORMULA_AGENCYACTIONID  = standard_AgencyAction[0].id ? standard_AgencyAction[0].id : 2
        i.FORMULA_AGENCYBONUSID   = standard_AgencyBonus[0].id ? standard_AgencyBonus[0].id : 1
        i.FORMULA_PLAYERRESULTID  = standard_PlayerResult[0].id ? standard_PlayerResult[0].id : 3
        i.FORMULA_AGENCYACTION    = standard_AgencyAction[0].formula
        i.FORMULA_AGENCYBONUS     = standard_AgencyBonus[0].formula
        i.FORMULA_PLAYERRESULT    = standard_PlayerResult[0].formula
        i.FORMULA_BONUSPERCENT    = standard_BonusPercent[0].formula
        i.FORMULA_RESULT          = standard_Result[0].formula

        i.DATEOPENNED             = Fnc.dateGoBack( i.DATECLOSED, isDayNumber(i.DATEOPEN), i.DATEOPEN)
        i.DATECLOSED              = Fnc.dateDashed( i.DATECLOSED ).value
        i.DATESTART               = isDay( i.DATEOPENNED );
        i.DATESUB                 = Fnc.dateDashed( i.DATEOPENNED ).state == 'FUTURE' || Fnc.dateDashed( i.DATECLOSED ).state == 'FUTURE' ? 'FUTURE' : !Fnc.dateCheck(i.DATECLOSED) || Fnc.isNull(i.DATEOPENNED) ? 'WRONG' : ''
    
      return i;

    });


      const inCLUB = inSUMS.map(i => {

        const match = CLUBS.find(u => {
          return Upper(i.CLUBSUB) === Upper(u.clubID) || Upper(i.CLUBSUB) == Upper(u.clubName)
        });

        if (match) {

          i.CLUBID                = match?.clubID;
          i.CLUBNAME              = match?.clubName;
          i.CLUBIMAGE             = match?.clubImage;
          i.CLUBSUB               = Fnc.isNull(match?.clubName) ? i.CLUBSUB : '';
          i.APPID                 = Fn.numForce(match?.appID)
          i.APPNAME               = match?.appName;

        }
      
        return i;

      });

      const inPLAYERS = inCLUB.map(i => {

        const mPLAYER   = ACCOUNTS.find(u => {
          return Upper(i.PLAYERID) == Upper(u.accountID)
        });
  
        const mUPLINE   = ACCOUNTS.find(u => {
          return Upper(i.UPLINEID) == Upper(u.accountID)
        });

        const mAGENCY   = ACCOUNTS.find(u => {
          return Upper(i.AGENCYID) == Upper(u.accountID)
        });

        const mDOWNLINE = ACCOUNTS.find(u => {
          return Upper(i.DOWNLINEID) == Upper(u.accountID)
        });

        
        if (mPLAYER) {
  
          i.PLAYERNICK            = mPLAYER.accountNickname
          i.PLAYERUSERID          = mPLAYER.userID
          i.PLAYERUSERNAME        = !Fnc.isNull(mPLAYER.userFirstname) ? mPLAYER.userFirstname + ' ' + mPLAYER.userLastname : ''
          i.PLAYERUSERNICK        = mPLAYER.userNickname
          i.PLAYERSTATUS          = mPLAYER.statusLabel
          i.PLAYERSUB             = i.APPID == mPLAYER.appID ? '' : 'WRONG'
          i.PLAYERAPPID           = mPLAYER.appID

        } else {
          i.PLAYERSUB             = 'NEW'
        }
      
        if (mUPLINE) {
  
          i.UPLINENICK            = mUPLINE.accountNickname
          i.UPLINEUSERID          = mUPLINE.userID
          i.UPLINEUSERNAME        = !Fnc.isNull(mUPLINE.userFirstname) ? mUPLINE.userFirstname + ' ' + mUPLINE.userLastname : ''
          i.UPLINEUSERNICK        = mUPLINE.userNickname
          i.UPLINESTATUS          = mUPLINE.statusLabel
          i.UPLINESUB             = i.APPID == mUPLINE.appID ? '' : 'WRONG'
          i.UPLINEAPPID           = mUPLINE.appID

        } else {
          i.UPLINESUB             = 'NEW'
        }

        if (mAGENCY) {
  
          i.AGENCYNICK            = mAGENCY.accountNickname
          i.AGENCYUSERID          = mAGENCY.userID
          i.AGENCYUSERNAME        = !Fnc.isNull(mAGENCY.userFirstname) ? mAGENCY.userFirstname + ' ' + mAGENCY.userLastname : ''
          i.AGENCYUSERNICK        = mAGENCY.userNickname
          i.AGENCYSTATUS          = mAGENCY.statusLabel
          i.AGENCYSUB             = i.APPID == mAGENCY.appID ? '' : 'WRONG'
          i.AGENCYAPPID           = mAGENCY.appID

        } else {
          i.AGENCYSUB             = 'NEW'
        }

        if (mDOWNLINE) {
  
          i.DOWNLINENICK            = mDOWNLINE.accountNickname
          i.DOWNLINEUSERID          = mDOWNLINE.userID
          i.DOWNLINEUSERNAME        = !Fnc.isNull(mDOWNLINE.userFirstname) ? mDOWNLINE.userFirstname + ' ' + mDOWNLINE.userLastname : ''
          i.DOWNLINEUSERNICK        = mDOWNLINE.userNickname
          i.DOWNLINESTATUS          = mDOWNLINE.statusLabel
          i.DOWNLINESUB             = i.APPID == mDOWNLINE.appID ? '' : 'WRONG'
          i.DOWNLINEAPPID           = mDOWNLINE.appID

        } else {
          i.DOWNLINESUB             = 'NEW'
        }

        return i;

      });

    const inDEAL = inPLAYERS.map(i => {

      const match = DEALPLAYERS.find(u => {
        return i.CLUBID === u.clubID 
            && i.PLAYERID === u.playerID 
            && ( Fnc.isNull(i.UPLINEID,0) || i.AGENCYID == u.uplineID )
            && ( Fnc.isNull(i.AGENCYID,0) || i.AGENCYID == u.agencyID )
            && ( Fnc.isNull(i.DOWNLINEID,0) || i.DOWNLINEID == u.downlineID )
            && ( Fnc.isNull(i.RAKEBACK,0) || i.RAKEBACK == u.rakeback )
            && ( Fnc.isNull(i.REBATE,0) || i.REBATE == u.rebate )
            && ( Fnc.isNull(i.CHIPRATE,0) || i.CHIPRATE == u.chiprate )
            && ( Fnc.isNull(i.PLAYERRAKE,0) || i.PLAYERRAKE == u.playerRake )
            && ( Fnc.isNull(i.AGENCYRAKE,0) || i.AGENCYRAKE == u.agencyRake )
      });

      if (match) {

        i.RAKEBACK                = Fnc.numZero(match?.rakeback);
        i.REBATE                  = Fnc.numZero(match?.rebate);
        i.CHIPRATE                = Fnc.numZero(match?.chiprate);

        i.PLAYERRAKE              = Fnc.numZero(match?.playerRake);
        i.UPLINERAKE              = Fnc.numZero(match?.uplineRake);
        i.AGENCYRAKE              = Fnc.numZero(match?.agencyRake);
        i.DOWNLINERAKE            = Fnc.numZero(match?.downlineRake);

        i.PLAYERREBATE            = Fnc.numZero(match?.playerRebate);
        i.UPLINEREBATE            = Fnc.numZero(match?.uplineRebate);
        i.AGENCYREBATE            = Fnc.numZero(match?.agencyRebate);
        i.DOWNLINEREBATE          = Fnc.numZero(match?.downlineRebate);

        i.PLAYERCHIP              = Fnc.numZero(match?.playerChiprate);
        i.UPLINECHIP              = Fnc.numZero(match?.uplineChipcut);
        i.AGENCYCHIP              = Fnc.numZero(match?.agencyChipcut);
        i.DOWNLINECHIP            = Fnc.numZero(match?.downlineChipcut);

        i.UPLINEID                = match?.uplineID;
        i.UPLINEAPPID             = match?.uplineAppID;
        i.UPLINENICK              = match?.uplineNick;
        i.UPLINEUSERID            = match?.uplineUserID;
        i.UPLINEUSERNAME          = match?.uplineUserName;
        i.UPLINEUSERNICK          = match?.uplineUserNick;
        i.UPLINESUB               = match?.uplineAppID == i.APPID ? '' : 'WRONG';

        i.AGENCYID                = match?.agencyID;
        i.AGENCYAPPID             = match?.agencyAppID;
        i.AGENCYNICK              = match?.agencyNick;
        i.AGENCYUSERID            = match?.agencyUserID;
        i.AGENCYUSERNAME          = match?.agencyUserName;
        i.AGENCYUSERNICK          = match?.agencyUserNick;
        i.AGENCYSUB               = match?.agencyAppID == i.APPID ? '' : 'WRONG';

        i.DOWNLINEID              = match?.downlineID;
        i.DOWNLINEAPPID           = match?.downlineAppID;
        i.DOWNLINENICK            = match?.downlineNick;
        i.DOWNLINEUSERID          = match?.downlineUserID;
        i.DOWNLINEUSERNAME        = match?.downlineUserName;
        i.DOWNLINEUSERNICK        = match?.downlineUserNick;
        i.DOWNLINESUB             = match?.downlineAppID == i.APPID ? '' : 'WRONG';

        i.FXUSD                   = !Fnc.isNull(i?.FXUSD) ? i.FXUSD : 1;
        i.FXPROVIDER              = 'xe.com'  
        i.FXCURRENCY              = !Fnc.isNull(i.FXCURRENCY) ? i.FXCURRENCY : 'USD'  
        i.FXDATE                  = !Fnc.isNull(i.FXUSD,0) ? i.DATECLOSED : ''  

        i.FORMULA_AGENCYACTIONID  = match?.form_agencyActionID ? match?.form_agencyActionID : 0;
        i.FORMULA_AGENCYBONUSID   = match?.form_agencyBonusID ? match?.form_agencyBonusID : 0;
        i.FORMULA_PLAYERRESULTID  = match?.form_playerResultID ? match?.form_playerResultID : 0;

        i.FORMULA_AGENCYACTION    = match?.form_agencyAction;
        i.FORMULA_AGENCYBONUS     = match?.form_agencyBonus;
        i.FORMULA_PLAYERRESULT    = match?.form_playerResult;
        i.FORMULA_BONUSPERCENT    = match?.form_bonuspercent;
        i.FORMULA_RESULT          = match?.form_result;

        i.FORMNAME_AGENCYACTION   = match?.form_agencyActionName;
        i.FORMNAME_AGENCYBONUS    = match?.form_agencyBonusName;
        i.FORMNAME_PLAYERRESULT   = match?.form_playerResultName;
        i.FORMNAME_BONUSPERCENT   = match?.form_bonuspercentName;
        i.FORMNAME_RESULT         = match?.form_resultName;

        i.ID_PLAYERDEAL           = match?.id;
        i.ID_FORMULA              = match?.formulaID;
        i.FORMULA_REMARKS         = match?.form_remarks;

      }
    
      return i;
    });


return inDEAL

};
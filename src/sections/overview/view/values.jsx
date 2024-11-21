export const chartsRECORDS  =(arr)=>{
    return arr?.reduce((a, i) => {
        a?.dateOrder.push(i?.dateOrder);
        a?.countPlayers.push(i?.countPlayers);
        a?.countUplines.push(i?.countUplines);
        a?.countAgencys.push(i?.countAgencys);
        a?.countDownlines.push(i?.countDownlines);
    
        a?.countApps.push(i?.countApps);
        a?.countClubs.push(i?.countClubs);
        a?.countUsers.push(i?.countUsers);
        a?.countAccounts.push(i?.countAccounts);
        a?.countRecords.push(i?.countRecords);
    
        a?.countApps_total.push(i?.countApps_total);
        a?.countClubs_total.push(i?.countClubs_total);
        a?.countUsers_total.push(i?.countUsers_total);
        a?.countAccounts_total.push(i?.countAccounts_total);
    
        a?.total_bonus_usd.push(i?.total_bonus_usd);
        a?.total_points_usd.push(i?.total_points_usd);
        a?.total_win_usd.push(i?.total_win_usd);
        a?.total_loss_usd.push(i?.total_loss_usd);
    
        a?.total_bonus.push(i?.total_bonus);
        a?.total_points.push(i?.total_points);
        a?.total_win.push(i?.total_win);
        a?.total_loss.push(i?.total_loss);
    
        a?.total_agencyaction.push(i?.total_agencyaction);
        a?.total_agencybonus.push(i?.total_agencybonus);
        a?.total_playerresult.push(i?.total_playerresult);
        a?.total_result.push(i?.total_result);
        a?.total_bonuspercent.push(i?.total_bonuspercent);
    
        a?.points_FLH.push(i?.points_FLH);
        a?.points_MTT.push(i?.points_MTT);
        a?.points_NLH.push(i?.points_NLH);
        a?.points_OFC.push(i?.points_OFC);
        a?.points_SIX.push(i?.points_SIX);
        a?.points_SNG.push(i?.points_SNG);
        a?.points_SPIN.push(i?.points_SPIN);
        a?.points_FLOHi?.push(i?.points_FLOHI);
        a?.points_MIXED.push(i?.points_MIXED);
        a?.points_PLOHi?.push(i?.points_PLOHI);
        a?.points_FLOHILO.push(i?.points_FLOHILO);
        a?.points_PLOHILO.push(i?.points_PLOHILO);
        a?.points_OTHER.push(i?.points_OTHER);
    
        a?.bonus_FLH.push(i?.bonus_FLH);
        a?.bonus_MTT.push(i?.bonus_MTT);
        a?.bonus_NLH.push(i?.bonus_NLH);
        a?.bonus_OFC.push(i?.bonus_OFC);
        a?.bonus_SIX.push(i?.bonus_SIX);
        a?.bonus_SNG.push(i?.bonus_SNG);
        a?.bonus_SPIN.push(i?.bonus_SPIN);
        a?.bonus_FLOHi?.push(i?.bonus_FLOHI);
        a?.bonus_MIXED.push(i?.bonus_MIXED);
        a?.bonus_PLOHi?.push(i?.bonus_PLOHI);
        a?.bonus_FLOHILO.push(i?.bonus_FLOHILO);
        a?.bonus_PLOHILO.push(i?.bonus_PLOHILO);
        a?.bonus_OTHER.push(i?.bonus_OTHER);
        return a;
      }, { dateOrder:          [], 
           countPlayers:       [], 
           countUplines:       [], 
           countAgencys:       [], 
           countDownlines:     [], 
    
           countApps_total:    [], 
           countClubs_total:   [], 
           countUsers_total:   [], 
           countAccounts_total:[], 
    
           countApps:          [], 
           countClubs:         [], 
           countUsers:         [], 
           countAccounts:      [],
           countRecords:       [], 
           
           total_bonus_usd:     [], 
           total_points_usd:    [], 
           total_win_usd:       [], 
           total_loss_usd:      [], 
           total_bonus:         [], 
           total_points:        [], 
           total_win:           [], 
           total_loss:          [], 
           total_agencyaction:  [], 
           total_agencybonus:   [], 
           total_playerresult:  [], 
           total_result:        [], 
           total_bonuspercent:  [],
    
           points_FLH:  [],
           points_MTT:  [],
           points_NLH:  [],
           points_OFC:  [],
           points_SIX:  [],
           points_SNG:  [],
           points_SPIN:  [],
           points_FLOHI:  [],
           points_MIXED:  [],
           points_PLOHI:  [],
           points_FLOHILO:  [],
           points_PLOHILO:  [],
           points_OTHER:  [],
          
           bonus_FLH:  [],
           bonus_MTT:  [],
           bonus_NLH:  [],
           bonus_OFC:  [],
           bonus_SIX:  [],
           bonus_SNG:  [],
           bonus_SPIN:  [],
           bonus_FLOHI:  [],
           bonus_MIXED:  [],
           bonus_PLOHI:  [],
           bonus_FLOHILO:  [],
           bonus_PLOHILO:  [],
           bonus_OTHER:  [],});
}
    
export const chartsACCOUNTS  =(arr)=>{
    return arr?.reduce((a, i) => {
        a?.name.push(i?.accountID.toUpperCase());

        a?.count_asPlayer.push(i?.count_asPlayer);
        a?.count_asUpline.push(i?.count_asUpline);
        a?.count_asAgency.push(i?.count_asAgency);
        a?.count_asDownline.push(i?.count_asDownline);

        a?.count_clubs.push(i?.count_clubs);
        a?.list_clubIDs.push(i?.list_clubIDs);
        a?.list_clubNames.push(i?.list_clubNames);

        a?.total_bonus.push(i?.total_bonus);
        a?.total_points.push(i?.total_points);
        a?.total_win.push(i?.total_win);
        a?.total_loss.push(i?.total_loss);

        a?.total_bonus_usd.push(i?.total_bonus_usd);
        a?.total_points_usd.push(i?.total_points_usd);
        a?.total_win_usd.push(i?.total_win_usd);
        a?.total_loss_usd.push(i?.total_loss_usd);

        a?.total_agencyaction.push(i?.total_agencyaction);
        a?.total_agencybonus.push(i?.total_agencybonus);
        a?.total_playerresult.push(i?.total_playerresult);
        a?.total_result.push(i?.total_result);
        a?.total_bonuspercent.push(i?.total_bonuspercent);

        a?.points_FLH_loss.push(i?.points_FLH_loss);
        a?.points_MTT_loss.push(i?.points_MTT_loss);
        a?.points_NLH_loss.push(i?.points_NLH_loss);
        a?.points_OFC_loss.push(i?.points_OFC_loss);
        a?.points_SIX_loss.push(i?.points_SIX_loss);
        a?.points_SNG_loss.push(i?.points_SNG_loss);
        a?.points_SPIN_loss.push(i?.points_SPIN_loss);
        a?.points_FLOHI_loss.push(i?.points_FLOHI_loss);
        a?.points_MIXED_loss.push(i?.points_MIXED_loss);
        a?.points_PLOHI_loss.push(i?.points_PLOHI_loss);
        a?.points_FLOHILO_loss.push(i?.points_FLOHILO_loss);
        a?.points_PLOHILO_loss.push(i?.points_PLOHILO_loss);
        a?.points_OTHER_loss.push(i?.points_OTHER_loss);

        a?.points_FLH_win.push(i?.points_FLH_win);
        a?.points_MTT_win.push(i?.points_MTT_win);
        a?.points_NLH_win.push(i?.points_NLH_win);
        a?.points_OFC_win.push(i?.points_OFC_win);
        a?.points_SIX_win.push(i?.points_SIX_win);
        a?.points_SNG_win.push(i?.points_SNG_win);
        a?.points_SPIN_win.push(i?.points_SPIN_win);
        a?.points_FLOHI_win.push(i?.points_FLOHI_win);
        a?.points_MIXED_win.push(i?.points_MIXED_win);
        a?.points_PLOHI_win.push(i?.points_PLOHI_win);
        a?.points_FLOHILO_win.push(i?.points_FLOHILO_win);
        a?.points_PLOHILO_win.push(i?.points_PLOHILO_win);
        a?.points_OTHER_win.push(i?.points_OTHER_win);

        a?.points_FLH.push(i?.points_FLH);
        a?.points_MTT.push(i?.points_MTT);
        a?.points_NLH.push(i?.points_NLH);
        a?.points_OFC.push(i?.points_OFC);
        a?.points_SIX.push(i?.points_SIX);
        a?.points_SNG.push(i?.points_SNG);
        a?.points_SPIN.push(i?.points_SPIN);
        a?.points_FLOHi?.push(i?.points_FLOHI);
        a?.points_MIXED.push(i?.points_MIXED);
        a?.points_PLOHi?.push(i?.points_PLOHI);
        a?.points_FLOHILO.push(i?.points_FLOHILO);
        a?.points_PLOHILO.push(i?.points_PLOHILO);
        a?.points_OTHER.push(i?.points_OTHER);


        a?.bonus_FLH.push(i?.bonus_FLH);
        a?.bonus_MTT.push(i?.bonus_MTT);
        a?.bonus_NLH.push(i?.bonus_NLH);
        a?.bonus_OFC.push(i?.bonus_OFC);
        a?.bonus_SIX.push(i?.bonus_SIX);
        a?.bonus_SNG.push(i?.bonus_SNG);
        a?.bonus_SPIN.push(i?.bonus_SPIN);
        a?.bonus_FLOHi?.push(i?.bonus_FLOHI);
        a?.bonus_MIXED.push(i?.bonus_MIXED);
        a?.bonus_PLOHi?.push(i?.bonus_PLOHI);
        a?.bonus_FLOHILO.push(i?.bonus_FLOHILO);
        a?.bonus_PLOHILO.push(i?.bonus_PLOHILO);
        a?.bonus_OTHER.push(i?.bonus_OTHER);
        return a;
    }, {  
        name:               [], 
        count_asPlayer:         [], 
        count_asUpline:        [], 
        count_asAgency: [], 
        count_asDownline:          [], 

        count_clubs:         [], 
        list_clubIDs:        [], 
        list_clubNames:           [],

        total_bonus:         [], 
        total_points:        [], 
        total_win:           [], 
        total_loss:          [], 

        total_bonus_usd:     [], 
        total_points_usd:    [], 
        total_win_usd:       [], 
        total_loss_usd:      [],

        total_agencyaction:  [], 
        total_agencybonus:   [], 
        total_playerresult:  [], 
        total_result:        [], 
        total_bonuspercent:  [],
        
        points_FLH_loss:          [], 
        points_MTT_loss:          [], 
        points_NLH_loss:          [], 
        points_OFC_loss:          [], 
        points_SIX_loss:          [], 
        points_SNG_loss:          [], 
        points_SPIN_loss:         [], 
        points_FLOHI_loss:        [], 
        points_MIXED_loss:        [], 
        points_PLOHI_loss:        [], 
        points_FLOHILO_loss:      [], 
        points_PLOHILO_loss:      [], 
        points_OTHER_loss:        [],

        points_FLH_win:          [], 
        points_MTT_win:          [], 
        points_NLH_win:          [], 
        points_OFC_win:          [], 
        points_SIX_win:          [], 
        points_SNG_win:          [], 
        points_SPIN_win:         [], 
        points_FLOHI_win:        [], 
        points_MIXED_win:        [], 
        points_PLOHI_win:        [], 
        points_FLOHILO_win:      [], 
        points_PLOHILO_win:      [], 
        points_OTHER_win:        [],

        points_FLH:          [], 
        points_MTT:          [], 
        points_NLH:          [], 
        points_OFC:          [], 
        points_SIX:          [], 
        points_SNG:          [], 
        points_SPIN:         [], 
        points_FLOHI:        [], 
        points_MIXED:        [], 
        points_PLOHI:        [], 
        points_FLOHILO:      [], 
        points_PLOHILO:      [], 
        points_OTHER:        [],

        bonus_FLH:          [], 
        bonus_MTT:          [], 
        bonus_NLH:          [], 
        bonus_OFC:          [], 
        bonus_SIX:          [], 
        bonus_SNG:          [], 
        bonus_SPIN:         [], 
        bonus_FLOHI:        [], 
        bonus_MIXED:        [], 
        bonus_PLOHI:        [], 
        bonus_FLOHILO:      [], 
        bonus_PLOHILO:      [], 
        bonus_OTHER:        [],
    });
    }
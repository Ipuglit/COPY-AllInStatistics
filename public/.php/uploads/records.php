<?php

include '../conx.php';
include '../verify/verify.php';

function generateCode($length = 4) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return 'Player-'.$randomString;
}

$timeToday = time();

if($Verified == "FOUND"){

    $JSONData       = $Got['JSONData'];

    $duplicate      = [];
    $newAccount     = 0;
    $newUpline      = 0;
    $newClubPercent = 0;
    $newRecord      = 0;
    $newHits        = 0;
    $updRecord      = 0;
    $added          = 0;
    $updated        = 0;
    $unionID        = 0;

    try {
        foreach( $JSONData as $bit ) {

            $arrFX = array(
                                "provider"      => $bit['FXPROVIDER'],
                                "date"          => $bit['FXDATE'],
                                "currency"      => $bit['FXCURRENCY'],
                                "usd"           => $bit['FXUSD'],
                            );

            $arrBONUS = array(
                                "6"             => $bit['BONUS_SIX'],
                                "FLH"           => $bit['BONUS_FLH'],
                                "FLOHI"         => $bit['BONUS_FLOHI'],
                                "FLOHILO"       => $bit['BONUS_FLOHILO'],
                                "MIXED"         => $bit['BONUS_MIXED'],
                                "MTT"           => $bit['BONUS_MTT'],
                                "NLH"           => $bit['BONUS_NLH'],
                                "OFC"           => $bit['BONUS_OFC'],
                                "PLOHI"         => $bit['BONUS_PLOHI'],
                                "PLOHILO"       => $bit['BONUS_PLOHILO'],
                                "SNG"           => $bit['BONUS_SNG'],
                                "SPIN"          => $bit['BONUS_SPIN'],
                                "OTHERBONUS"    => $bit['BONUS_OTHERS'],
                            );

            $arrWINLOSS = array(
                                "6"             => $bit['WINLOSS_SIX'],
                                "FLH"           => $bit['WINLOSS_FLH'],
                                "FLOHI"         => $bit['WINLOSS_FLOHI'],
                                "FLOHILO"       => $bit['WINLOSS_FLOHILO'],
                                "MIXED"         => $bit['WINLOSS_MIXED'],
                                "MTT"           => $bit['WINLOSS_MTT'],
                                "NLH"           => $bit['WINLOSS_NLH'],
                                "OFC"           => $bit['WINLOSS_OFC'],
                                "PLOHI"         => $bit['WINLOSS_PLOHI'],
                                "PLOHILO"       => $bit['WINLOSS_PLOHILO'],
                                "SNG"           => $bit['WINLOSS_SNG'],
                                "SPIN"          => $bit['WINLOSS_SPIN'],
                                "OTHERBONUS"    => $bit['WINLOSS_OTHERBONUS'],
                            );

            $jsonFX             = json_encode($arrFX);
            $jsonBonus          = json_encode($arrBONUS);
            $jsonWinLoss        = json_encode($arrWINLOSS);

            $IDPlayer   = intval($bit['PLAYERID']);
            $IDUpline   = intval($bit['UPLINEID']);
            $IDApp      = intval($bit['APPID']);

            $ACCOUNT        = mysqli_query($conx,"SELECT 1 FROM accounts WHERE accountID='".$IDPlayer."' ");
            
            $UPLINE         = mysqli_query($conx,"SELECT 1 FROM uplines 
                                                    WHERE downlineID='".$IDPlayer."' 
                                                        AND clubID='".$bit['CLUBIDD']."' 
                                                        AND status = 0 ");

            $CLUBPERCENT    = mysqli_query($conx,"SELECT 1 FROM percentages WHERE type='CLUB'
                                                                            AND idd='".$bit['CLUBIDD']."'
                                                                            AND status = 0 ");

            $RECORD         = $conx->query("SELECT * FROM records WHERE playerID='".$IDPlayer."'
                                                                    AND clubID='".$bit['CLUBIDD']."'
                                                                    AND (  
                                                                            '".$bit['DATEOPENNED']."' <= dateClose 
                                                                            AND 
                                                                            '".$bit['DATECLOSED']."' >= dateOpen
                                                                            ) ");

            //ADD NEW ACCOUNT IF IT DOESN"T EXIST
            if (mysqli_num_rows($ACCOUNT) == 0){

                $Forge = $conx->prepare(" INSERT INTO accounts (accountID, accountNickname, appID, accountRole, userID, status) 
                                          VALUES (?,?,?,1,0,0) ");
                $Forge->bind_param("isi", 
                                        $IDPlayer,
                                        generateCode(), 
                                        $IDApp);
                $Forge->execute();
                $newAccount++;

            }

            //ADD NEW UPLINE IF IT DOESN"T EXIST
            if (mysqli_num_rows($UPLINE) == 0 && !empty($IDUpline) && $IDUpline != 0){

                $Forge = $conx->prepare(" INSERT INTO uplines (clubID,downlineID,uplineID,percentage,stated,status) VALUES (?,?,?,?,?,0) ");
                $Forge->bind_param("siiii", 
                                        $bit['CLUBIDD'],
                                        $IDPlayer, 
                                        $IDUpline,
                                        $bit['UPLINEPERCENT'],
                                        $timeToday);
                $Forge->execute();
                $newUpline++;

            }

            //ADD NEW CLUB PERCENT IF IT DOESN"T EXIST
            if (mysqli_num_rows($CLUBPERCENT) == 0 && !empty($bit['CLUBPERCENT']) && $bit['CLUBPERCENT'] != 0){

                $Forge = $conx->prepare(" INSERT INTO percentages (type,idd,percent,stated,statedby,status) 
                                          VALUES ('CLUB',?,?,?,?,0) ");
                $Forge->bind_param("siii", 
                                        $bit['CLUBIDD'],
                                        $bit['CLUBPERCENT'],
                                        $timeToday,
                                        $verifyID);
                $Forge->execute();
                $newClubPercent++;

            }

            //ADD NEW RECORD IF IT DOESN"T EXIST
            if ( $RECORD->num_rows > 0 ) {

                if( $bit['WHAT'] == 'UP' ){

                    $Forge = $conx->prepare(" UPDATE records 
                                              SET dateOpen=?,dateClose=?,playerID=?,clubID=?,uplineRake=?,uplineID=?,agencyRake=?,fxRates=?,sumWinLoss=?,sumBonus=?,stated=?,status=0 
                                              WHERE id=?");
                    $Forge->bind_param("ssisiiisssii", 
                                            $bit['DATEOPENNED'],
                                            $bit['DATECLOSED'], 
                                            $IDPlayer,
                                            $bit['CLUBIDD'],
                                            $bit['CLUBPERCENT'],
                                            $IDUpline,
                                            $bit['UPLINEPERCENT'],
                                            $jsonFX,
                                            $jsonBonus,
                                            $jsonWinLoss,
                                            $timeToday,
                                            $bit['RECORDID']);
                    $Forge->execute();

                } else {

                    while ($i = $RECORD->fetch_assoc()) {
                        $duplicate[] = $i['id'];
                    }

                    $newHits++;

                }

            } else if ( $RECORD->num_rows > 0 && $bit['WHAT'] == 'UP' ) {

                while ($i = $RECORD->fetch_assoc()) {
                    $duplicate[] = $i['id'];
                }

                $newHits++;

            } else {

                $Forge = $conx->prepare(" INSERT INTO records (dateOpen,dateClose,playerID,clubID,uplineRake,uplineID,agencyRake,fxRates,sumWinLoss,sumBonus,stated,status) 
                                            VALUES (?,?,?,?,?,?,?,?,?,?,?,0) ");
                $Forge->bind_param("ssisiiisssi", 
                                        $bit['DATEOPENNED'],
                                        $bit['DATECLOSED'], 
                                        $IDPlayer,
                                        $bit['CLUBIDD'],
                                        $bit['CLUBPERCENT'],
                                        $IDUpline,
                                        $bit['UPLINEPERCENT'],
                                        $jsonFX,
                                        $jsonBonus,
                                        $jsonWinLoss,
                                        $timeToday);
                $Forge->execute();
                $newRecord++;

            }

        };

        $feedback = array(
                            "newaccount"        => $newAccount,
                            "newupline"         => $newUpline,
                            "newclubpercent"    => $newClubPercent,
                            "newrecord"         => $newRecord,
                            "updrecord"         => $updRecord,
                            "hits"              => $newHits,
                            "duplicates"        => $duplicate,
                        );

    } catch (Exception $e) {
        $feedback = "ERR";
    }
} else {
    $feedback = "NOTFOUND";
}
 echo json_encode($feedback, true);


 // Receive data
 // Check if player exist else add as new
 // check if upline exist else add as new, if no percentage then add percent
 // check duplicates from records
 // submit non duplicates
 // return and filter duplicates
<?php
    include '../conx.php';
    include '../verify/verify.php';

    $timeToday = time();

 if($Verified == "FOUND"){

    $JSONData       = $Got['JSONData'];

    $newClubAdmin     = 0;
    $updClubAdmin     = 0;
    $duplicate        = [];
    $newHits          = 0;
    try {

        foreach( $JSONData as $bit ) {
            
            $CLUBADMIN        = $conx->query("SELECT * FROM clubsadmin WHERE clubID='".$bit['CLUBIDD']."' AND userID='".$bit['USERID']."' ");

            if ( $CLUBADMIN->num_rows > 0 ) {

                $dupliID = 0;
                while ($i = $RECORD->fetch_assoc()) {
                    $dupliID        = $i['id'];
                    $duplicate[]    = $i['id'];
                }

                if($bit['CLUBIDD'] == 'UP'){

                    $Forge = $conx->prepare(" UPDATE clubsadmin SET status=2 WHERE id=?");
                    $Forge->bind_param("i", $dupliID );
                    $Forge->execute();
    
                    $Forges = $conx->prepare(" INSERT INTO clubsadmin (clubID, userID, accessLevel, stated, statedBy, status) 
                                            VALUES (?,?,?,?,?,0) ");
                    $Forges->bind_param("siiii", 
                                            $bit['CLUBIDD'],
                                            $bit['USERID'], 
                                            $bit['ACCESSLEVEL'],
                                            $timeToday,
                                            $verifyID);
                    $Forges->execute();

                    $updClubAdmin++;

                } 

            } else {

                $Forge = $conx->prepare(" INSERT INTO clubsadmin (clubID, userID, accessLevel, stated, statedBy, status) 
                                          VALUES (?,?,?,?,?,0) ");
                $Forge->bind_param("siiii", 
                                        $bit['CLUBIDD'],
                                        $bit['USERID'], 
                                        $bit['ACCESSLEVEL'],
                                        $timeToday,
                                        $verifyID);
                $Forge->execute();
                $newClubAdmin++;


            }

        }

        $feedback = array(
                            "new"               => $newAccount,
                            "updated"           => $newUpline,
                            "newclubpercent"    => $newClubPercent,
                            "newrecord"         => $newRecord,
                            "updrecord"         => $updRecord,
                            "hits"              => $newHits,
                            "duplicates"        => $duplicate,
                        );

    } catch (Exception $e) {
        $feedback = "Err Catch: Duplicate ".$e;
    }

} else {
    $feedback = "NOTFOUND";
}

echo json_encode($feedback);
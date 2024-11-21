<?php

include '../conx.php';
include '../verify/verify.php';

if($Verified == "FOUND"){

    $JSONType =                     $Got['JSONType'];
    $JSONData =                     $Got['JSONData'];

        try {

            $CHECK = "SELECT * FROM clubs ";

            $values = array();

            $SUCC_U= 0;
            $SUCC_I= 0;
            $FAIL_U= 0;
            $FAIL_I= 0;

           // $items = json_decode($JSONData, true);
          
            foreach ($JSONData as $row) {

                $idd        = $conx->real_escape_string($row['idd']);
                $name       = $conx->real_escape_string($row['name']);
                $appID      = $conx->real_escape_string($row['appid']);
                $type       = $conx->real_escape_string($row['type']);
                $status     = $conx->real_escape_string($row['status']);

                $SET = $conx->query("SELECT * FROM clubs WHERE idd=$idd OR name='$name' ");

                if ($SET->num_rows > 0) {
                    $UP = " UPDATE clubs SET idd = $idd, name ='$name', appID='$appID',type='$type',status=$status ";
                } else {
                    $IN = " INSERT INTO clubs (idd, name, appID, type, status) VALUES ('$idd', '$name', '$appID', '$type', '$status') ";
                }

            }

            if ($conx->query($IN) === TRUE) {
                $SUCC_I++;
            } else {
                $FAIL_I= 0;
            }

            if ($conx->query($UP) === TRUE) {
                $SUCC_U++;
            } else {
                $FAIL_U= 0;
            }

            $feedback = "Insert: Success ".$SUCC_I.", Fail ".$SUCC_I." -- Update: Success ".$SUCC_U.", Fail ".$SUCC_U;

          } catch(PDOException $e) {
              $feedback = "FAILED";
          }


} else {
    $feedback = "NOTFOUND";
}

echo $feedback;

?>
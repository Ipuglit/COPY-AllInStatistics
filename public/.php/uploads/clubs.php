<?php

include '../conx.php';
include '../verify/verify.php';

if($Verified == "FOUND"){

    $JSONType =                     $Got['JSONType'];
    $JSONData =                     $Got['JSONData'];

    $duplicate = [];
    $added = 0;
    $updated = 0;
    $unionID = 0;
    try {
        foreach( $JSONData as $item ) {

            $CHECK = mysqli_query($conx,"SELECT 1 from clubs WHERE idd='".$item['idd']."'" );

            $UNION = $conx->query("SELECT id from unions WHERE name='".$item['union']."'");

            if ($UNION->num_rows > 0 && $item['type'] == 'UNION') {

                while ($i = $UNION->fetch_assoc()) {
                    $unionID = $i['id'];
                }

            } else {

                if(!empty($item['union'])){

                    $AntiWorld = $conx->prepare(" INSERT INTO unions (type, name, status) VALUES ('UNION',?,0) ");
                    $AntiWorld->bind_param("s", $item['union']);
                    $AntiWorld->execute();
                    $unionID = $conx->insert_id;

                } else {
                    $unionID = 0;
                }

            }

            if (mysqli_num_rows($CHECK) == 0){

                  $AntiWorld = $conx->prepare(" INSERT INTO clubs (idd, name, appID, type, unionID, status) VALUES (?,?,?,?,?,?) ");
                  $AntiWorld->bind_param("ssisii",
                                          $item['idd'],
                                          $item['name'],
                                          $item['appid'],
                                          $item['type'],
                                          $unionID,
                                          $item['status']);
                  $AntiWorld->execute();
                  $added++;

            } else {

                  $AntiWorld = $conx->prepare("UPDATE clubs SET name = ?, appID = ?, type = ?, unionID = ?, status = ? WHERE idd=? ");
                  $AntiWorld->bind_param("sisiis",
                                          $item['name'],
                                          $item['appid'],
                                          $item['type'],
                                          $unionID,
                                          $item['status'],
                                          $item['idd']);
                  $AntiWorld->execute();
                  $updated++;
            }

        };
        $feedback = "SUCCESS: Added = ".$added.", Updated =".$updated. " DUPLICATE: ".json_encode($duplicate);
    } catch (Exception $e) {
        $feedback = "ERR: Added = ".$added.", Updated =".$updated. " DUPLICATE: ".json_encode($duplicate)." ".$e;
    }
} else {
    $feedback = "NOTFOUND";
}
 echo json_encode($feedback, true);
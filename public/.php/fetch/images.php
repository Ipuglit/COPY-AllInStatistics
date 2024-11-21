<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){

    if($Got['FOR'] == "ALL"){
        $Extend = " ";
    } else {
        $Extend = " AND i.type = '".$Got['FOR']."'";
    }

    $sql = "SELECT  i.id AS id,
                    i.name AS name,
                    i.type AS type,
                    i.file AS file,
                    i.status AS status,
                    IF(i.status = 0, 'Active', IF(i.status=1, 'Pending', 'Disabled')) AS statusLabel,
                    CONCAT(p.path,i.file) AS imageFull,
                    p.id AS pathID,
                    p.path AS path
            FROM images as i
            LEFT JOIN paths AS p ON i.type = p.type
                WHERE i.status = 0 ".$Extend;


    $result = $conx->query($sql);
    $feedback = [];

        if ($result->num_rows > 0) {
            while ($i = $result->fetch_assoc()) {

                if($i['status']==0){
                    $status = "Active";
                } else {
                    $status = "Inactive";
                }

                $feedback[] = array(
                                'id' =>             $i['id'],
                                'name' =>           $i['name'],
                                'type' =>           $i['type'],
                                'file' =>           $i['file'],
                                'svg' =>            $i['svg'],
                                'pathID' =>         $i['pathID'],
                                'pathFull' =>       $i['path'].$i['file'],
                                'imageFull' =>      $i['imageFull'],
                                'status' =>         $i['status'],
                                'statusLabel' =>    $i['statusLabel'],
                            );
            }
        } else {
            $feedback = "Err";
        }

 } else {
    $feedback = "Err";
 }

 echo json_encode($feedback, true);

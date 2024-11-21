<?php
    include '../conx.php';
    include '../verify/verify.php';

if($Verified == "FOUND"){

    $sql = "SELECT c.id as id,
                    c.name as name,
                    c.details as details,
                    c.logo as imageID,
                    c.status as status,
                    img.name as imageName,
                    p.path as imagePath
            FROM company as c
            LEFT JOIN images AS img ON c.logo = img.id
            LEFT JOIN paths AS p ON img.type = p.type";

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
                                'details' =>        $i['details'],
                                'imageID' =>        $i['imageID'],
                                'imageFull' =>      $i['imagePath'].$i['imageName'],
                                'statusLabel' =>    $status,
                                'status' =>         $i['status'],
                            );
            }
        } else {
            $feedback = "Err";
        }

 } else {
    $feedback = "Err";
 }

 echo json_encode($feedback, true);

?>
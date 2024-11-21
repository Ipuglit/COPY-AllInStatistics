<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){

    if($Got['FOR'] == "ALL"){
        $sql = "SELECT u.id AS id,
                        u.name AS name,
                        u.type AS type,
                        u.details AS details,
                        u.logo AS imageID,
                        u.status AS status,
                        i.file AS imageName,
                        p.path AS imagePath
                    FROM unions AS u
                    LEFT JOIN images AS i ON u.logo = i.id
                    LEFT JOIN paths AS p ON i.type = p.type";
    } else if($Got['FOR'] == "ON"){
        $sql = "SELECT u.id AS id,
                        u.name AS name,
                        u.type AS type,
                        u.details AS details,
                        u.logo AS imageID,
                        u.status AS status,
                        i.file AS imageName,
                        p.path AS imagePath
                    FROM unions AS u
                    LEFT JOIN images AS i ON u.logo = i.id
                    LEFT JOIN paths AS p ON i.type = p.type
                    WHERE u.status = 0";
    }

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
                                'details' =>        $i['details'],
                                'imageID' =>        $i['logo'],
                                'imageFull' =>      $i['imagePath'].$i['imageName'],
                                'status' =>         $status,
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

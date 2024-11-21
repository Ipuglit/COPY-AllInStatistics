<?php
    include '../../conx.php';
    include '../../verify/verify.php';

 if($Verified == "FOUND"){
    $feedback = [];
    $sql = "SELECT a.id AS id,
                a.name AS name,
                a.image AS imageID,
                i.path AS imageName,
                a.status AS status,
                p.path AS path
                FROM applications AS a
                LEFT JOIN images AS i ON i.id = a.image
                LEFT JOIN paths AS p ON p.type = i.type
            WHERE a.status = 0";
    $result = $conx->query($sql);

    if ($result->num_rows > 0) {
                while ($i = $result->fetch_assoc()) {

                    $feedback[] = array(
                                'key'           => $i['id'],
                                'text'          => $i['name'],
                                'value'         => $i['id'],
                                'image'         => $i['path'].$i['imageName'],
                                );
            }
    } else {
                $feedback ="Err";
    }

} else {
        $feedback = "Err";
}

echo json_encode($feedback,true);

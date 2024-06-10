<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){

    if ( $Got['STATUS'] == "ACTIVE"){
        $Extend_Status = " a.status=0 ";
    } else if ( $Got['STATUS'] == "ACTIVEPENDING"){
        $Extend_Status = " a.status!=2 ";
    } else if ( $Got['STATUS'] == "PENDING"){
        $Extend_Status = " a.status=1 ";
    } else if ( $Got['STATUS'] == "DISABLED"){
        $Extend_Status = " a.status=2 ";
    } else {
        $Extend_Status = " a.status!=9 ";
    }

         $sql = "SELECT DISTINCT
                    a.id AS id,
                    a.name AS name,
                    p.path AS imagePath,
                    i.file AS image,
                    i.id AS imageID,
                    c.id AS companyID,
                    c.name AS company,
                    a.details AS details,
                    (SELECT COUNT(id) FROM accounts WHERE appID = a.id) AS acctCount,
                    IF(a.status = 0, 'Active', IF(a.status=1, 'Pending', 'Disabled')) AS statusLabel,
                    a.status AS status
                FROM applications AS a
                LEFT JOIN accounts AS ac ON ac.appID = a.id AND ac.status = 0
                LEFT JOIN company AS c ON a.company = c.id
                LEFT JOIN images AS i ON i.id = a.image
                left JOIN paths AS p ON p.type = i.type ".$Extend_Status;

    $result = $conx->query($sql);
    $data = [];

        if ($result->num_rows > 0) {
            while ($i = $result->fetch_assoc()) {

                 $sql2 = "SELECT COUNT(id) AS counted FROM accounts WHERE appID =".$i['id'];
                 $result2 = $conx->query($sql2);
                        if ($result2->num_rows > 0) {
                                while ($ii = $result2->fetch_assoc()) {
                                        $counted = $ii['counted'];
                                }
                        } else {
                                $counted = "0";
                        }

                $data[] = array(
                    'id' =>             $i['id'],
                    'name' =>           $i['name'],
                    'imageID' =>        $i['imageID'],
                    'imagePath' =>      $i['imagePath'],
                    'image' =>          $i['image'],
                    'imageFull' =>      $i['imagePath'].$i['image'],
                    'companyID' =>      $i['companyID'],
                    'company' =>        $i['company'],
                    'details' =>        $i['details'],
                    'statusLabel' =>    $i['statusLabel'],
                    'status' =>         $i['status'],
                    'accountCount' =>   $i['acctCount'],
                    'userCount' =>      $userCount,
                );
            }
        }
    echo json_encode($data, true);
 } else {
    echo json_encode("Err");
 }

?>
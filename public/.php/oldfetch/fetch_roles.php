<?php
    include '../conx.php';
    include '../verify/verify.php';

if($Verified == "FOUND"){

    $sql = "SELECT * FROM default_roles";

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
                                'level' =>          $i['level'],
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
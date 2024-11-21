<?php
    include '../conx.php';
    include '../verify/verify.php';

if($Verified == "FOUND"){

    if($Got['FOR'] == "LOWERMID" ){

        $Extend = "  WHERE level = 'LOWER' OR level = 'MID' ";

    } else if($Got['FOR'] == "UPPERMID" ){

        $Extend = "  WHERE level = 'UPPER' OR level = 'MID' ";

    } else if($Got['FOR'] == "MID" ){

        $Extend = "  WHERE level = 'MID' ";

    } else if($Got['FOR'] == "UPPER" ){

        $Extend = "  WHERE level = 'UPPER' ";

    } else {

        $Extend = " ";

    }

    $sql = "SELECT * FROM default_roles ".$Extend;

    $result = $conx->query($sql);
    $feedback = [];
    $counted = 0;

        if ($result->num_rows > 0) {
            while ($i = $result->fetch_assoc()) {

                $counted++;
                if($i['status']==0){
                    $status = "Active";
                } else {
                    $status = "Inactive";
                }

                $feedback[] = array(
                                'id' =>             $i['id'],
                                'increment'     =>  $counted,
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
    $feedback = "NOTFOUND";
 }

 echo json_encode($feedback, true);

?>
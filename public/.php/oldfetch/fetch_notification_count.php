<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){

        $upline = [2,3,4];
        $uppers = [5,6,7,8];

        if ( in_array($verifyRole, $upline) ){
                $sql = "SELECT COUNT(id) as counted FROM notification WHERE status=1 AND requestedTo=$verifyID";
        } else if ( in_array($verifyRole, $uppers) ){
                $sql = "SELECT COUNT(id) as counted FROM notification WHERE status=1";
        }

    $result = $conx->query($sql);

        if ($result->num_rows > 0) {
            while ($i = $result->fetch_assoc()) {
                $feedback = $i['counted'];
            }
        } else {
            $feedback = "0";
        }
} else {
    $feedback = "Err";
}

echo json_encode($feedback);
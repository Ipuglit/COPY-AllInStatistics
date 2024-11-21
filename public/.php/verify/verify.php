<?php
$Got = json_decode( file_get_contents("php://input"), true );

        date_default_timezone_set( $Got['D'] );

        $verifyID =             $Got['A'];
        $verifyToken =          $Got['B'];
        $verifyGadget =         $Got['C'];
        $verifyZone =           $Got['D'];
        $verifyTime =           time();

if(!empty($verifyID)){
        $T = "SELECT * FROM tokens WHERE userID='$verifyID' AND token='$verifyToken' AND gadget='$verifyGadget' ";
        $VERIFY_TOKEN = mysqli_query($conx, $T);
        if(mysqli_num_rows($VERIFY_TOKEN) != 0){
                $i = mysqli_fetch_array($VERIFY_TOKEN);

                $U = "SELECT * FROM users WHERE id='".$i['userID']."' ";
                $VERIFY_USER = $conx->query($U);
                if ($VERIFY_USER->num_rows > 0) {
                        while ($ii = $VERIFY_USER->fetch_assoc()) {
                                $verifyRole = $ii['role'];
                        }
                        $Verified = "FOUND";
                } else {
                        $Verified = "LOST";
                }

        } else {
                $Verified = "LOST";
        }

} else {
        $Verified = "LOST";
}
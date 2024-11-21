<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){

    if ( $Got['FOR'] == "ALL" ){
            $sql = "SELECT * FROM fxUSD WHERE status = 0 ORDER BY datestamp desc LIMIT 300";
    } else if( $Got['FOR'] == "DATE" ){
            $sql = "SELECT DISTINCT datestamp FROM fxUSD WHERE status = 0 ORDER BY datestamp desc LIMIT 200";
    } else if( $Got['FOR'] == "PROVIDER" ){
            $sql = "SELECT DISTINCT provider FROM fxUSD WHERE status = 0 ORDER BY provider asc LIMIT 200";
    } else if( $Got['FOR'] == "ByDATE" ){
            $sql = "SELECT DISTINCT * FROM fxUSD WHERE status = 0  AND datestamp='".$Got['WHAT']."' AND provider='".$Got['WHAT2']."' ORDER BY datestamp asc LIMIT 200";
    } else if( $Got['FOR'] == "PastDATE" ){
            $sql = "SELECT DISTINCT * FROM fxUSD WHERE status = 0  AND datestamp >= '".$Got['WHAT']."' AND provider='".$Got['WHAT2']."' ORDER BY datestamp asc LIMIT 200";
    } else if( $Got['FOR'] == "ByPROVIDER" ){
            $sql = "SELECT DISTINCT * FROM fxUSD WHERE status = 0  AND provider='".$Got['WHAT']."' ORDER BY datestamp asc LIMIT 200";
    } else {
            $sql = "SELECT * FROM fxUSD WHERE status = 0 ORDER BY datestamp desc LIMIT 300";
    }


    $result = $conx->query($sql);
    $data = [];

        if ($result->num_rows > 0) {
            while ($i = $result->fetch_assoc()) {

                if($i['status']==0){
                    $status = "Active";
                } else {
                    $status = "Inactive";
                }
                $data[] = array(
                    'id' =>             $i['id'],
                    'provider' =>       $i['provider'],
                    'datestamp' =>      $i['datestamp'],
                    'rates' =>          $i['rates'],
                    'status' =>         $status,
                );
            }
        }
    echo json_encode($data, true);
 } else {
    echo json_encode("Err");
 }

?>
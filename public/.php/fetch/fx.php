<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){

    $Extend_For = " WHERE id IS NOT NULL ";

    if( !empty($Got['LIMIT']) ){
        $Extend_Limit = " LIMIT ".$Got['LIMIT']." ";
    } else {
        $Extend_Limit = " LIMIT 350 ";
    }

    if ( $Got['STATUS'] == "ALL" && $Got['PROVIDER'] == "ALL" && $Got['DATE'] == "ALL" ){

        if ( $Got['SORTBY'] != "NONE" ){
            $Extend_Sort = " ORDER BY ".$Got['SORTBY']." ".$Got['SORT'];
        } else {
            $Extend_Sort = " ORDER BY id ".$Got['SORT'];
        }

        if ( !empty($Got['SEARCH']) ){
            $Extend_Search = " AND CONCAT(provider,' ',datestamp,' ',rates, ' ', DATE_FORMAT(datestamp, '%M, %d %Y')) LIKE '%".$Got['SEARCH']."%' ";
        } else {
            $Extend_Search = " ";
        }

        $Extend = " ".$Extend_For." ".$Extend_Search." ".$Extend_Sort." ".$Extend_Limit;

    } else {

        if ( $Got['STATUS'] == "ACTIVE"){
            $Extend_Status = " status=0 ";
        } else if ( $Got['STATUS'] == "ACTIVEPENDING"){
            $Extend_Status = " status!=2 ";
        } else if ( $Got['STATUS'] == "PENDING"){
            $Extend_Status = " status=1 ";
        } else if ( $Got['STATUS'] == "DISABLED"){
            $Extend_Status = " status=2 ";
        } else if ( $Got['STATUS'] == "ALL"){
            $Extend_Status = " status IN (0, 1, 2) ";
        } else {
            $Extend_Status = " status IN (0, 1, 2) ";
        }

        if ( $Got['PROVIDER'] != "ALL"){
            $Extend_Provider = " AND provider = '".$Got['PROVIDER']."' ";
        } else {
            $Extend_Provider = " ";
        }

        if ( $Got['DATE'] != "ALL"){
            $Extend_Date = " AND datestamp = '".$Got['DATE']."' ";
        } else {
            $Extend_Date = " ";
        }

        if ( !empty($Got['SEARCH']) ){
            $Extend_Search = " AND CONCAT(provider,' ',datestamp,' ',rates, ' ', DATE_FORMAT(datestamp, '%M, %d %Y')) LIKE '%".$Got['SEARCH']."%' ";
        } else {
            $Extend_Search = " ";
        }

        if ( $Got['SORTBY'] != "NONE" ){
            $Extend_Sort = " ORDER BY ".$Got['SORTBY']." ".$Got['SORT'];
        } else {
            $Extend_Sort = " ORDER BY id ".$Got['SORT'];
        }

        $Extend = " ".$Extend_For." AND ".$Extend_Status. " ".$Extend_Provider." ".$Extend_Date." ".$Extend_Search." ".$Extend_Sort." ".$Extend_Limit;
    }


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

    $Extend = " ".$Extend_Limit;

    $sql = "SELECT  id,
                    provider,
                    datestamp,
                    DATE_FORMAT(STR_TO_DATE(datestamp, '%m/%d/%Y'), '%M %d %Y') as datestamped,
                    rates,
                    status,
                    IF(status = 0, 'Active', IF(status=1, 'Pending', 'Disabled')) AS statusLabel
                    FROM fxUSD ".$Extend;

    $result = $conx->query($sql);
    $data = [];
    $counted = 0;

        if ($result->num_rows > 0) {
            while ($i = $result->fetch_assoc()) {

                $counted++;
                $data[] = array(
                    'id' =>             $i['id'],
                    'increment' =>      $counted,
                    'provider' =>       $i['provider'],
                    'datestamp' =>      $i['datestamp'],
                    'datestamped' =>    $i['datestamped'],
                    'rates' =>          $i['rates'],
                    'status' =>         $i['status'],
                    'statusLabel' =>    $i['statusLabel'],
                );
            }
        }
    echo json_encode($data, true);
 } else {
    echo json_encode("NOTFOUND");
 }

?>
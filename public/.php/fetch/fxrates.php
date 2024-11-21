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
            $Extend_Search = " AND CONCAT(provider,' ',datestamp,' ',rates, ' ', DATE_FORMAT(STR_TO_DATE(datestamp, '%m/%d/%Y'), '%M %d, %Y')) LIKE '%".$Got['SEARCH']."%' ";
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
            $Extend_Search = " AND CONCAT(provider,' ',datestamp,' ',rates, ' ', DATE_FORMAT(STR_TO_DATE(datestamp, '%m/%d/%Y'), '%M %d, %Y')) LIKE '%".$Got['SEARCH']."%' ";
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

    $Extend = " ".$Extend_Limit;

    $sql = "SELECT  id,
                    provider,
                    datestamp,
                    DATE_FORMAT(STR_TO_DATE(datestamp, '%m/%d/%Y'), '%M %d, %Y') as datestamped,
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
~
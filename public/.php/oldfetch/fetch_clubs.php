<?php
    include '../conx.php';
    include '../verify/verify.php';

    if($Verified == "FOUND"){

        if($Got['FOR'] == "ALL"){
            $extend = " ";
        } else if( $Got['FOR'] == "APP" ){
           $extend = " WHERE c.appID = ".$Got['WHAT'];
        } else if( $Got['FOR'] == "CLUB" ){
           $extend = " WHERE c.name = '".$Got['WHAT']."' ";
        } else if( $Got['FOR'] == "ACTIVEPENDING" ){
                $extend = " WHERE (c.status=0 OR c.status=1)";
        } else if( $Got['FOR'] == "ACTIVE" ){
                $extend = " WHERE c.status=0";
        } else if( $Got['FOR'] == "PENDING" ){
                $extend = " WHERE c.status=1";
        } else if( $Got['FOR'] == "DISABLED" ){
                $extend = " WHERE c.status=2";
        } else {
            $extend = " ";
        }

            $sql = "SELECT DISTINCT (SELECT COUNT(id) FROM uplines WHERE clubID = c.idd AND status=0) AS upcountActive,
                            (SELECT COUNT(id) FROM uplines WHERE clubID = c.idd AND status=1) AS upcountPending,
                            (SELECT COUNT(id) FROM uplines WHERE clubID = c.idd AND status=2) AS upcountInactive,
                            (SELECT CONCAT(p.path,i.file) FROM images AS i LEFT JOIN paths AS p ON i.type = p.type WHERE c.image = i.id) AS clubImage,
                            (SELECT CONCAT(p.path,i.file) FROM images AS i LEFT JOIN paths AS p ON i.type = p.type WHERE uni.logo = i.id) AS unionImage,
                            (SELECT CONCAT(p.path,i.file) FROM images AS i LEFT JOIN paths AS p ON i.type = p.type WHERE app.image = i.id) AS appImage,
                            c.id AS clubID,
                            c.idd AS clubIDD,
                            pe.percent AS uplineRake,
                            c.name AS clubName,
                            c.details AS clubDetails,
                            c.type AS clubType,
                            c.union AS clubUnion,
                            uni.name AS unionName,
                            c.status AS status,
                            IF(c.status = 0, 'Active', IF(c.status=1, 'Pending', 'Disabled')) AS statusLabel,
                            app.name AS appName,
                            c.appID AS appID,
                            pa.path AS path
                    FROM clubs AS c
                    LEFT JOIN percentages AS pe ON c.idd = pe.idd AND pe.type = 'CLUB' AND pe.status = 0
                    LEFT JOIN uplines AS up ON c.idd = up.clubID
                    LEFT JOIN applications AS app ON c.appID = app.id
                    LEFT JOIN unions AS uni ON c.union=uni.id
                    LEFT JOIN images AS img ON c.image = img.id
                    LEFT JOIN paths AS pa ON img.type = pa.type ".$extend ;

    $result = $conx->query($sql);
    $data = [];

        if ($result->num_rows > 0) {
            while ($i = $result->fetch_assoc()) {

                $data[] = array(
                    'id'                => $i['clubID'],
                    'idd'               => $i['clubIDD'],
                    'name'              => $i['clubName'],
                    'image'             => $i['clubImage'],
                    'details'           => $i['clubDetails'],
                    'percent'           => $i['uplineRake'],
                    'type'              => $i['clubType'],
                    'unionID'           => $i['clubUnion'],
                    'unionName'         => $i['unionName'],
                    'unionImage'        => $i['unionImage'],
                    'usersActive'       => $i['upcountActive'],
                    'usersPending'      => $i['upcountPending'],
                    'usersInactive'     => $i['upcountInactive'],
                    'appID'             => $i['appID'],
                    'appName'           => $i['appName'],
                    'appImage'          => $i['appImage'],
                    'statusLabel'       => $i['statusLabel'],
                    'status'            => $i['status'],
                );
            }
        } else {
            $data[] = array("idd"=>null);
        }
    echo json_encode($data, true);
 } else {
    echo json_encode("Err");
 }

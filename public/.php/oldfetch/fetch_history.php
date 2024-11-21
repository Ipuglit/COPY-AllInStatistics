<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){
        if($Got['FOR']=="ALL"){
                $extend = " ";
        } else {
                $extend = " WHERE h.userID = $verifyID ";
        }

         $sql = "SELECT h.id AS historyID,
                    h.userID AS userID,
                    u.nickname AS userNickname,
                    r.name AS userRole,
                    img.file AS image,
                    pa.path AS path,
                    h.datetime AS etime,
                    FROM_UNIXTIME(h.datetime, '%M %D, %Y %h:%i:%s') AS dtime,
                    h.gadget AS gadget,
                    h.timezone AS timezone,
                    h.action AS action,
                    h.for AS hfor,
                    h.details AS details
            FROM history AS h
            LEFT JOIN users AS u ON u.id = h.userID
            LEFT JOIN default_roles AS r ON r.id = h.userRole
            LEFT JOIN images AS img ON u.avatar = img.id
            LEFT JOIN paths AS pa ON img.type = pa.type".
            $extend
           ." ORDER by h.id DESC ";

    $result = $conx->query($sql);
    $data = [];

        if ($result->num_rows > 0) {
            while ($i = $result->fetch_assoc()) {

                $DT             = $i['dtime'];
                $UTC            = new DateTimeZone("UTC");
                $TZ             = new DateTimeZone($verifyZone);
                $datetime       = new DateTime($DT, $UTC);
                $datetime->setTimezone($TZ);
                $DTime          = $datetime->format('F d, Y h:i:s A (P)');

                $data[] = array(
                    'id' =>             $i['historyID'],
                    'userID' =>         $i['userID'],
                    'userNickname' =>   $i['userNickname'],
                    'userRole' =>       $i['userRole'],
                    'userImage' =>      $i['path'].$i['image'],
                    'datetime' =>       $DTime,
                    'edatetime' =>      $i['etime'],
                    'gadget' =>         $i['gadget'],
                    'timezone' =>       $i['timezone'],
                    'action' =>         $i['action'],
                    'for' =>            $i['hfor'],
                    'details' =>        $i['details'],
                );
            }
        }
    echo json_encode($data, true);
 } else {
    echo json_encode("Err");
 }

?>
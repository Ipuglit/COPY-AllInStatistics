<?php
    include '../conx.php';
    include '../verify/verify.php';

if($Verified == "FOUND"){
        $sql = "SELECT u.id AS id,
                    u.role AS role,
                    u.nickname AS nickname,
                    u.email AS email,
                    u.telegram AS telegram,
                    u.username as username,
                    u.password AS password,
                    u.avatar AS avatarID,
                    CONCAT(p.path,i.file) AS avatarFull,
                    IF(u.status = 0, 'Active', IF(u.status = 1, 'Pending', 'Inactive')) as statusLabel,
                    u.status AS status,
                    r.name AS rolename,
                    i.file as file,
                    p.path as path
                FROM users AS u
                LEFT JOIN default_roles AS r ON u.role = r.id
                LEFT JOIN images AS i ON u.avatar = i.id
                LEFT JOIN paths AS p ON i.type = p.type
                WHERE u.id=$verifyID";
        $result = $conx->query($sql);
        if ($result->num_rows > 0) {
            while ($i = $result->fetch_assoc()) {
                $feedback = array(
                                "id" =>         $i['id'],
                                "role" =>       $i['role'],
                                "rolename" =>   $i['rolename'],
                                "nickname" =>   $i['nickname'],
                                "email" =>      $i['email'],
                                "telegram" =>      $i['telegram'],
                                "username" =>   $i['username'],
                                "avatarID" =>   $i['avatarID'],
                                "avatarFull" => $i['avatarFull'],
                                "status" =>     $i['status'],
                                "statusLabel" =>     $i['statusLabel'],
                                );
            }
        } else {
            $feedback = "Err";
        }
}else {
    $feedback = "NOTFOUND";
}

echo json_encode($feedback);
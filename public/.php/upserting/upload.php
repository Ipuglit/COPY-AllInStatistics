<?php
    include '../conx.php';
    include '../verify/verify.php';

 if($Verified == "FOUND"){

        $uploadDir = 'https://54.252.185.246/poker/upserting/';
        $uploadFile = $uploadDir . basename($_FILES['image']['name']);

        if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
            $feedback = "File is valid, and was successfully uploaded.\n";
        } else {
            $feedback = "Possible file upload attack!\n";
        }

        print_r($_FILES);

    } else {
        $feedback = "NOTFOUND";
    }

    echo $feedback;

?>
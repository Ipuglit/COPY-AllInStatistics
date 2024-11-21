<?php
include '../conx.php';

if (!empty($_FILES) && isset($_FILES['image'])) {

    $targetDir = '/var/www/html/pokerapp/files/';
    $targetFile = $targetDir . basename($_FILES['image']['name']);

    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
        echo "File uploaded successfully!";
    } else {
        echo "Error uploading file.";
    }


} else {
    echo "None";
}
?>
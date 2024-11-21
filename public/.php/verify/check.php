<?php

        include "../conx.php";
        $verifyID = 1;
        $verifyToken = "3fb20d4088d7c39647cf3957d2287b10";
        $verifyGadget = "Computer: Windows";
        include "./verify.php";

        if($Verified == "FOUND"){
          echo "Found ya!".$verifyRole;
        } else {
          echo "Cannot be found...";
        }

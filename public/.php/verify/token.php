<?php

    $check = mysqli_query($conx,"SELECT 1 from tokens
                                 WHERE userID='$userID' AND gadget='$userGadget' ");

    if (mysqli_num_rows($check)==0){ //if nothing found, CREATE

        mysqli_query($conx,"INSERT INTO tokens (userID, gadget, token)
                            VALUES ('$userID', '$userGadget', '$userToken') ");

    } else { //if found more than 0, UPDATE

        mysqli_query($conx,"UPDATE tokens
                            SET  userID='$userID', token='$userToken', gadget='$userGadget'
                            WHERE userID='$userID' AND gadget='$userGadget' ");

    }
?>
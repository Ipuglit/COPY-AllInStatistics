<?php

if(!empty($verifyID)){

    try {

        $sql_notification = "INSERT INTO notification
                            (`type`,`details`,`requestedID`,`requestedBy`,`requestedTo`,`requestTime`,`requestMessage`,`approvedBy`,`approvedTime`,`approvedMessage`,`status`)
                            VALUES
                            ($requestType, $requestDetails,$requestID,$verifyID,'$requestTo','$requestMessage','$requestApprovedBy','$requestApprovedTime','$requestApprovedMessage','$requestStatus')";

        if ($conx->query($sql_notification) === TRUE) {
            $feedback_notification = "Added";
        } else {
            $feedback_notification = "Err";
        }

    } catch (Exception $e) {
        $feedback_notification = "Err";
    }

}
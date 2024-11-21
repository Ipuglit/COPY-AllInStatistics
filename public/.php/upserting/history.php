<?php

if(!empty($verifyID)){

    try {

        $sql_history = "INSERT INTO history (`userID`, `userRole`, `datetime`, `gadget`, `timezone`, `action`, `dash`, `details`)
                            VALUES ($verifyID, $verifyRole, $verifyTime, '$verifyGadget', '$verifyZone', '$historyAction', '$historyFor', '$historyDetails')";

        if ($conx->query($sql_history) === TRUE) {
            $feedback_history = "Added";
        } else {
            $feedback_history = "Err";
        }

    } catch (Exception $e) {
        $feedback_history = "Err";
    }

}
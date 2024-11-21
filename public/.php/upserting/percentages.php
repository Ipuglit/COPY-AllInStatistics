<?php

if( !empty($verifyID) && !empty($percentType) ){

    try {

            $check_percentages = "SELECT * FROM percentages
                                    WHERE `type`        = '$percentType'
                                        AND `idd`       = $idd
                                        AND `status`    = 0 ";

            $insert_percentages = "INSERT INTO percentages (`type`, `idd`, `percent`, `status`, `stated`, `statedBy`)
                                VALUES ('$percentType', $idd, $percent, 0, $verifyTime, $verifyID)";

            try {

                $duplicate_percentages = $conx->query($check_percentages);

                if ($duplicate_percentages->num_rows > 0) {

                        while ($i = $duplicate_percentages->fetch_assoc()) {
                                $gotID          = $i["id"];
                                $gotPercent     = $i["percent"];
                        }

                        if($gotPercent != $percent){

                                $update_percentages = "UPDATE `percentages` SET `status`=2 WHERE `id`=$gotID";

                                if ($conx->query($update_percentages) === TRUE) {

                                    if ($conx->query($insert_percentages) === TRUE) {

                                        $gotnewID           = mysqli_insert_id($conx);
                                        $historyAction      = "REPLACED";
                                        $historyFor         = "PERCENTAGES";
                                        $historyDetails     = "ID: ".$gotID." => ".$gotnewID .", Type: ".$percentType.": ".$prcntIDD.", Percent: ".$percent;
                                        include './history.php';

                                    } else {
                                        $feedback_percentages = "Err update ".$percentType." - ".$idd." - ".$percent." - ".$verifyTime." - ".$verifyID;
                                    }
                                }

                        } else {
                            $feedback_percentages = "No Changes";
                        }

                } else {

                        if ($conx->query($insert_percentages) === TRUE) {

                            $gotnewID1          = mysqli_insert_id($conx);
                            $historyAction      = "ADDED";
                            $historyFor         = "PERCENTAGES";
                            $historyDetails     = "ID: ".$gotnewID1 .", Type: ".$percentType.": ".$prcntIDD.", Percent: ".$percent;
                            include './history.php';

                        } else {
                            $feedback_percentages = "Err Add ".$percentType." - ".$idd." - ".$percent." - ".$verifyTime." - ".$verifyID;
                        }

                }

            } catch (Exception $e) {
                $feedback_percentages = "Err 2nd ".$percentType." - ".$idd." - ".$percent." - ".$verifyTime." - ".$verifyID;
            }

    } catch (Exception $e) {
        $feedback_percentages = "Err 1st".$percentType." - ".$idd." - ".$percent." - ".$verifyTime." - ".$verifyID;
    }

} else {
    $feedback_percentages = "NOTFOUND";
}
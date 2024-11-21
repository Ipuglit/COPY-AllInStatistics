<?php

if( !empty($verifyID) && !empty($Got['percent_Type']) && !empty($Got['percent_Value']) ){

    try {

        $prcntType      = $Got['percent_Type'];
        $prcntIDD       = $Got['percent_IDD'];
        $prcntValue     = $Got['percent_Value'];

        if( $prcntType == "CLUB"){

            $check_percentages = "SELECT * FROM percentages
                                    WHERE `type`        = '$prcntType'
                                        AND `idd`       = $prcntIDD
                                        AND `status`    = 0 ";

            $insert_percentages = "INSERT INTO percentages (`type`, `idd`, `percent`, `status`, `stated`, `statedBy`)
                                VALUES ('CLUB', $prcntIDD, $prcntValue, 0, $verifyTime, $verifyID)";

        } else if( $prcntType == "UPLINE"){

            $check_percentages = "SELECT * FROM percentages
                                    WHERE `type`            = '$prcntType'
                                        AND `idd`           = $new_ID
                                        AND `status`        = 0 ";

            $insert_percentages = "INSERT INTO percentages (`type`,`idd`, `percent`, `status`, `stated`, `statedBy`)
                                VALUES ('UPLINE', $new_ID, $prcntValue, 0, $verifyTime, $verifyID)";

        }

            try {

                $duplicate_percentages = $conx->query($check_percentages);

                if ($duplicate_percentages->num_rows > 0) {

                        while ($i = $duplicate_percentages->fetch_assoc()) {
                                $gotID          = $i["id"];
                                $gotPercent     = $i["percent"];
                        }
                        if($gotPercent != $prcntValue){

                                $update_percentages = "UPDATE `percentages` SET `status`=2 WHERE `id`=$gotID";

                                if ($conx->query($update_percentages) === TRUE) {

                                    if ($conx->query($insert_percentages) === TRUE) {

                                        $gotnewID           = mysqli_insert_id($conx);
                                        $historyAction      = "REPLACED";
                                        $historyFor         = "PERCENTAGES";
                                        $historyDetails     = "ID: ".$gotID." => ".$gotnewID .", Type: ".$prcntType.": ".$prcntIDD.", Percent: ".$prcntValue;
                                        include './history.php';

                                    } else {
                                        $feedback_percentages = "Err Add";
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
                            $historyDetails     = "ID: ".$gotnewID1 .", Type: ".$prcntType.": ".$prcntIDD.", Percent: ".$prcntValue;
                            include './history.php';

                        } else {
                            $feedback_percentages = "Err Add";
                        }

                }

            } catch (Exception $e) {
                $feedback_percentages = "Err";
            }

    } catch (Exception $e) {
        $feedback_percentages = "Err";
    }

} else {
    $feedback_percentages = "Err";
}

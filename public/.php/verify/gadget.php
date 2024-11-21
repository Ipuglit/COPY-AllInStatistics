<?php
    $Mobile =                   is_numeric(strpos(strtolower($_SERVER["HTTP_USER_AGENT"]), "mobile"));
    $Tablet =                   is_numeric(strpos(strtolower($_SERVER["HTTP_USER_AGENT"]), "tablet"));
    $Windows =                  is_numeric(strpos(strtolower($_SERVER["HTTP_USER_AGENT"]), "windows"));
    $Android =                  is_numeric(strpos(strtolower($_SERVER["HTTP_USER_AGENT"]), "android"));
    $iPhone =                   is_numeric(strpos(strtolower($_SERVER["HTTP_USER_AGENT"]), "iphone"));
    $iPAD =                     is_numeric(strpos(strtolower($_SERVER["HTTP_USER_AGENT"]), "ipad"));
    $IOS =                      $iPhone || $iPAD;
    if($Mobile){ if($Tablet){  $userGadget = "Tablet";   } else {  $userGadget = "Mobile";  } } else { $userGadget = "Computer"; }
    if($IOS){ $OS = "IOS"; } else if($Android){ $OS = "Android"; } else if($Windows){ $OS = "Windows";  } else { $OS = "Unknown"; }
    $userGadget = $userGadget.": ".$OS;
?>
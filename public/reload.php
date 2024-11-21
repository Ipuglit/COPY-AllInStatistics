<?php
include './conx.php';
 $previousPage = $_SERVER['HTTP_REFERER'];
header("Location: $previousPage");
echo "Yes";
exit;
~
~
~
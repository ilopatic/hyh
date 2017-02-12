<?php
$fileName = trim($_GET['fileName']);
print file_get_contents($fileName);
?>
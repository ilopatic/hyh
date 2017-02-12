<?php
include '../classes/adminUsers.php';

$action = trim($_GET['action']);
$objUsers = new adminUsers();

switch ($action){
	case "loginUser":
		$username = trim($_GET['username']); $password = trim($_GET['password']);
		$objUsers->setUsernamePassword($username,$password);
		print $objUsers->loginUser();
		break;
}
?>
<?php
include '../classes/adminActivities.php';

$action = trim($_GET['action']);
$objActivities = new adminActivities();

switch ($action){
	case "getActivitiesList":
		$objActivities->setGroupId(trim($_GET['groupId']));
		print $objActivities->getActivitiesList();
		break;
	case "getActivity":
		$objActivities->setActivityId(trim($_GET['activityId']));
		print $objActivities->getActivity();
		break;
	case "processActivity":
		$strInvalid = validateActivity($_POST,$_FILES);
		if(strlen($strInvalid) == 0){
			$objActivities->processActivity($_POST,$_FILES);
			print $objActivities->getGroupId();
		}
		else{
			print $strInvalid;
		}
		break;
	case "buildActivityGroupJson":
		$objActivities->setGroupId(trim($_GET['groupId']));
		$objActivities->setJsonFileName();
		$json = $objActivities->buildActivityGroupJson();
		file_put_contents($objActivities->getJsonFileName(), $json);
		print $json;
		break;
}

function validateActivity($objForm,$objFile){
	$arrRuleIds = explode(",",$objForm['existingRuleIdList']);
	$newRuleCount = $objForm['newRuleCount'];
	$idList = "";
	$err = "";
	
	//validate main data building err message for each failure
	if(strlen(trim($objForm['activityTitle'])) == 0){$err = $err."Title cannot be blank\n";}
	//if(strlen(trim($objForm['activityPun'])) == 0){$err = $err."Pun cannot be blank\n";}
	if(strlen(trim($objForm['activityPeople'])) == 0){$err = $err."People cannot be blank\n";}
	if(strlen(trim($objForm['activityWhatToDo'])) == 0){$err = $err."What To Do cannot be blank\n";}
	if(strlen(trim($objForm['activityOpinion'])) == 0){$err = $err."Opinion cannot be blank\n";}
	
	//validate new rules if the exist
	if($newRuleCount > 0){
		for ($a = 1; $a <= $newRuleCount; $a++){
			if(strlen(trim($objForm['activityRule-'.$a])) == 0){$idList = $idList."-".$a.",";}
		}
	}

	//validate existing rules if they exist
	if(strlen($objForm['existingRuleIdList']) > 0 && is_array($arrRuleIds)){
		for ($a = 0; $a < count($arrRuleIds); $a++){
			if(strlen(trim($objForm['activityRule'.$arrRuleIds[$a]])) == 0){$idList = $idList.$arrRuleIds[$a].",";} 
		}
	}

	//build err message if any rules fail validation
	if(strlen($idList) > 0){$err = $err."Rules cannot be blank";}

	//build err message if new activity and no icon
	//if(!isset($objFile["activityIcon"]) && $objForm['activityId'] == 0){$err = $err."You must upload an icon\n";}
	
	return $err;
}
?>
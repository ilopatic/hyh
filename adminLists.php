<?php
include '../classes/adminLists.php';

$action = trim($_GET['action']);
$objList = new lists();

switch ($action){
	case "getLists":																															//get json data structure of lists 
		$objList->setListIds(trim($_GET['listIds']));																	//set object list ids via url param
		print $objList->getListsJson();																								//builds lists json and return
		break;
	case "getListGroup":																													//get json data structure of lists from one list group
		$objList->setListTypeId(trim($_GET['listTypeId']));														//set object list type id via url param
		print $objList->getListGroupJson();																						//builds lists json and return
		break;
	case "processList":																														//process one list via form variables
		$strResult = validateListData($_POST);																				//validate form data
		if($strResult){																																//if valid
			$objList->setFormObjects($_POST,$_FILES);																			//set list objects with form and file objects
			$objList->processList();																											//process form data
		}
		print $strResult;																															//return true of false for process success flag
		//print $objList->getSql();
		break;
	case "buildListJson":																													//build json list file
		$objList->setListTypeId($_GET['listTypeId']);																	//set the list type id via url param
		$objList->setJsonListName($_GET['jsonListName']);															//set the list name of the json structure via url param
		$json = $objList->buildListJson();																						//build the json data structure, in this process the list object language id will be set
		$objList->setJsonFileName($_GET['jsonFileName']);															//set the json file name
		file_put_contents($objList->getJsonFileName(), $json);												//put json file in its place
		print $json;
		break;
}

function validateListData($objForm){																						//validate form data
	$success = true;																																//default success flag to true
	$arrIds = explode(",",rtrim($objForm['itemIdList'],","));												//create existing items array from id list

	for($a = 0; $a < count($arrIds); $a++){																					//loop through array
		if(strlen(trim($objForm['liId'.$arrIds[$a]])) == 0){$success = false;}					//if validation fails on one item set success flag to false
	}

	if($objForm["newItemCount"] > 0){																							//if there are new items
		for($a = 1; $a <= $objForm["newItemCount"]; $a++){														//loop through form object
			if(strlen(trim($objForm['liId-'.$a])) == 0){$success = false;}								//if validation fails on one item set success flag to false
		}
	}

	return $success;																															//return success flag
}
?>
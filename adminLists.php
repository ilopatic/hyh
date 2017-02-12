<?php
class lists{	
	private $link, $rset, $record, $today, $listIds, $html, $objForm, $objFile, $jsonListName, $sql, $id, $cnt, $iconDir, $iconName, $listId, $listTypeId, $languageId, $dataDir, $jsonFileName;
	private $listItem, $listTitle, $listActive;
	
	public function __construct(){
		$this->link = mysql_connect("localhost", "Igor", "123");
		mysql_select_db("hyh", $this->link);
		$this->today = date('Y-m-d');
		$this->iconDir = "../../pics/";
		$this->iconName = "iconList";
		$this->dataDir = "../data/";
	}

	public function setListIds($listIds){ $this->listIds = $listIds; }
	public function setListId($listId){ $this->listId = $listId; }
	public function setFormObjects($objForm,$objFile){ $this->objForm = $objForm;	$this->objFile = $objFile; }
	public function getJsonFileName(){ return $this->jsonFileName; }
	public function setListTypeId($listTypeId){ $this->listTypeId = $listTypeId;}
	public function setJsonListName($jsonListName){ $this->jsonListName = $jsonListName; }
	public function setJsonFileName($fileName){ $this->jsonFileName = $this->dataDir.$this->languageId.$fileName.".json"; }
	private function setLanguageId($languageId){$this->languageId = $languageId;}
	
	//public function getSql(){return $this->sql;}

	//replace special characters with html numbers
	private function specialCharacters($var){
		$var = str_replace('"', '&#34;', $var);
		$var = str_replace("'", "&#39;", $var);
		return $var;
	}

	public function getListsJson(){
		$this->cnt = 0;	$this->id = 0;
		$this->sql = "select l.listId, l.title, l.icon, l.active, li.listItemId, li.title as listItem ".
								 "from lists as l inner join listItems as li on l.listId = li.listId ".
								 "where l.listId in (".$this->listIds.") order by l.listId, li.listItemId;";
		$this->rset = mysql_query($this->sql, $this->link);

		//start items structure build
		$this->html = "{\"lists\" : [";
			while($row = mysql_fetch_array($this->rset, MYSQL_BOTH)){
				if($this->id != $row['listId']){
					//if not in first iteration finish of items structure build
					if($this->cnt > 0){$this->html = rtrim($this->html, ",")."]},";}
					//build list main data and first item
					$this->html = $this->html."{\"id\" : \"".$row['listId']."\",";
					$this->html = $this->html."\"active\" : \"".$row['active']."\",";
					$this->html = $this->html."\"title\" : \"".$this->specialCharacters($row['title'])."\",";
					$this->html = $this->html."\"icon\" : \"".$row['icon']."\",";
					$this->html = $this->html."\"items\" : [{\"listItemId\" : \"".$row['listItemId']."\", \"listItem\" : \"".$this->specialCharacters($row['listItem'])."\"},";
				}
				else{
					//build remaining items
					$this->html = $this->html."{\"listItemId\" : \"". $row['listItemId']."\", \"listItem\" : \"".$this->specialCharacters($row['listItem'])."\"},";
				}
				
				//store this list id
				$this->id = $row['listId']; $this->cnt = $this->cnt + 1;
			}
			//finish of items structure build
			$this->html = rtrim($this->html, ",")."]}";

		//finish of list structure build
		$this->html = $this->html."]}";

		return $this->html;
	}
	
	public function getListGroupJson(){
		$this->cnt = 0;	$this->id = 0;
		$this->sql = "select l.listId, l.title, l.icon, l.active, li.listItemId, li.title as listItem ".
								 "from lists as l inner join listItems as li on l.listId = li.listId ".
								 "where l.listTypeId = ".$this->listTypeId;
		$this->rset = mysql_query($this->sql, $this->link);

		//start items structure build
		$this->html = "{\"lists\" : [";
			while($row = mysql_fetch_array($this->rset, MYSQL_BOTH)){
				if($this->id != $row['listId']){
					//if not in first iteration finish of items structure build
					if($this->cnt > 0){$this->html = rtrim($this->html, ",")."]},";}
					//build list main data and first item
					$this->html = $this->html."{\"id\" : \"".$row['listId']."\",";
					$this->html = $this->html."\"active\" : \"".$row['active']."\",";
					$this->html = $this->html."\"title\" : \"".$this->specialCharacters($row['title'])."\",";
					$this->html = $this->html."\"icon\" : \"".$row['icon']."\",";
					$this->html = $this->html."\"items\" : [{\"listItemId\" : \"".$row['listItemId']."\", \"listItem\" : \"".$this->specialCharacters($row['listItem'])."\"},";
				}
				else{
					//build remaining items
					$this->html = $this->html."{\"listItemId\" : \"". $row['listItemId']."\", \"listItem\" : \"".$this->specialCharacters($row['listItem'])."\"},";
				}
				
				//store this list id
				$this->id = $row['listId']; $this->cnt = $this->cnt + 1;
			}
			//finish of items structure build
			$this->html = rtrim($this->html, ",")."]}";

		//finish of list structure build
		$this->html = $this->html."]}";

		return $this->html;
	}

	//execute all steps involved in processing one list
	public function processList(){
		$this->setListId($this->objForm['listId']);
		if(isset($this->objForm['delItemIdList'])){ $this->deleteListItems(); }
		$this->updateListItems();
		$this->insertListItems();
		$this->uploadListIcon();
		$this->uploadListActive();
	}

	private function deleteListItems(){
		$arrIds = $this->objForm['delItemIdList'];
		for($a = 0; $a < count($arrIds); $a++){
			 mysql_query("CALL spDeleteListItem(".$arrIds[$a].")", $this->link);
		}
	}

	private function updateListItems(){
		$arrIds = explode(",",rtrim($this->objForm['itemIdList'],","));
		for($a = 0; $a < count($arrIds); $a++){
			if(isset($this->objForm['liId'.$arrIds[$a]])){
			 mysql_query("CALL spUpdateListItem(".$arrIds[$a].",'".trim(str_replace("'","''",$this->objForm["liId".$arrIds[$a]]))."')", $this->link);
			}
		}
	}
	
	private function insertListItems(){
		if($this->objForm["newItemCount"] > 0){
			for($a = 1; $a <= $this->objForm["newItemCount"]; $a++){
				mysql_query("CALL spInsertListItem(".$this->listId.",'".trim(str_replace("'","''",$this->objForm['liId-'.$a]))."');", $this->link);
			}
		}
	}
	
	private function uploadListIcon(){
		if(isset($this->objFile["listIcon"])){
			if ($this->objFile["listIcon"]["error"] > 0){print "Error: ".$this->objFile["listIcon"]["error"]."<br>";}
			else{
				$extension = pathinfo($this->objFile["listIcon"]["name"], PATHINFO_EXTENSION);
				$this->iconName = $this->iconName.$this->listId.".".$extension;
				move_uploaded_file($this->objFile["listIcon"]["tmp_name"], $this->iconDir.$this->iconName);
				mysql_query("CALL spUpdateListIcon(".$this->listId.",'".$this->iconName."');");
			}
		}
	}
	
	public function uploadListActive(){
		if(isset($this->objForm["listActive"])){ $this->listActive = 1; }	else{ $this->listActive = 0; }
		mysql_query("update lists set active = ".$this->listActive." where listId = ".$this->listId.";", $this->link);
	}
	
	//build a json file with lists from one list type
	public function buildListJson(){
		$this->id = 0; $this->cnt = 0;
		$this->rset = mysql_query("CALL spGetListsByTypeId(".$this->listTypeId.")", $this->link);

		$this->html = "{\r\n".
			"\t\"".$this->jsonListName."\" : [\r\n";

		while($row = mysql_fetch_array($this->rset, MYSQL_BOTH)){
			//if changing activities
			if($this->id != $row['listId']){
				//finish of rule structure from previous loop iteration
				if($this->cnt > 0){
					$this->html = rtrim($this->html, ",\r\n");
					$this->html = $this->html."\r\n\t\t\t\t\t]\r\n".
						"\t\t\t\t}\r\n".
							"\t\t\t]\r\n".
								"\t\t},\r\n";
				}

				//build list main data and first item
				$this->html = $this->html."\t\t{\r\n".
					"\t\t\t\"list\" : [\r\n".
						"\t\t\t\t{\t\"id\" : \"".$row['listId']."\",\r\n".
						"\t\t\t\t\t\"title\" : \"".$this->specialCharacters($row['title'])."\",\r\n".
						"\t\t\t\t\t\"icon\" : \"".$row['icon']."\",\r\n".
						"\t\t\t\t\t\"items\" : [\r\n".
							"\t\t\t\t\t\t{\"item\" : \"".$this->specialCharacters($row['listItem'])."\"},\r\n";
			}
			else{
				//build all remaining items
				$this->html = $this->html."\t\t\t\t\t\t{\"item\" : \"".$this->specialCharacters($row['listItem'])."\"},\r\n";
			}

			//get next list id
			$this->id = $row['listId']; $this->cnt = $this->cnt + 1; $this->setLanguageId($row['languageId']);
		}

		//remove trailing comma and finish of item structure from last rule
		$this->html = rtrim($this->html, ",\r\n");
							$this->html = $this->html."\r\n\t\t\t\t\t]\r\n".
						"\t\t\t\t}\r\n".
					"\t\t\t]\r\n".
				"\t\t}\r\n".
			"\t]\r\n".
		"}";

		return $this->html;
	}	
}
?>
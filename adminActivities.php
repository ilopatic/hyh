<?php
class adminActivities{	
	private $link, $rset, $record, $today, $groupId, $activityId, $html, $objForm, $objFile, $iconDir, $iconName, $dataDir, $jsonFileName, $newRuleCount, $arrRuleIds, $active, $id, $cnt;

	public function __construct(){
		$this->link = mysql_connect("localhost", "Igor", "123");
		mysql_select_db("hyh", $this->link);
		$this->today = date('Y-m-d');
		$this->iconDir = "../../pics/";
		$this->iconName = "iconActivity";
		$this->dataDir = "../data/";
	}

	public function setActivityId($activityId){ $this->activityId = $activityId; }
	public function getActivityId(){ return $this->activityId; }
	public function setGroupId($groupId){ $this->groupId = $groupId; }
	public function getGroupId(){ return $this->groupId; }
	public function setJsonFileName(){ $this->jsonFileName = $this->dataDir."groupActivities".$this->groupId.".json"; }
	public function getJsonFileName(){ return $this->jsonFileName; }
	private function setNewRuleCount(){ $this->newRuleCount = $this->objForm['newRuleCount']; }
	private function setActiveStatus(){ if(isset($this->objForm['active'])){$this->active = 1;} else {$this->active = 0;} }
	private function setActivityFormObjects($objForm,$objFile){ $this->objForm = $objForm;	$this->objFile = $objFile; }
	
	//replace special characters with html numbers
	private function specialCharacters($var){
		$var = str_replace('"', '&#34;', $var);
		$var = str_replace("'", "&#39;", $var);
		return $var;
	}

	public function getActivitiesList(){
		$this->rset = mysql_query("CALL spGetActivitiesList(".$this->groupId.")", $this->link);
		
		$this->html = "{\"activities\" : [";
			while($row = mysql_fetch_array($this->rset, MYSQL_BOTH)){
				$this->html = $this->html."{"."\"activityId\" : \"".$row['activityId']."\","."\"title\" : \"".$this->specialCharacters($row['title'])."\","."\"icon\" : \"".$row['icon']."\"},";
			}
			$this->html = rtrim($this->html, ",");
		$this->html = $this->html."]}";

		return $this->html;
	}

	public function getActivity(){
		$this->rset = mysql_query("CALL spGetActivity(".$this->activityId.")", $this->link);
		$this->record = mysql_fetch_array($this->rset, MYSQL_BOTH);

		$this->html = "{".
			"\"title\" : \"".$this->specialCharacters($this->record['title'])."\",".
			"\"pun\" : \"".$this->specialCharacters($this->record['pun'])."\",".
			"\"icon\" : \"".$this->record ['icon']."\",".
			"\"people\" : \"".$this->specialCharacters($this->record['people'])."\",".
			"\"whatToDo\" : \"".$this->specialCharacters($this->record['whatToDo'])."\",".
			"\"opinion\" : \"".$this->specialCharacters($this->record['opinion'])."\",".
			"\"active\" : ".$this->record ['active'].",".
			"\"rules\" : [{\"id\" : \"".$this->record['activityRuleId']."\",\"rule\" : \"".$this->specialCharacters($this->record['rule'])."\",\"active\" : \"".$this->record['ruleActive']."\"},";

			while($row = mysql_fetch_array($this->rset, MYSQL_BOTH)){			
				$this->html = $this->html."{\"id\" : \"".$row['activityRuleId']."\",\"rule\" :\"".$this->specialCharacters($row['rule'])."\",\"active\" : \"".$row['ruleActive']."\"},";
			}
			$this->html = rtrim($this->html, ",");
		$this->html = $this->html."]}";

		return $this->html;
	}
	
	//build a json file with activities from one group
	public function buildActivityGroupJson(){
		$this->id = 0; $this->cnt = 0;
		$this->rset = mysql_query("CALL spGetActivityGroup(".$this->groupId.")", $this->link);

		$this->html = "{\r\n".
			"\t\"activities\" : [\r\n";

		while($row = mysql_fetch_array($this->rset, MYSQL_BOTH)){
			//if changing activities
			if($this->id != $row['activityId']){
				//finish of rule structure from previous loop iteration
				if($this->cnt > 0){
					$this->html = rtrim($this->html, ",\r\n");
					$this->html = $this->html."\r\n\t\t\t\t\t]\r\n".
						"\t\t\t\t}\r\n".
							"\t\t\t]\r\n".
								"\t\t},\r\n";
				}

				//build activity main data and first rule
				$this->html = $this->html."\t\t{\r\n".
					"\t\t\t\"id\" : ".$row['activityId'].",\r\n".
					"\t\t\t\"activity\" : [\r\n".
					"\t\t\t\t{\t\"title\" : \"".$this->specialCharacters($row['title'])."\",\r\n".
					"\t\t\t\t\t\"pun\" : \"".$this->specialCharacters($row['pun'])."\",\r\n".
					"\t\t\t\t\t\"icon\" : \"".$this->specialCharacters($row['icon'])."\",\r\n".
					"\t\t\t\t\t\"people\" : \"".$this->specialCharacters($row['people'])."\",\r\n".
					"\t\t\t\t\t\"whatToDo\" : \"".$this->specialCharacters($row['whatToDo'])."\",\r\n".
					"\t\t\t\t\t\"opinion\" : \"".$this->specialCharacters($row['opinion'])."\",\r\n".
						"\t\t\t\t\t\"rules\" : [\r\n".
							"\t\t\t\t\t\t{\"rule\" : \"".$this->specialCharacters($row['rule'])."\"},\r\n";
			}
			else{
				//build all remaining rules
				$this->html = $this->html."\t\t\t\t\t\t{\"rule\" : \"".$this->specialCharacters($row['rule'])."\"},\r\n";
			}

			//store this activity id
			$this->id = $row['activityId']; $this->cnt = $this->cnt + 1;
		}

		//remove trailing comma and finish of rule structure from last rule
		$this->html = rtrim($this->html, ",\r\n");
							$this->html = $this->html."\r\n\t\t\t\t\t]\r\n".
						"\t\t\t\t}\r\n".
					"\t\t\t]\r\n".
				"\t\t}\r\n".
			"\t]\r\n".
		"}";

		return $this->html;
	}

	//execute all steps involved in processing one activity
	public function processActivity($objForm,$objFile){
		$this->setActivityFormObjects($objForm,$objFile);
		$this->setActivityId($this->objForm['activityId']);
		$this->setGroupId($this->objForm['activityGroupId']);
		$this->setActiveStatus();
		$this->arrRuleIds = explode(",",$this->objForm['existingRuleIdList']);
		$this->setNewRuleCount();
		$this->processActivityData();
		$this->uploadActivityIcon();
		$this->processActivityRules();
		$this->processActivityGroupLink();
	}
	
	private function processActivityData(){
		if($this->activityId == 0){
			//add new activity
			mysql_query("CALL spInsertActivity(".
				"'".trim(str_replace("'","''",$this->objForm['activityTitle']))."',".
				"'',".
				"'".trim(str_replace("'","''",$this->objForm['activityPun']))."',".
				"'".trim(str_replace("'","''",$this->objForm['activityPeople']))."',".
				"'".trim(str_replace("'","''",$this->objForm['activityWhatToDo']))."',".
				"'".trim(str_replace("'","''",$this->objForm['activityOpinion']))."',".
				$this->active.",".
				"'".$this->today."',".
				$this->objForm['peopleId'].",".
				"@activityId);"
			);

			//get new activity id from db and set it in local object
			$this->record = mysql_fetch_row(mysql_query("SELECT @activityId as activityId;"));
			$this->setActivityId($this->record[0]);
		}
		else{
			//update existing activity
			mysql_query("CALL spUpdateActivity(".
				$this->activityId.",".
				"'".trim(str_replace("'","''",$this->objForm['activityTitle']))."',".
				"'".trim(str_replace("'","''",$this->objForm['activityPun']))."',".
				"'".trim(str_replace("'","''",$this->objForm['activityPeople']))."',".
				"'".trim(str_replace("'","''",$this->objForm['activityWhatToDo']))."',".
				"'".trim(str_replace("'","''",$this->objForm['activityOpinion']))."',".
				$this->active.");"
			);
		}
	}

	private function uploadActivityIcon(){
		if(isset($this->objFile["activityIcon"])){
			if ($this->objFile["activityIcon"]["error"] > 0){print "Error: ".$this->objFile["activityIcon"]["error"]."<br>";}
			else{
				$extension = pathinfo($this->objFile["activityIcon"]["name"], PATHINFO_EXTENSION);
				$this->iconName = $this->iconName.$this->activityId.".".$extension;
				move_uploaded_file($this->objFile["activityIcon"]["tmp_name"], $this->iconDir.$this->iconName);
				mysql_query("CALL spUpdateActivityIcon(".$this->activityId.",'".$this->iconName."');");
			}
		}
	}
	
	private function processActivityRules(){
		//process new rules if the exist
		if($this->newRuleCount > 0){
			for ($a = 1; $a <= $this->newRuleCount; $a++){
				if(isset($this->objForm['activeRule-'.$a])){$this->active = 1;} else {$this->active = 0;}
				mysql_query("CALL spInsertActivityRule(".$this->activityId.",'".trim(str_replace("'","''",$this->objForm['activityRule-'.$a]))."',".$this->active.",'".$this->today."',".$this->objForm['peopleId'].");");
			}
		}

		//process existing rules if they exist
		if(strlen($this->objForm['existingRuleIdList']) > 0 && is_array($this->arrRuleIds)){
			for ($a = 0; $a < count($this->arrRuleIds); $a++){
				if(isset($this->objForm['activeRule'.$this->arrRuleIds[$a]])){$this->active = 1;} else {$this->active = 0;}
				mysql_query("CALL spUpdateActivityRule(".$this->arrRuleIds[$a].",'".trim(str_replace("'","''",$this->objForm['activityRule'.$this->arrRuleIds[$a]]))."',".$this->active.");");
			}
		}
	}

	//link activity to an activity group
	private function processActivityGroupLink(){ mysql_query("CALL spActivityGroupLink(".$this->groupId.",".$this->activityId.");"); }
}
?>
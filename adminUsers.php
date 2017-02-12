<?php
class adminUsers{	
	private $username, $password, $link, $rset, $record, $rows, $peopleId;

	public function __construct(){
		$this->link = mysql_connect("localhost", "Igor", "123");
		mysql_select_db("hyh", $this->link);
	}

	public function setUsernamePassword($username,$password){ $this->username = $username; $this->password = $password; }

	public function loginUser(){
		$this->rset = mysql_query("CALL spUserNamePassword('".$this->username."','".$this->password."')", $this->link);
		$this->rows = mysql_num_rows($this->rset);
		if($this->rows >0){ $this->record = mysql_fetch_row($this->rset);	$this->peopleId = $this->record[0]; } else {$this->peopleId = 0; }

		return "[".$this->rows.",".$this->peopleId."]";
	}
}
?>
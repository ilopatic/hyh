/*-------------------------------------------------------------------Local Interface-------------------------------------------------------------------*/
var objFrameWork = new frameWork();
$(document).ready(function(){objFrameWork.instantiate(config);});												//instantiate framework object on document ready

function showHideContent(id){objFrameWork.showHideContent(id);}													//all on click events link to their object framework functions
function loginUser(){return objFrameWork.objHome.loginUser();}
function showActivityForm(activityId,groupId){objFrameWork.objActivities.showActivityForm(activityId,groupId);}
function showActivitiesList(){objFrameWork.objActivities.showActivitiesList();}
function buildActivitiesList(groupId){objFrameWork.objActivities.buildActivitiesList(groupId);}
function addNewRule(){objFrameWork.objActivities.addNewRule();}
function processActivityResult(result){objFrameWork.objActivities.processActivityResult(result);}
function checkLength(id,val,length){objFrameWork.checkLength(id,val,length);}
function showHealthyMenus(flag){objFrameWork.objHealthyMenu.showHealthyMenus(flag);}
function showHealthyMenu(id){objFrameWork.objHealthyMenu.showHealthyMenu(id);}

/*-------------------------------------------------------------------End Local Interface-------------------------------------------------------------------*/

/*-------------------------------------------------------------------Framework Class-------------------------------------------------------------------*/

function frameWork(){
	this.objAjax = null; this.config = null; this.peopleId = null; this.objLanguageList = null; this.objActivityLists = null;
	this.objHomePage = null; this.objPages = null; this.objActivities = null; this.objHealthyMenu = null; this.objGraduallyGain = null; this.objHealthyTips = null; this.objWhen = null;

	frameWork.prototype.instantiate = function(config){
		this.config = config;																																//create the configuration object
		this.objAjax = new ajaxLocal();
		this.objAjax.instantiate(this.config.file.model);																		//create and instantiate ajax object
		this.buildLanguageList();																														//create language list object
		this.pageBuild();																																		//build html framework
		this.showHideContent(3);																														//display home page
		this.setPeopleId(1);																																//###REMOVE WHEN CHANGING BACK TO LOGIN PAGE
		this.showHideNav(1);																																//display top nav
	}

	frameWork.prototype.getObjLists = function(){return new lists();}											//create and return new lists object
	frameWork.prototype.getObjAjax = function(){return this.objAjax}											//get the ajax object
	frameWork.prototype.pageBuild = function(){$("#bodyContainer").html(this.objAjax.ajaxGetFile(this.config.file.html.framework));}	//build html framework
	frameWork.prototype.buildLanguageList = function(){this.objLanguageList = jQuery.parseJSON(this.objAjax.ajaxGetFile(this.config.file.data.languages));}	//get language json and store in framework object

	//site nav onclick event - switch between html divs/pages
	frameWork.prototype.showHideContent = function(id){												
		for(var a=1; a<=8; a++){																								//loop through entire framework divs/pages and display the active one whilst hiding all others
			if(a == id){$("#div" + a).show();}else{$("#div" + a).hide();}
		}

		switch(id){																															//build content for each div/page if it does not already exist by creating its own object
			case 0: break;
			case 1: if(!this.objHome){this.objHome = new homePage(); this.objHome.instantiate(this,"div1", this.config.file.html.homepage);} break;
			case 2: if(!this.objPages){this.objPages = new pages(); this.objPages.instantiate(this,"div2","adminPages.html");} break;
			case 3: if(!this.objActivities){this.objActivities = new activities(); this.objActivities.instantiate(this,"div3", this.config.file.html.activities);} break;
			case 4: if(!this.objHealthyMenu){this.objHealthyMenu = new healthyMenu(); this.objHealthyMenu.instantiate(this,"div4",this.config.file.html.healthyMenu);} break;
			case 5: if(!this.objGraduallyGain){this.objGraduallyGain = new graduallyGain(); this.objGraduallyGain.instantiate(this,"div5",this.config.file.html.graduallyGain);} break;
			case 6: if(!this.objHealthyTips){this.objHealthyTips = new healthyTips(); this.objHealthyTips.instantiate(this,"div6");} break;
			case 7: if(!this.objWhen){this.objWhen = new when(); this.objWhen.instantiate(this,"div7");} break;
			case 8: if(!this.objActivityLists){this.objActivityLists = new activityLists(); this.objActivityLists.instantiate(this,"div8",this.config.file.html.activityLists);} break;
			default: break;
		}
	}

	//rebuild page
	frameWork.prototype.resetContent = function(id){
		switch(id){
			case 0: break;
			case 1: this.objHome = null; break;
			case 2: this.objPages = null; break;
			case 3: this.objActivities = null; break;
			case 4: this.objHealthyMenu = null; break;
			case 5: this.objGraduallyGain = null; break;
			case 6: this.objHealthyTips = null; break;
			case 7: this.objWhen = null; break;
			case 8: this.objActivityLists = null; break;
			default: break;
		}

		this.showHideContent(id);
	}
	
	frameWork.prototype.showHideNav = function(flag){if(flag == 1){$("#siteNav").show();}else{$("#siteNav").hide();}}	//show hide top nav
	frameWork.prototype.setPeopleId = function(peopleId){this.peopleId = peopleId}																		//set people id
	frameWork.prototype.getPeopleId = function(){return this.peopleId}																								//get people id
	frameWork.prototype.specialCharacters = function(val){return val.replace("&#39;", "'").replace("&#34;", '"');}		//escape html double and single quotes coming from json
	frameWork.prototype.checkLength = function(id,val,length){																												//ensure element is kept to a certain number of characters
		var val =  $.trim(val);
		if(val.length > length){
			$("#" + id).val(val.substring(0,length));
			alert("Only " + length + " characters allowed");
		}
	}
	
	
}

/*-------------------------------------------------------------Home Page Class-----------------------------------------------------------------------------------*/

function homePage(){
	this.objFwk = null; this.objAjax = null; this.containerId = null; this.htmlFile = null;

	homePage.prototype.instantiate = function(objFwk,containerId,htmlFile){
			this.objFwk = objFwk;																			//local framework object
			this.objAjax = objFwk.getObjAjax();												//local ajax object
			this.containerId = containerId;														//id of container in framework
			this.htmlFile = htmlFile;																	//admin home page html
			this.pageBuild();																					//build html and put it in container
	}

	//get html and put it in container
	homePage.prototype.pageBuild = function(){
		$("#" + this.containerId).html(this.objAjax.ajaxGetFile(this.htmlFile));
		$("#username").attr("maxlength", 255);
		$("#password").attr("maxlength", 100);
	}

	//login user
	homePage.prototype.loginUser = function(){
		var username = $.trim($("#username").val()); var password = $.trim($("#password").val());

		if(username.length == 0 || password.length == 0){
			alert("Username and password cannot be blank");
		}
		else{
			var arrLogin = jQuery.parseJSON(this.objAjax.ajaxLoginUser(username,password));

			if(arrLogin[0] == 1){																											//if login successful
				this.objFwk.setPeopleId(arrLogin[1]);																			//set the global people id
				this.objFwk.showHideContent(3);																						//show activities
				this.objFwk.showHideNav(1);																								//show site nav
			}
			else{alert("Invalid username / password combination");}										//else alert error
		}
		return false;
	}
}

/*-------------------------------------------------------------Activities Class-----------------------------------------------------------------------------------*/

function activities(){
	this.objFwk = null; this.objAjax = null; this.containerId = null; this.urlPics = null; this.htmlFile = null; this.data = null; this.strHtml = null;
	this.objActivity = null; this.activityId = null; this.groupId = null; this.languageId = null; this.newRuleId = null; this.existingRuleIdList = "";
	this.objLanguageList = null; this.language = null;

	activities.prototype.instantiate = function(objFwk,containerId,htmlFile){
			this.objFwk = objFwk;														//local framework object
			this.objAjax = objFwk.getObjAjax();							//local ajax object
			this.containerId = containerId;									//id of container in framework
			this.htmlFile = htmlFile;												//html file name to be passed to ajax object
			this.urlPics = objFwk.config.dir.image;					//directory that holds all the image files
			this.pageBuild();																//build html and put it in container
			this.buildActivitiesList(1,1);									//### HARD CODED MUST BE REWORKED WHEN GROUPS ARE IMPLEMENTED
	}

	//get html and put it in container
	activities.prototype.pageBuild = function(){$("#" + this.containerId).html(this.objAjax.ajaxGetFile(this.htmlFile));}

	//build activities list for one activity group
	activities.prototype.buildActivitiesList = function(groupId,languageId){
		this.groupId = groupId; this.languageId = languageId;																//set group and language id
		this.setLanguage();																																	//set language text to be displayed to screen
		var percentVal = '0%'; $('.percent').html(percentVal); $('.bar').width(percentVal);	//set upload progress bar to 0
		$("#activitiesListDiv").html("");																										//empty activities list div
		this.objActivity = jQuery.parseJSON(this.objAjax.getActivitiesList(this.groupId));	//get activities list

		//build activities list
		this.strHtml = "<a href='javascript:showActivityForm(0," + this.groupId + ");'>New Activity</a><div id='activityGroup" + this.groupId + "'>";
			for (a=0; a < this.objActivity.activities.length; a++){	
				this.strHtml = this.strHtml + "<div class='groupActivity'>" +
					"<a href='javascript:showActivityForm(" + this.objActivity.activities[a].activityId + ");'>" +
						"<img src='pics/" + this.objActivity.activities[a].icon + "' border='0'>" + this.objActivity.activities[a].title + 
					"</a>" +
				"</div>";
			}
		this.strHtml = this.strHtml + "</div>";
		
		$("#activitiesListDiv").html(this.strHtml);	//add activities list html to its container
		this.showActivitiesList();									//display activities list
	}

	//display activities processing form
	activities.prototype.showActivityForm = function(activityId){
		this.activityId = activityId;	this.newRuleId = 0; this.existingRuleIdList = "";

		//set max lengths on inputs and text areas, rules are set in the function buildRuleInput()
		$("#activityTitle").attr("maxlength", 255);
		$("#activityPun").attr("maxlength", 255);
		$("#activityPeople").attr("maxlength", 255);
		$("#activityWhatToDo").keyup(function(){checkLength("activityWhatToDo",$(this).val(),1000);});
		$("#activityOpinion").keyup(function(){checkLength("activityOpinion",$(this).val(),2000);});

		//display update or add new form
		if(activityId > 0){
			this.objActivity = jQuery.parseJSON(this.objAjax.getActivity(this.activityId));								//get the activity data
			$("#newRuleCount").val(this.newRuleId);																												//default new rule count to 0
			this.populateActivityForm();																																	//populate form with data
		}
		else{
			this.resetActivityForm();																																			//rest form to add new state
		}

		$("#languageListDiv").html(this.language);																											//display the language text
		$("#activityGroupId").val(this.groupId);																												//add group id to form
		$("#activityId").val(this.activityId);																													//add activity id to form
		$("#peopleId").val(this.objFwk.getPeopleId());																									//add people id to form
		$("#adminActivitiesForm").show();																																//show activities form
		$("#activitiesListDiv").hide();																																	//hide the activities list
	}

	//populate activities form with data from one activity
	activities.prototype.populateActivityForm = function(){
		$("#activityImgDiv").html("<img src='" + this.urlPics + this.objActivity.icon + "'>");								//display icon
		if(this.objActivity.active == 1){this.strHtml = " checked='checked'";}else{this.strHtml = "";}				//if active set checkbox to checked
		$("#activityIsActive").html("<input type='checkbox' name='active' id='active'" + this.strHtml + ">");	//build checkbox
		//populate standard data
		$("#activityTitle").val(this.objFwk.specialCharacters(this.objActivity.title));
		$("#activityPun").val(this.objFwk.specialCharacters(this.objActivity.pun));
		$("#activityPeople").val(this.objFwk.specialCharacters(this.objActivity.people));
		$("#activityWhatToDo").val(this.objFwk.specialCharacters(this.objActivity.whatToDo));
		$("#activityOpinion").val(this.objFwk.specialCharacters(this.objActivity.opinion));
		//build rules
		$("#activityRules").html("");
		for (a=0; a < this.objActivity.rules.length; a++){
			this.buildRuleInput(this.objActivity.rules[a].id, this.objActivity.rules[a].rule, this.objActivity.rules[a].active);	//build rule input for each existing rule
			if(a == 0){this.existingRuleIdList = this.objActivity.rules[a].id} else{this.existingRuleIdList = this.existingRuleIdList + "," + this.objActivity.rules[a].id;}	//build csv of existing rule ids
		}
		$("#existingRuleIdList").val(this.existingRuleIdList);																																	//add csv of existing rule ids to its container
		$("#btnActivityProcess").val("Update");
	}

	//set activity form to its add new state
	activities.prototype.resetActivityForm = function(){
		$("#activityImgDiv").html("");
		$("#languageListDiv").html("");
		$("#activityIcon").val("");
		$("#activityIsActive").html("<input type='checkbox' name='active' id='active' checked='checked'>");
		$("#activityTitle").val("");
		$("#activityPun").val("");
		$("#activityPeople").val("")
		$("#activityWhatToDo").val("");
		$("#activityOpinion").val("");
		$("#activityRules").html("");
		$("#existingRuleIdList").val("");
		this.addNewRule();
		$("#btnActivityProcess").val("Add New");
	}

	//show the activities list hide the activities form
	activities.prototype.showActivitiesList = function(){ $("#adminActivitiesForm").hide(); $("#activitiesListDiv").show();	}

	//set the language text
	activities.prototype.setLanguage = function(){
		for (a=0; a < this.objFwk.objLanguageList.languages.length; a++){
			if(this.objFwk.objLanguageList.languages[a].id == this.languageId){this.language = this.objFwk.objLanguageList.languages[a].language}
		}
	}

	//add new rule input
	activities.prototype.addNewRule = function(){
		this.newRuleId += 1;															//increment new rule id count
		this.buildRuleInput("-" + this.newRuleId, "",1);	//build new rule input
		$("#newRuleCount").val(this.newRuleId);						//add id count to its container
	}

	//append new rule input to activity rules container
	activities.prototype.buildRuleInput = function(ruleId,value,active){
		if(active == 1){this.strHtml = " checked='checked'";}else{this.strHtml = "";}	//if active set checkbox to checked
		$( "#activityRules" ).append('<div>'+
			'<input type="text" class="activityRule" name="activityRule' + ruleId + '" id="activityRule' + ruleId + '" value="' + value + '">' +
			'<input type="checkbox" name="activeRule' + ruleId + '" id="activeRule' + ruleId + '"' + this.strHtml + '></div>');
			$("#activityRule" + ruleId).attr("maxlength", 500);
	}
	
	//reaction to process activity call
	activities.prototype.processActivityResult = function(result){
		if(!isNaN(result) && result == this.groupId){
			this.resetActivityForm();
			this.buildActivitiesList(result);
		}
		else{alert(result);}
	}
}

/*-------------------------------------------------------------Healthy Menu Class-----------------------------------------------------------------------------------*/

function healthyMenu(){
	this.objAjax = null; this.containerId = null; this.htmlFile = null; this.objLists = null; this.html = ""; this.menuIdList = ""; this.json = null;

	healthyMenu.prototype.instantiate = function(objFwk,containerId,htmlFile){
			this.objAjax = objFwk.getObjAjax();												//local ajax object
			this.objLists = objFwk.getObjLists();											//local lists object
			this.containerId = containerId;														//id of container in framework
			this.htmlFile = htmlFile;																	//healthy menu page html
			this.pageBuild();																					//build html and put it in container
	}
	
	//get html and put it in container
	healthyMenu.prototype.pageBuild = function(){
		$("#" + this.containerId).html(this.objAjax.ajaxGetFile(this.htmlFile));
		this.showHideDivs(1);
	}
	
	//loop through divs showing one and hiding the rest
	healthyMenu.prototype.showHideDivs = function(id){
		for (a=1; a <= 3; a++){
			if(a == id){$("#healthyMenusDiv" + id).show();}else{$("#healthyMenusDiv" + a).hide();}
		}
	}

	//show healthy menu list or display groups titles
	healthyMenu.prototype.showHealthyMenus = function(flag){
		switch(flag){
			case 1: this.showGroup("1,2"); break;
			case 2: this.showHealthyMenu("3"); break;
			case 3: this.showGroup("4,5,6,7"); break;
			case 4: this.showGroup("8,9"); break;
			case 5: this.showHealthyMenu("23"); break;
			case 6: this.showHealthyMenu("24"); break;
			case 7: this.showHealthyMenu("25"); break;
			case 8: this.showHealthyMenu("26"); break;
		}
	}
	
	//display group titles
	healthyMenu.prototype.showGroup = function(strIds){
		this.json = jQuery.parseJSON(this.objAjax.getLists(strIds));														//get json data
		this.objLists.instantiate("",0,this.json,"","","","","");																//instantiate lists object
		this.objLists.buildGroup("showHealthyMenu","healthyMenusDiv3Data");											//build list of group titles
		this.showHideDivs(3);																																		//display group titles container
	}

	//display healthy menu list
	healthyMenu.prototype.showHealthyMenu = function(id){
		this.json = jQuery.parseJSON(this.objAjax.getLists(id));																//get json data
		this.objLists.instantiate(
			"formListHM",
			id,
			this.json,
			"healthyMenusDiv2",
			"",
			"formListHM",
			"objFrameWork.objHealthyMenu.objLists.newListItem();",
			"objFrameWork.objHealthyMenu.processResult"
		);																																											//instantiate lists object
		this.objLists.processList();																														//build the healthy menu form
		$("#healthyMenusDiv2").prepend(
			"<div class='bckBtnDiv'>" +
				"<a href='javascript:objFrameWork.objHealthyMenu.backHealthyMenu();'>" +
				"<img src='pics/backButton.jpg' class='backButton'><a>" +
			"</div>"
		);																																											//prepend back button to form
		this.showHideDivs(2);																																		//display healthy menu form
	}
	
	healthyMenu.prototype.backHealthyMenu = function(){this.showHideDivs(1);}									//display top level div

	//process after form has been submitted
	healthyMenu.prototype.processResult = function(result){
		if(result){this.showHideDivs(1);}
		else{alert("All lists items must not be blank.");}
	}
}

/*-------------------------------------------------------------Gradually Gain Class-----------------------------------------------------------------------------------*/

function graduallyGain(){
	this.objFwk = null; this.objAjax = null; this.containerId = null; this.formName = null; this.objLists = null; this.listId = null; this.json = null;

	graduallyGain.prototype.instantiate = function(objFwk,containerId){
			this.objFwk = objFwk;
			this.objAjax = objFwk.getObjAjax();																	//local ajax object
			this.containerId = containerId;																			//id of container in framework
			this.listId = 10;																										//gradually gain list id
			this.formName = "formListGG";
			this.json = jQuery.parseJSON(this.objAjax.getLists(this.listId));		//json object of list items for gradually gain
			this.objLists = objFwk.getObjLists();																//create local lists object
			this.objLists.instantiate(
				this.formName,
				this.listId,
				this.json,
				this.containerId,
				"Gradually Gain",
				this.formName,
				"objFrameWork.objGraduallyGain.objLists.newListItem();",
				"objFrameWork.objGraduallyGain.processResult"
			);																																	//instantiate local lists object
			this.objLists.processList();																				//set the gradually gain form
	}

	//process form submit result
	graduallyGain.prototype.processResult = function(result){
		if(result){
			alert("You have successfully updated the Gradually Gain list.");
			this.objFwk.resetContent(5);
		}
		else{
			alert("All lists items must not be blank.");
			$("#" + this.formName + " #processBtn").show();
		}
	}
}

/*-------------------------------------------------------------Healthy Tips Class-----------------------------------------------------------------------------------*/

function healthyTips(){
	this.objFwk = null; this.objAjax = null; this.containerId = null; this.formName = null; this.objLists = null; this.listId = null; this.json = null;

	healthyTips.prototype.instantiate = function(objFwk,containerId){
			this.objFwk = objFwk;
			this.objAjax = objFwk.getObjAjax();																	//local ajax object
			this.containerId = containerId;																			//id of container in framework
			this.listId = 11;																										//healthy tips list id
			this.formName = "formListHT";
			this.json = jQuery.parseJSON(this.objAjax.getLists(this.listId));		//json object of list items for healthy tips
			this.objLists = objFwk.getObjLists();																//create local lists object
			this.objLists.instantiate(
				this.formName,
				this.listId,
				this.json,
				this.containerId,
				"Healthy Tips",
				this.formName,
				"objFrameWork.objHealthyTips.objLists.newListItem();",
				"objFrameWork.objHealthyTips.processResult"
			);																																	//instantiate local lists object
			this.objLists.processList();																				//set the healthy tips form
	}

	//process form submit result
	healthyTips.prototype.processResult = function(result){
		if(result){
			alert("You have successfully updated the Healthy Tips list.");
			this.objFwk.resetContent(6);
		}
		else{
			alert("All lists items must not be blank.");
			$("#" + this.formName + " #processBtn").show();
		}
	}
}

/*-------------------------------------------------------------When Class-----------------------------------------------------------------------------------*/

function when(){
	this.objFwk = null; this.objAjax = null; this.containerId = null; this.formName = null; this.objLists = null; this.listId = null; this.json = null;

	when.prototype.instantiate = function(objFwk,containerId){
			this.objFwk = objFwk;
			this.objAjax = objFwk.getObjAjax();																	//local ajax object
			this.containerId = containerId;																			//id of container in framework
			this.listId = 12;																										//when list id
			this.formName = "formListWH";
			this.json = jQuery.parseJSON(this.objAjax.getLists(this.listId));		//json object of list items for when
			this.objLists = objFwk.getObjLists();																//create local lists object
			this.objLists.instantiate(
				this.formName,
				this.listId,
				this.json,
				this.containerId,
				"When",
				this.formName,
				"objFrameWork.objWhen.objLists.newListItem();",
				"objFrameWork.objWhen.processResult"
			);																																	//instantiate local lists object
			this.objLists.processList();																				//set the when form
	}

	//process form submit result
	when.prototype.processResult = function(result){
		if(result){
			alert("You have successfully updated the When list.");
			this.objFwk.resetContent(7);
		}
		else{
			alert("All lists items must not be blank.");
			$("#" + this.formName + " #processBtn").show();
		}
	}
}

/*-------------------------------------------------------------Activity Lists-----------------------------------------------------------------------------------*/

function activityLists(){
	this.objFwk = null; this.objAjax = null; this.containerId = null; this.htmlFile = null; this.objLists = null; this.json = null; this.groupId = null;

	activityLists.prototype.instantiate = function(objFwk,containerId,htmlFile){
			this.objFwk = objFwk;
			this.objAjax = objFwk.getObjAjax();												//local ajax object
			this.objLists = objFwk.getObjLists();											//local lists object
			this.containerId = containerId;														//id of container in framework
			this.htmlFile = htmlFile;																	//activity lists page html
			this.groupId = 6;
			this.pageBuild();																					//build html and put it in container
			this.showGroup();
	}
	
	//get html and put it in container
	activityLists.prototype.pageBuild = function(){
		$("#" + this.containerId).html(this.objAjax.ajaxGetFile(this.htmlFile));
	}
	
	//display group titles
	activityLists.prototype.showGroup = function(){
		this.json = jQuery.parseJSON(this.objAjax.getListGroup(this.groupId));													//get json data
		this.objLists.instantiate("",0,this.json,"","","","","");																				//instantiate lists object
		this.objLists.buildGroup("objFrameWork.objActivityLists.showActivityList","activityListsDiv1");	//build list of group titles
	}

	//display healthy menu list
	activityLists.prototype.showActivityList = function(id){
		this.json = jQuery.parseJSON(this.objAjax.getLists(id));																//get json data
		this.objLists.instantiate(
			"formListAC",
			id,
			this.json,
			"activityListsDiv2",
			"",
			"formListAC",
			"objFrameWork.objActivityLists.objLists.newListItem();",
			"objFrameWork.objActivityLists.processResult"
		);																																											//instantiate lists object
		this.objLists.processList();																														//build the activity lists form
		$("#activityListsDiv2").prepend(
			"<div class='bckBtnDiv'>" +
				"<a href='javascript:objFrameWork.objActivityLists.back();'>" +
				"<img src='pics/backButton.jpg' class='backButton'><a>" +
			"</div>"
		);
		$("#activityListsDiv2").show(); $("#activityListsDiv1").hide();
	}

	activityLists.prototype.back = function(result){$("#activityListsDiv1").show(); $("#activityListsDiv2").hide();}

	//process after form has been submitted
	activityLists.prototype.processResult = function(result){
		if(result){this.objFwk.resetContent(8);}
		else{alert("All lists items must not be blank.");}
	}
}

/*-------------------------------------------------------------Lists Class-----------------------------------------------------------------------------------*/

function lists(){
	this.objList = null; this.items = null; this.itemIdList = null; this.formId = null; this.listId = null; this.newId = null; this.maxLength = null;
	this.h1 = null; this.formName = null; this.fnNewItem = null; this.fnNameResult = null; this.containerId = null; this.checked = null;

	lists.prototype.instantiate = function(formId,listId,jsonList,containerId,h1,formName,fnNewItem,fnNameResult){
		this.objList = jsonList;
		if(this.objList.lists[0].active == 1){this.checked = "checked='checked'";} else{this.checked = "";};
		this.items = "";
		this.itemIdList = "";
		this.formId = formId;
		this.listId = listId;
		this.containerId = containerId;
		this.h1 = h1;
		this.formName = formName;
		this.fnNewItem = fnNewItem;
		this.fnNameResult = fnNameResult;
		this.newId = 0;
		this.maxLength = 1000;
	}

	//build sub list
	lists.prototype.buildGroup = function(jsName,container){
		this.items = "";
		for (a=0; a < this.objList.lists.length; a++){
			this.items = this.items +	"<div class='menu'>" +
				"<a href='javascript:" + jsName + "(" + this.objList.lists[a].id + ");'>" + 
					"<img src='pics/" + this.objList.lists[a].icon + "' border='0'>" + this.objList.lists[a].title + 
				"</a>" +
			"</div>";
		}
		$("#" + container).html(this.items);
	}
	
	

	//complete the list building process
	lists.prototype.processList = function(){
		this.buildForm();						//build the form
		this.buildList();						//build the html list
		this.populateForm();				//add html list to form and populate existing html elements
		this.setInputLimits();			//set the max length for inputs
	}

	//build form
	lists.prototype.buildForm = function(){
		$("#" + this.containerId).html("<div id='adminWhen'>" +
		"<h1>" + this.h1 + "</h1>" +
		"<div>" +
			"<form action='php/model/adminLists.php?action=processList' name='" + this.formName + "' id='" + this.formName + "' method='post' enctype='multipart/form-data'>" +
				"<div id='listItems' class='listForm'></div>" +
				"<div id='processBtn'><input type='submit' value='Process'><input type='button' value='New List Item' onclick='" + this.fnNewItem + "'></div>" +
				"<input type='hidden' name='listId' id='listId' value=''>" +
				"<input type='hidden' name='itemIdList' id='itemIdList' value=''>" +
				"<input type='hidden' name='newItemCount' id='newItemCount' value=''>" +
			"</form>" +
			"<script>" +
				"(function(){" +
					"$('#" + this.formName + "').ajaxForm({" +
						"beforeSend: function(){	$('#" + this.formName + " #processBtn').hide(); }," +
						"complete: function(xhr){ " + this.fnNameResult + "(xhr.responseText); }" +
					"});" +
				"})();" +
			"</script>" +
		"</div>" +
	"</div>");
	}

	//build list
	lists.prototype.buildList = function(){
		if(this.objList.lists[0].icon.length == 0){this.objList.lists[0].icon = "blank.png";}
		this.items = "<div class='listImgDiv'><img src='pics/" + this.objList.lists[0].icon + "' border='0'></div>" +
			"<div class='listDiv1'>Icon : <input class='btnListIcon' type='file' name='listIcon'></div>" +
			"<div class='listDiv1'>Active : <input type='checkbox' name='listActive' " + this.checked + "></div>" +
			"<div class='listDiv1' id='lId" + this.objList.lists[0].id + "'>" +
				"<div class='listTitle'>" + this.objList.lists[0].title + "</div>" + 
				"<div class='listDel'>Delete</div>" +
			"</div>" +
			"<div id='listDiv2' class='listDiv2'>" + this.buildItemInputs(this.objList.lists[0].items) + "</div>";
	}

	//build one list item input
	lists.prototype.buildItemInputs = function(arrItems){
		var str = ""; this.itemIdList = "";
		for(a=0; a < arrItems.length; a++){
			str = str + "<div>" +
				"<div class='listItemDiv1'><input type='text' id='liId" + arrItems[a].listItemId + "' name='liId" + arrItems[a].listItemId + "' value='" + arrItems[a].listItem + "'></div>" +
				"<div class='listItemDiv2'><input type='checkbox' name='delItemIdList[]' value='" + arrItems[a].listItemId + "'></div>" +
			"</div>";
			this.itemIdList = this.itemIdList + arrItems[a].listItemId + ",";
		}
		return str;
	}

	//populate the form with list items, list id and list of item ids
	lists.prototype.populateForm = function(){
		$("#" + this.formId + " #listItems").html(this.items);
		$("#" + this.formId + " #listId").val(this.listId);
		$("#" + this.formId + " #itemIdList").val(this.itemIdList);
		$("#" + this.formId + " #newItemCount").val(this.newId);
	}

	//set the max length for each item input
	lists.prototype.setInputLimits = function(){
		for(a=0; a <this.objList.lists[0].items.length; a++){
			$("#liId" + this.objList.lists[0].items[a].listItemId).attr("maxlength", this.maxLength);
		}
	}

	//build new list item input and append to end of existing list inputs
	lists.prototype.newListItem = function(){
		this.newId += 1;
		var str = "<div><div class='listItemDiv1'><input type='text' id='liId-" + this.newId + "' name='liId-" + this.newId + "' value=''></div><div class='listItemDiv2'></div></div>";

		$("#" + this.formId + " #listDiv2").append(str);																	//append new input
		$("#" + this.formId + " #liId-" + this.newId).attr("maxlength", this.maxLength);	//set max length for new input
		$("#" + this.formId + " #liId-" + this.newId).focus();														//focus on new input
		$("#" + this.formId + " #newItemCount").val(this.newId);													//reset new input count
	}
}
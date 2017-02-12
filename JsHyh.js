/*-------------------------------------------------------------------Local Interface-------------------------------------------------------------------*/
var config = new Object();
//config.siteUrl 	= "http://www.healthyyethilarious.com.au/";																			//url of the site
config.siteUrl 	= "http://localhost/hyh/";																											//url of the site
config.homePage 	= "default.html";																															//site home page
config.navTop = ["linkHomePage","linkActivities","linkGraduallyGain","linkWhen","linkMore"];		//array of top nav ids
config.navBottom = ["iconHomePage","iconActivities","iconGraduallyGain","iconWhen","iconMore"];	//array of top nav ids
config.modelDir = "php/model/";																																	//path the model directory
config.htmlDir 	= "php/html/";																																	//path to the directory where all the html partials are stored
config.imageDir = "pics/";																																			//path to the directory where all the images are stored
config.dataDir 	= "../data/";																																		//path to the directory where all the data files are stored
config.getFile 	= "getFile.php";																																//file name of the model that handles file gets
config.htmlDisclaimer = "disclaimer.html";																											//file name for disclaimer html

var objFrameWork = new frameWork();
$(document).ready(function(){objFrameWork.instantiate(config);});																//instantiate framework object on document ready

function showHideContent(id){																																		//all on click events link to their object framework functions
	hideIcon(id);
	setTimeout(function(){objFrameWork.showHideContent(id);},100);
	setTimeout(function(){showIcon(id);},100);
}
function hideIcon(id){$("#icon" + id).hide(); $("#loading" + id).show();}
function showIcon(id){$("#icon" + id).show(); $("#loading" + id).hide();}
function resetLanguage(){objFrameWork.objHome.resetLanguage()};
function showActivityData(id){objFrameWork.objActivities.showActivityData(id);}
function showActivitiesList(){objFrameWork.objActivities.showActivitiesList();}
function showHealthyMenuList(id){objFrameWork.objHealthyMenu.showHealthyMenuList(id);}
function showHealthyMenuGroupList(){objFrameWork.objHealthyMenu.showHealthyMenuGroupList();}

/*-------------------------------------------------------------------End Local Interface-------------------------------------------------------------------*/

/*-------------------------------------------------------------------Framework Class-------------------------------------------------------------------*/

function frameWork(){
	this.languageId = null; this.objAjax = null; this.htmlDir = null; this.dataDir = null; this.urlPics = null; this.data = null; this.objContent = null; this.siteUrl = null;
	this.homePage = null;	this.objHomePage = null; this.objActivities = null; this.objGraduallyGain = null; this.objHealthyMenu = null; this.objMore = null; this.objWhen = null;
	this.objLists = null; this.disclaimerLink = null; this.config = null; this.navTop = null; this.navBottom = null;

	frameWork.prototype.instantiate = function(config){
		this.config = config;																																//store config setting into local structure
		this.siteUrl = config.siteUrl;																											//set the site url
		this.homePage = config.siteUrl + config.homePage;																		//set the site home page
		this.setLanguageId();																																//set languageId
		this.objAjax = new ajaxLocal();																											//create and instantiate ajax object
		this.objAjax.instantiate(config);
		this.objLists = new lists();
		this.dataDir = config.dataDir;																											//set directory paths
		this.htmlDir = config.siteUrl + config.htmlDir;
		this.urlPics = config.siteUrl + config.imageDir;
		this.navTop = config.navTop;																												//build array of top nav ids
		this.navBottom = config.navBottom;																									//build array of bottom nav ids
		this.pageBuild();																																		//build html framework
		this.siteNavsBuild();																																//build the top and bottom navs
		this.showHideContent(1);																														//display home page
	}

	//set that the languageId
	frameWork.prototype.setLanguageId = function(){
		this.languageId = this.getParameterByName("languageId");														//get url parameter value
		if(this.languageId){																																//if it exists
			if(isNaN(this.languageId)){this.languageId = 1;}																		//if it is not numeric default to 1
			else{if(this.languageId < 1 || this.languageId > 2){this.languageId = 1;}}					//else if it is not between 1 and 2 default to 1
		}
		else{this.languageId = 1}																														//else default to 1
		this.languageId = Math.floor(this.languageId);																			//remove any decimal places
	}

	//get url parameter value by name
	frameWork.prototype.getParameterByName = function(name) {
	 return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	}

	//build html framework
	frameWork.prototype.pageBuild = function(){
		$("#bodyContainer").html(this.objAjax.ajaxGetFile(this.htmlDir + "framework.html"));
		$("#siteNavTop").html(this.objAjax.ajaxGetFile(this.htmlDir + "siteNavTop.html"));
		$("#siteNavBottom").html(this.objAjax.ajaxGetFile(this.htmlDir + "siteNavBottom.html"));
		$("#adDiv").html(this.objAjax.ajaxGetFile(this.htmlDir + "adDiv.html"));
		$("#adDivMini").html(this.objAjax.ajaxGetFile(this.htmlDir + "adDivMini.html"));
	}

	//build top and bottom navs
	frameWork.prototype.siteNavsBuild = function(){
		this.data = this.objAjax.ajaxGetFile(this.dataDir + this.languageId + "framework.json");
		this.objContent = jQuery.parseJSON(this.data);
		this.buildDisclaimerLink();

		//top nav links and bottom nav icon titles
		for(var a=0; a < this.navTop.length; a++){
			$("#" + this.navTop[a]).html("<a href='javascript:showHideContent(" + (a*1 + 1*1) + ");'>" + this.objContent.nav[a].title + "</a>&nbsp;|&nbsp;");
			$('#' + this.navBottom[a]).attr('title',this.objContent.nav[a].title);
		}

		//top and bottom disclaimer links
		$("#disclaimerTop").html(this.disclaimerLink);
		$("#disclaimerBottom").html(this.disclaimerLink);
	}

	//build a link for the disclaimer
	frameWork.prototype.buildDisclaimerLink = function(){
		this.disclaimerLink = "<a href='" + this.htmlDir + this.languageId + this.config.htmlDisclaimer + "' target='_blank'>" + this.objContent.nav[5].title + "</a>";
	}

	//site nav onclick event - switch between html divs/pages
	frameWork.prototype.showHideContent = function(id){												
		//loop through entire framework divs/pages and display the active one whilst hiding all others, highlighting top nav link
		for(var a=1; a <= this.navTop.length; a++){
			if(a == id){
				$("#div" + a).show();
				$('#' + this.navTop[a-1]).removeClass('navCellTop').addClass('navCellTopAlt');
			}
			else{
				$("#div" + a).hide();
				$('#' + this.navTop[a-1]).removeClass('navCellTopAlt').addClass('navCellTop');
			}
		}

		//build content for each div/page if it does not already exist by creating its own object
		switch(id){
			case 0: break;
			case 1: if(!this.objHome){this.objHome = new homePage(); this.objHome.instantiate(this,"div1","homePage.html","homePage.json");} break;
			case 2: if(!this.objActivities){this.objActivities = new activities(); this.objActivities.instantiate(this,"div2","activities.html","activitiesPage.json");} break;
			case 3: if(!this.objGraduallyGain){this.objGraduallyGain = new graduallyGain(); this.objGraduallyGain.instantiate(this,"div3","graduallyGain.html","graduallyGainPage.json");} break;
			case 4: if(!this.objWhen){this.objWhen = new when(); this.objWhen.instantiate(this,"div4","when.html","whenPage.json");} break;
			case 5: if(!this.objMore){this.objMore = new more(); this.objMore.instantiate(this,"div5","more.html","morePage.json");} break;
			default: break;
		}
	}
}

/*-------------------------------------------------------------Home Page Class-----------------------------------------------------------------------------------*/

function homePage(){
	this.languageId = null; this.objAjax = null; this.containerId = null; this.htmlDir = null; this.dataDir = null; this.htmlFile = null; this.contentFile = null; this.objContent = null;
	this.data = null;	this.strHtml = null; this.homePage = null;

	homePage.prototype.instantiate = function(objFwk,containerId,htmlFile,contentFile){
			this.homePage = objFwk.homePage;										//local home page url
			this.languageId = objFwk.languageId;								//local languageId
			this.objAjax = objFwk.objAjax;											//local ajax object
			this.htmlDir = objFwk.htmlDir; 											//directory that holds all the html files
			this.dataDir = objFwk.dataDir;											//directory that holds all the data files
			this.containerId = containerId;											//id of container in framework
			this.htmlFile = htmlFile;														//html file name to be passed to ajax object
			this.contentFile = contentFile;											//content file name to be passed to ajax object
			this.pageBuild();																		//build html and put it in container
			this.contentBuild();																//add content to the html
	}

	//get html and put it in container
	homePage.prototype.pageBuild = function(){$("#" + this.containerId).html(this.objAjax.ajaxGetFile(this.htmlDir + this.htmlFile));}
	
	//get content and populate html
	homePage.prototype.contentBuild = function(){
		this.data = this.objAjax.ajaxGetFile(this.dataDir + this.languageId + this.contentFile);
		this.objContent = jQuery.parseJSON(this.data);
		$("#homePageHeader").html(this.objContent.header);
		$("#homePageImage").attr("src",this.objContent.imgSrc);
		$("#homePageIntro").html(this.objContent.intro);
		//this.languageListBuild();
	}

	//build the language list and put it in container
	homePage.prototype.languageListBuild = function(){
		this.data = this.objAjax.ajaxGetFile(this.dataDir + "languages.json");
		this.objContent = jQuery.parseJSON(this.data);		
		this.strHtml = "<select id='languageId' class='languageList' onchange='resetLanguage();'>";
			for (a=0; a < this.objContent.languages.length; a++){
				this.strHtml = this.strHtml + "<option value='" + this.objContent.languages[a].id + "'";
				if(this.objContent.languages[a].id == this.languageId){this.strHtml = this.strHtml + " selected='selected'";}
				this.strHtml = this.strHtml + ">" + this.objContent.languages[a].language + "</option>";
			}
		this.strHtml = this.strHtml + "</select>";
		$("#languageListDiv").html(this.strHtml);
	}

	//reset language for the entire site by reloading home page with another languageId
	homePage.prototype.resetLanguage = function(){window.location.href = this.homePage + "?languageId=" + $("#languageId").val();}
}

/*-------------------------------------------------------------Activities Class-----------------------------------------------------------------------------------*/

function activities(){
	this.languageId = null; this.objAjax = null; this.containerId = null; this.htmlDir = null; this.dataDir = null; this.htmlFile = null; this.contentFile = null; this.objContent = null;
	this.data = null; this.strHtml = null; this.urlPics = null; this.groupActivities = null; this.actvityId = null; 

	activities.prototype.instantiate = function(objFwk,containerId,htmlFile,contentFile){
			this.languageId = objFwk.languageId;								//local languageId
			this.objAjax = objFwk.objAjax;											//local ajax object
			this.htmlDir = objFwk.htmlDir; 											//directory that holds all the html files
			this.dataDir = objFwk.dataDir;											//directory that holds all the data files
			this.urlPics = objFwk.urlPics;											//url of pics directory
			this.containerId = containerId;											//id of container in framework
			this.htmlFile = htmlFile;														//html file name to be passed to ajax object
			this.contentFile = contentFile;											//content file name to be passed to ajax object			
			this.pageBuild();																		//build html and put it in container
			this.contentBuild();																//add content to the html
			this.getGroupActivities(this.languageId);						//####MUST REWORK IS ONLY TEMP SOLUTION
			this.buildGroupActivities();
	}

	//get html and put it in container
	activities.prototype.pageBuild = function(){$("#" + this.containerId).html(this.objAjax.ajaxGetFile(this.htmlDir + this.htmlFile));}

	//get content and populate html
	activities.prototype.contentBuild = function(){
		this.data = this.objAjax.ajaxGetFile(this.dataDir + this.languageId + this.contentFile);
		this.objContent = jQuery.parseJSON(this.data);
		$("#activityGroups").html(this.objContent.headingGroups);
		$("#activities").html(this.objContent.headingActivities);
		$("#activityHeader").html(this.objContent.headingActivity);
		$("#activitiesBackLink").attr('title',this.objContent.backLinkTitle);
		$("#lblTitle").html(this.objContent.lblTitle);
		$("#lblPeople").html(this.objContent.lblPeople);
		$("#lblWhatToDo").html(this.objContent.lblWhatToDo);
		$("#lblRules").html(this.objContent.lblRules);
		$("#lblOpinion").html(this.objContent.lblOpinion);
	}

	//get all data for one activity group
	activities.prototype.getGroupActivities = function(groupId){
		this.data = this.objAjax.ajaxGetFile(this.dataDir + "groupActivities" + groupId + ".json");	//get json data for one activity group
		this.groupActivities = jQuery.parseJSON(this.data);																					//put data into local json object
	}

	//build a list of activities for one activity group	
	activities.prototype.buildGroupActivities = function(){
		this.strHtml = "<div class='overflowActivity'>";
		for (a=0; a < this.groupActivities.activities.length; a++){			//loop through activities one at a time building icon and activity name
			this.strHtml = this.strHtml + "<div class='listGroup'>" +
				"<a href='javascript:showActivityData(" + this.groupActivities.activities[a].id + ");'>" +
					"<img src='" + this.urlPics + this.groupActivities.activities[a].activity[0].icon + "' border='0'>" + this.groupActivities.activities[a].activity[0].title +
				"</a>" +
			"</div>";
		}		
		$("#activities").append(this.strHtml + "</div>");	//add list of activities to its container
	}

	//show data for one activity	
	activities.prototype.showActivityData = function(id){
		$("#activities").hide();																			//hide activities list
		for (a=0; a < this.groupActivities.activities.length; a++){		//loop through activities one at a time
			if(this.groupActivities.activities[a].id == id){							//when you find the activity you are after populate its data place holders
				//image
				$("#activityImageDiv").html(
					"<img src='" + this.urlPics + this.groupActivities.activities[a].activity[0].icon + "' class='activityImage'>" + 
					"<div>" + this.groupActivities.activities[a].activity[0].pun + "</div>"
				);

				//data
				$("#activityTitle").html(this.groupActivities.activities[a].activity[0].title);
				$("#activityPeople").html(this.groupActivities.activities[a].activity[0].people);
				$("#activityWhatToDo").html(this.groupActivities.activities[a].activity[0].whatToDo);
				$("#activityOpinion").html(this.groupActivities.activities[a].activity[0].opinion);

				//rules list
				this.strHtml = "<ul class='activityRulesList'>";
				for (b=0; b < this.groupActivities.activities[a].activity[0].rules.length; b++){
					this.strHtml = this.strHtml + "<li>" + this.groupActivities.activities[a].activity[0].rules[b].rule + "</li>";
				}
				this.strHtml = this.strHtml + "</ul>";
				$("#activityRules").html(this.strHtml);

				break;
			}
		}
		$("#activityData").show();																		//show activity data
	}

	//show activities list hide activity data
	activities.prototype.showActivitiesList = function(){
		$("#activities").show();
		$("#activityData").hide();
	}
}

/*-------------------------------------------------------------Gradually Gain Class-----------------------------------------------------------------------------------*/

function graduallyGain(){
	this.languageId = null; this.objAjax = null; this.htmlDir = null; this.dataDir = null; this.containerId = null; this.htmlFile = null; this.contentFile = null; this.objContent = null; 
	this.data = null; this.objList = null; this.strHtml = ""; this.objLists = null; 

	graduallyGain.prototype.instantiate = function(objFwk,containerId,htmlFile,contentFile){
			this.languageId = objFwk.languageId;								//local languageId
			this.objAjax = objFwk.objAjax;											//local ajax object
			this.objLists = objFwk.objLists;										//get list object
			this.htmlDir = objFwk.htmlDir; 											//directory that holds all the html files
			this.dataDir = objFwk.dataDir;											//directory that holds all the data files
			this.containerId = containerId;											//id of container in framework
			this.htmlFile = htmlFile;														//html file name to be passed to ajax object
			this.contentFile = contentFile;											//content file name to be passed to ajax object
			this.pageBuild();																		//build html and put it in container
			this.contentBuild();																//add content to the html
			this.listBuild();																		//add list items
	}

	//get html and put it in container
	graduallyGain.prototype.pageBuild = function(){$("#" + this.containerId).html(this.objAjax.ajaxGetFile(this.htmlDir + this.htmlFile));}

	//get content and populate html
	graduallyGain.prototype.contentBuild = function(){
		this.data = this.objAjax.ajaxGetFile(this.dataDir + this.languageId + this.contentFile);
		this.objContent = jQuery.parseJSON(this.data);
		$("#graduallyGainHeader").html(this.objContent.header);
		$("#graduallyGainIntro").html(this.objContent.intro);
	}

	//build the gradually gained list
	graduallyGain.prototype.listBuild = function(){
		this.data = this.objAjax.ajaxGetFile(this.dataDir + this.languageId + "graduallyGain.json");					//get json data
		this.objList = jQuery.parseJSON(this.data);																														//create json object
		this.objLists.instantiate(this.objList.lists[0],0,"","graduallyGainItems",1,"overflowGraduallyGain");	//set list object
		this.objLists.buildList();																																						//build the list
	}
}

/*-------------------------------------------------------------When Class-----------------------------------------------------------------------------------*/

function when(){
	this.languageId = null; this.objAjax = null; this.htmlDir = null; this.dataDir = null; this.containerId = null; this.htmlFile = null; this.contentFile = null; this.objContent = null; 
	this.data = null; this.objList = null; this.strHtml = ""; this.objLists = null;

	when.prototype.instantiate = function(objFwk,containerId,htmlFile,contentFile){
			this.languageId = objFwk.languageId;								//local languageId
			this.objAjax = objFwk.objAjax;											//local ajax object
			this.objLists = objFwk.objLists;										//get list object
			this.htmlDir = objFwk.htmlDir; 											//directory that holds all the html files
			this.dataDir = objFwk.dataDir;											//directory that holds all the data files
			this.containerId = containerId;											//id of container in framework
			this.htmlFile = htmlFile;														//html file name to be passed to ajax object
			this.contentFile = contentFile;											//content file name to be passed to ajax object
			this.pageBuild();																		//build html and put it in container
			this.contentBuild();																//add content to the html
			this.listBuild();																		//add list items
	}

	//get html and put it in container
	when.prototype.pageBuild = function(){$("#" + this.containerId).html(this.objAjax.ajaxGetFile(this.htmlDir + this.htmlFile));}

	//get content and populate html
	when.prototype.contentBuild = function(){
		this.data = this.objAjax.ajaxGetFile(this.dataDir + this.languageId + this.contentFile);
		this.objContent = jQuery.parseJSON(this.data);
		$("#whenHeader").html(this.objContent.header);
	}

	//build the gradually gained list
	when.prototype.listBuild = function(){
		this.data = this.objAjax.ajaxGetFile(this.dataDir + this.languageId + "when.json");							//get json data
		this.objList = jQuery.parseJSON(this.data);																											//create json object
		this.objLists.instantiate(this.objList.lists[0],0,"","whenItems",1,"overflowList");							//set list object
		this.objLists.buildList();																																			//build the list
	}
}

/*-------------------------------------------------------------More Class-----------------------------------------------------------------------------------*/

function more(){
	this.languageId = null; this.objAjax = null; this.htmlDir = null; this.dataDir = null; this.containerId = null; this.htmlFile = null; this.contentFile = null; this.objContent = null; 
	this.data = null; this.listContainer = null; this.listTypeId = null; this.menuTitle = null; this.urlPics = null; this.backButton = null; this.objHealthyTips = null;
	this.objHealthyMenu = null; this.objActivities = null; this.objList = null; this.arrHdrId = null;

	more.prototype.instantiate = function(objFwk,containerId,htmlFile,contentFile){
			this.languageId = objFwk.languageId;								//local languageId
			this.objAjax = objFwk.objAjax;											//local ajax object
			this.objLists = objFwk.objLists;										//get list object
			this.htmlDir = objFwk.htmlDir; 											//directory that holds all the html files
			this.dataDir = objFwk.dataDir;											//directory that holds all the data files
			this.containerId = containerId;											//id of container in framework
			this.urlPics = objFwk.urlPics;											//path to pics directory
			this.createObjects();																//create all the list objects, arr of sub header ids and the back button
			this.htmlFile = htmlFile;														//html file name to be passed to ajax object
			this.contentFile = contentFile;											//content file name to be passed to ajax object
			this.pageBuild();																		//build html and put it in container
			this.contentBuild();																//add content to the html
			this.showGroup(6);																	//default to activities div
	}

	//get html and put it in container
	more.prototype.pageBuild = function(){$("#" + this.containerId).html(this.objAjax.ajaxGetFile(this.htmlDir + this.htmlFile));}

	//create list objects, arr of sub header ids and the back button
	more.prototype.createObjects = function(){
		this.data = this.data = this.objAjax.ajaxGetFile(this.dataDir + this.languageId + "healthyTips.json");
		this.objHealthyTips = jQuery.parseJSON(this.data);
		this.data = this.data = this.objAjax.ajaxGetFile(this.dataDir + this.languageId + "healthyMenu.json");
		this.objHealthyMenu = jQuery.parseJSON(this.data);
		this.data = this.data = this.objAjax.ajaxGetFile(this.dataDir + this.languageId + "activitiesList.json");
		this.objActivities = jQuery.parseJSON(this.data);
		this.arrHdrId = ["healthyMenuHeader","healthyTipsHeader","activitiesHeader"];
		this.backButton = "<div class='backButtonMore'><a href='javascript:objFrameWork.objMore.back();'><img src='pics/backButton.jpg'  border='0'><a></div>";
	}

	//get content and populate html
	more.prototype.contentBuild = function(){
		this.data = this.objAjax.ajaxGetFile(this.dataDir + this.languageId + this.contentFile);
		this.objContent = jQuery.parseJSON(this.data);
		$("#moreHeader").html(this.objContent.header);
		$("#" + this.arrHdrId[1]).html("<a href='javascript:objFrameWork.objMore.showList(5);'>" + this.objContent.healthyTips + "</a>");
		$("#" + this.arrHdrId[2]).html("<a href='javascript:objFrameWork.objMore.showGroup(6);'>" + this.objContent.activities + "</a>");
		$("#" + this.arrHdrId[0]).html("<a href='javascript:objFrameWork.objMore.showHealthyListGroups(4);'>" + this.objContent.healthyMenu + "</a>");
	}

	//set menu color for sub nav item on focus
	more.prototype.setMenuColor = function(id){
		for(a=4; a <= 6; a++){
			if(id == a){$("#" + this.arrHdrId[a-4]).removeClass('moreMenuItem').addClass('moreMenuItemAlt');}
			else{$("#" + this.arrHdrId[a-4]).removeClass('moreMenuItemAlt').addClass('moreMenuItem');}
		}
	}

	//healthy eating list - show a list of healthy menu groups and their lists
	more.prototype.showHealthyListGroups = function(listTypeId){
		this.listTypeId = listTypeId;
		this.setListPropertiesGroup();

		this.strHtml = "";
		for (a=0; a < this.objList.lists.length; a++){																	//loop through healthy menu data one at a time building group icon and title
			if(a==0 || a==2 || a==3 || a==7 || a==9 || a==10 || a==11 || a==12 || a==13){		//build group headers
				this.setHealthyMenuTitle();
				this.strHtml = this.strHtml + "<div class='healthyGroup'>";
					//if group only has one list then make group header clickable
					if(a==2 || a==9 || a==10 || a==11 || a==12 || a==13){this.strHtml = this.strHtml + "<a href='javascript:objFrameWork.objMore.showGroupList(" + this.objList.lists[a].list[0].id + "," + this.listTypeId + ");'>";}
					this.strHtml = this.strHtml + "<div class='tableCell'><img src='pics/" + this.objList.lists[a].list[0].icon + "'></div><div class='tableCell2'><h3>" + this.menuTitle + "</h3></div>";
					if(a==2 || a==9 || a==10 || a==11 || a==12 || a==13){this.strHtml = this.strHtml + "</a>";}
				this.strHtml = this.strHtml + "</div>";
			}

			if(a==0 || a==1 || a==3 || a==4 || a==5 || a==6 || a==7 || a==8){								//if more than one item in group
				this.strHtml = this.strHtml + "<div class='healthyGroupSub'>" +									//build list icon and title
					"<a href='javascript:objFrameWork.objMore.showGroupList(" + this.objList.lists[a].list[0].id + "," + this.listTypeId + ");'>" + this.objList.lists[a].list[0].title + "</a>" +
				"</div>";
			}
		}
		$("#" + this.listContainer).html(this.strHtml);																//add html to its container

		this.toggle();																																//toggle top level menu
	}

	//build healthy menu titles
	more.prototype.setHealthyMenuTitle = function(){
		if(a==3){if(this.languageId ==1){this.menuTitle = "Meat";}else{this.menuTitle = "Le Meat";}}
		else if (a==7){if(this.languageId ==1){this.menuTitle = "Poultry";}else{this.menuTitle = "Le Poultry";}}
		else {this.menuTitle = this.objList.lists[a].list[0].title;}
	}

	//build a list of groups
	more.prototype.showGroup = function(listTypeId){
		this.listTypeId = listTypeId;																																		//set list type id
		this.setListPropertiesGroup();																																	//set list properties
		this.objLists.instantiate(this.objList,this.listTypeId,"",this.listContainer,1,"");							//set list object
		this.objLists.buildGroup();																																			//build the list
		this.toggle();																																									//toggle top level menu
	}

	//build a list of items from a data file containing a list of groups
	more.prototype.showGroupList = function(listId,listTypeId){
		this.listTypeId = listTypeId;
		this.setListProperties();

		for(b=0; b<this.objList.lists.length; b++){																																											//loop through entire group of lists
			if(this.objList.lists[b].list[0].id == listId){																																									//when you have found the list you are looking for
				this.objLists.instantiate(this.objList.lists[b],0,this.objList.lists[b].list[0].title,this.listContainer,1,"overflowMore2");		//set list object
				this.objLists.buildList();																																																			//build the list
				$("#" + this.listContainer).prepend(this.backButton);																																						//prepend the back button
				break;
			}
		}

		$("#more" + this.listTypeId + "List").show();																//show the list
		$("#more" + this.listTypeId + "Group").hide();															//hide the group of lists
		this.toggle();																															//toggle top level menu
	}

	//group list back button functionality
	more.prototype.back = function(){
		$("#more" + this.listTypeId + "List").hide();																//hide the list
		$("#more" + this.listTypeId + "Group").show();															//show the group of lists
	}

	//build a list of items from a data file containing one group
	more.prototype.showList = function(listTypeId){
		this.listTypeId = listTypeId;																																	//set list type id
		this.setListProperties();																																			//set list properties
		this.objLists.instantiate(this.objList.lists[0],0,"",this.listContainer,1,"overflowMore1");		//set list object
		this.objLists.buildList();																																		//build the list
		this.toggle();																																								//toggle top level menu
	}

	//toggle top level menu healthy eating list(4), health tips(5) and activities(6)
	more.prototype.toggle = function(){
		if(this.listTypeId  == 4){ $("#more5").hide(); $("#more6").hide(); $("#more4").show(); }
		if(this.listTypeId  == 5){ $("#more4").hide(); $("#more6").hide(); $("#more5").show(); }
		if(this.listTypeId  == 6){ $("#more4").hide(); $("#more5").hide(); $("#more6").show(); }
	}

	//set properties when building a list items
	more.prototype.setListProperties = function(){
		switch(this.listTypeId){
			case 4: this.objList = this.objHealthyMenu; this.listContainer = "more4List"; break;
			case 5:	this.objList = this.objHealthyTips; this.listContainer = "more5List"; break;
			case 6: this.objList = this.objActivities; this.listContainer = "more6List"; break;
			default: break;
		}
	}

	//set properties when building a list group
	more.prototype.setListPropertiesGroup = function(){
		switch(this.listTypeId){
			case 4: this.objList = this.objHealthyMenu; this.listContainer = "more4Group"; break;
			case 5: this.objList = this.objHealthyTips; this.listContainer = "more5Group"; break;
			case 6: this.objList = this.objActivities; this.listContainer = "more6Group"; break;
			default: break;
		}
	}
}

/*-------------------------------------------------------------Lists Class-----------------------------------------------------------------------------------*/

function lists(){
	this.objList = null; this.listTypeId = null; this.listTitle = null; this.containerId = null; this.strHtml = null; this.className = null; this.listBlock = null; this.listClass = null;

	//instantiate lists object
	lists.prototype.instantiate = function(objList,listTypeId,listTitle,containerId,listBlock,listClass){
		this.objList = objList;
		this.listTypeId = listTypeId;
		this.listTitle = listTitle;
		this.containerId = containerId;
		this.listClass = listClass;
		this.className = "bgListClr2";
		this.listBlock = listBlock;
		this.strHtml = "";
	}

	//build a list of groups
	lists.prototype.buildGroup = function(){
		for (a=0; a < this.objList.lists.length; a++){
			this.strHtml = this.strHtml +	"<div class='listGroup'>" +
				"<a href='javascript:objFrameWork.objMore.showGroupList(" + this.objList.lists[a].list[0].id + "," + this.listTypeId + ");'>" + 
					"<img src='pics/" + this.objList.lists[a].list[0].icon + "'>" + this.objList.lists[a].list[0].title + 
				"</a>" +
			"</div>";
		}
		$("#" + this.containerId).html(this.strHtml);
	}

	//build a list of items
	lists.prototype.buildList = function(){
		if(this.listTitle.length > 0){this.strHtml = "<h3>" + this.listTitle + "</h3>";}														//build list title if it exists

		this.strHtml = this.strHtml + "<div class='" + this.listClass + "'>";
		for (a=0; a < this.objList.list[0].items.length; a++){																											//loop through object creating list
			if(a % this.listBlock == 0){																																								//make blocks of 4 list items each
				if(this.className == "bgListClr2"){this.className = "bgListClr1";} else{this.className = "bgListClr2";}			//toggle class name
				if(a > 0){this.strHtml = this.strHtml + "</div><div class='" + this.className + "'>";} else{this.strHtml = this.strHtml + "<div class='" + this.className + "'>";}  //start // end div block
			}
			this.strHtml = this.strHtml + "<div class='listItem'>" + (a*1+1*1) + ". " + this.objList.list[0].items[a].item + "</div>";	//one list item
		}
		this.strHtml = this.strHtml + "</div>";																																			//end div block

		$("#" + this.containerId).html(this.strHtml);																																//add html to container
	}
}
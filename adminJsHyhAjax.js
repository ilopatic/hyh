/*-------------------------------------------------------------------Ajax Class-------------------------------------------------------------------*/

function ajaxLocal(){
	this.objFile = null;

	ajaxLocal.prototype.instantiate = function(objFile){
		this.objFile = objFile;
	}

	ajaxLocal.prototype.ajaxGetFile = function(fileName){
		var returnVal = '';

		$.ajax({
			url: this.objFile.get,
			data: 'fileName=' + fileName,
			async: false,
			success: function(response){returnVal = response;}
		});

		return returnVal;
	}
	
	ajaxLocal.prototype.ajaxLoginUser = function(username,password){
		var returnVal = '';

		$.ajax({
			url: this.objFile.users,
			data: 'action=loginUser&username=' + username + '&password=' + password,
			async: false,
			success: function(response){returnVal = response;}
		});

		return returnVal;
	}
	
	ajaxLocal.prototype.getActivitiesList = function(groupId){
		var returnVal = '';

		$.ajax({
			url: this.objFile.activities,
			async: false,
			data: 'action=getActivitiesList&groupId=' + groupId,
			success: function(response){returnVal = response;}
		});

		return returnVal;
	}

	ajaxLocal.prototype.getActivity = function(activityId){
		var returnVal = '';

		$.ajax({
			url: this.objFile.activities,
			async: false,
			data: 'action=getActivity&activityId=' + activityId,
			success: function(response){returnVal = response;}
		});

		return returnVal;
	}
	
	ajaxLocal.prototype.getLists = function(listIds){
		var returnVal = '';

		$.ajax({
			url: this.objFile.lists,
			async: false,
			data: 'action=getLists&listIds=' + listIds,
			success: function(response){returnVal = response;}
		});

		return returnVal;
	}
	
	ajaxLocal.prototype.getListGroup = function(listTypeId){
		var returnVal = '';

		$.ajax({
			url: this.objFile.lists,
			async: false,
			data: 'action=getListGroup&listTypeId=' + listTypeId,
			success: function(response){returnVal = response;}
		});

		return returnVal;
	}
	
	
}
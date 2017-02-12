/*-------------------------------------------------------------------Ajax Class-------------------------------------------------------------------*/

function ajaxLocal(){
	this.getFileModelFileName = '';

	ajaxLocal.prototype.instantiate = function(config){
		this.getFileModelFileName = config.siteUrl + config.modelDir + config.getFile;
	}

	ajaxLocal.prototype.ajaxGetFile = function(fileName){
		var returnVal = '';

		$.ajax({
			url: this.getFileModelFileName,
			data: 'fileName=' + fileName,
			async: false,
			success: function(response){returnVal = response;}
		});

		return returnVal;
	}
	
	// $.ajax({
    // url: '/script.php',
    // type: 'POST',
    // data: { value: 'some huge string here' },
    // success: function(result) {
        // alert('the request was successfully sent to the server');
    // }
	// });
}
var downloadFiles = null;
document.addEventListener("deviceready", function(){
	document.addEventListener("offline", function(){
		try{
			document.getElementById("nonet").classList.add('active');
		} catch(msg){
		}
	}, false);
	document.addEventListener("online", function(){
		try{
			document.getElementById("nonet").classList.remove('active');
		} catch(msg){
		}
	}, false);

	downloadFiles =  function(url,filename) {
	   var fileTransfer = new FileTransfer();
	   var uri = encodeURI(url);
	   var fileURL =  "///storage/emulated/0/CollegeNotes/"+filename;

	   fileTransfer.download(
	      uri, fileURL, function(entry) {
	         alert("Downloaded successfully in " + entry.toURL());
	      },
			
	      function(error) {
	         alert("download error source " + error.source);
	         console.log("download error target " + error.target);
	         console.log("download error code" + error.code);
	      },
			
	      false, {
	         headers: {
	            "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
	         }
	      }
	   );
	}
}, false);



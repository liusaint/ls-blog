function setA(){
	var aDoms = document.getElementsByTagName('a');
	var len = aDoms.length;
	for (var i = 0; i < len; i++) {
		aDoms[i].setAttribute("target","_blank")
	}
}


chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		//console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
		if (request.greeting == "hello"){
			setA();
			// sendResponse({farewell: "goodbye"});
		}else{
      		// sendResponse({});
      	}
      });

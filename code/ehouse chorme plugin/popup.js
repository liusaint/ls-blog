var btn = document.getElementById('hide');

btn.onclick = function() {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {
			greeting: 'hide'
		}, function(response) {
			
		});
	});

}


var btn1 = document.getElementById('click');

btn1.onclick = function() {	
	
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {
			greeting: 'click'
		}, function(response) {
			
		});
	});

}


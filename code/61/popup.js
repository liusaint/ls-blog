
// var btn = document.getElementById('run');

// btn.onclick = function(){

	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {greeting: "hello"}, function(response) {
			// console.log(response.farewell);
		});
	});

// }


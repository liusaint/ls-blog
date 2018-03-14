var btn = document.getElementById('hide');

btn.onclick = function() {
	debugger;

	do('hide');

}


var btn1 = document.getElementById('click');

btn1.onclick = function() {

	do('click');

}

function do(msg) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {
			greeting: msg
		}, function(response) {
			// console.log(response.farewell);
		});
	});
}
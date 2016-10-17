const POLL_FREQUENCY = 1; // every 1 second


//poll the database occasionally to see what updates have occured:
//any updates should be handled
var lastTime = Date.now();
function pollUpdates() {
	everyXSeconds(POLL_FREQUENCY, function() {
		$.get("../Backend/requestupdates.php?TIMESTAMP=" +
				(lastTime - lastTime),
				null,
				function(result, status) {
			result = result.split("\"data\": }").join("\"data\": {}}")
			.split("\"data\": \n}").join("\"data\": {}}")
			.split("\"data\":\n }").join("\"data\": {}}")
			.split("\"data\":  }").join("\"data\": {}}")
			.split("\"data\":\n}").join("\"data\": {}}")
			.split("\"data\": \r}").join("\"data\": {}}")
			.split("\"data\":\r }").join("\"data\": {}}")
			.split("\"data\":  }").join("\"data\": {}}")
			.split("\"data\":\r}").join("\"data\": {}}");
			result = JSON.parse(result);
			//console.log(result);
			if (status == "success" && result.length) {
				while(result.length > 0) {
					//if (result != undefined) {
					handleUpdate(result.pop());
					//}
				}
			}
		});
		lastTime = Date.now() - POLL_FREQUENCY;
	});
}


//Returns a random integer between min (included) and max (included)
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkForAdd(event) {
	var xVal = "clientX", yVal = "clientY";
	if ($(event.target).is(".clipTimeline")) { // clicked the background
		var $tempInstrument = $("#instrumentTemplate");
		var instrumentHeight = $tempInstrument.height() +
		parseInt($tempInstrument.css("margin-bottom"));
		var instrumentInd = Math.floor(event[yVal] / instrumentHeight);
		var time = (event[xVal] - 200) / timeScale;
		addNewClipObject(instrumentInd + 1, time);
		buildTable();
	}
}

//a function to run a function every x seconds
function everyXSeconds(x, func) {
	while(true){
		setTimeout(function() {func();}, x * 1000);}}



//given an update data row, do the necessary changes locally
function handleUpdate(update) {
	if (update.action == "UPDATE") {
		if (update.class == "Clips") {
			console.log("Handle UPDATE");
			updateClipData(update.objectID,
					update.data.instrument,
					update.data.startTime,
					update.data.duration,
					update.data.type,
					update.data.contents);}
	} else if (update.action == "CREATE") {
		if (update.class == "Clips") {
			console.log("Handle CREATE");
			addNewClipObject(update.data.instrument,
					update.data.startTime,
					false);}}}

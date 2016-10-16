onmessage = function(e){
	
	console.log("Received");
	var workerResult="Result: ' + (e.data[0] * e.dat[1]));
	console.log("Posting back");
	postMessage(workerResult);
}

var ac = new AudioContext();

var instrumentTypes = ["acoustic_grand_piano", "acoustic_guitar_steel",
                       "Drum", "acoustic_guitar_steel"];
var data = {
		instruments: [],
		clips: []};

//{"id":783918, "data":{"instrument":1,"startTime":0.49,"duration":2,"type":"note","contents":[{ note:'E2', time:1, duration:4},{note:'E3', time:1, duration:4},{note:'E5', time:1, duration:4}]} } ]};
//	{"id":783918, "data":{"instrument":1,"startTime":0.49,"duration":2,"type":"note","contents":[{'F2', 1, 4},{'F3', 1, 4},{'F5', 1, 4}]}},
//	{"id":783918, "data":{"instrument":1,"startTime":0.49,"duration":2,"type":"note","contents":[{'G2', 1, 4},{'G3', 1, 4},{'G5', 1, 4}]}},
//	{"id":783918, "data":{"instrument":1,"startTime":0.49,"duration":2,"type":"note","contents":[{'A2', 1, 4},{'A3', 1, 4},{'A5', 1, 4}]}}]


function makeWave(src){
	return new Audio(src);
}

//Plays an audio file
function playWave(audio){
	audio.play();
}

//Discrete notes from a certain instrument
function playNote(instrument, tone, length){
	//Load an instrument from the online repo
	//Do this by entering your own URL or just using the default https://gleitz.github.io/midi-js-soundfonts/
	Soundfont.instrument(ac, instrument)
	.then(function(instrument) {

		instrument.play(tone, ac.currentTime, {duration:length});
	}); 
}

//pass this a legal instrument name and an array of notes (as defined in interface.js)
function playNoteSeries(instrument, notes){
	Soundfont.instrument(ac, instrument)
	.then(function(instrument) {
		instrument.schedule(ac.currentTime, notes);
	}
	);
}




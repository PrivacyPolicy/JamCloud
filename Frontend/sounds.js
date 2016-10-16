var ac = new AudioContext();


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
		console.log(notes[0]);
		instrument.schedule(ac.currentTime, notes);
		//instrument.schedule(ac.currentTime, [{time:notes[i].startTime, note:notes[i].pitch, duration:notes[i].duration}]);
	
}
);
}

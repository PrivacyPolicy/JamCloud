var ac = new AudioContext();

//General audio file.
function Sound(src){
	
	this.audio = new Audio(src);
	function play(){
		audio.play;
	}
}

//Discrete notes from a certain instrument
function playNote(instrument, tone, length){
	//Load an instrument from the online repo
	//Do this by entering your own URL or just using the default https://gleitz.github.io/midi-js-soundfonts/
	Soundfont.instrument(ac, instrument)
        .then(function(instrument) {
        
        instrument.play(tone, ac.currentTime, {duration:length});

	//instrument.schedule(ac.currentTime + 5, [{time:0, note: 60},{time: 3, note: 70}]);
    }); 
}


function playNoteSeries(instrument, notes){
	Soundfont.instrument(ac, instrument)
        	.then(function(instrument) {
		
		instrument.schedule(ac.currentTime, [{time:0, note: 60},{time: 3, note: 70}]);
}
);
}

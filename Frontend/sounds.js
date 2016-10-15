var ac = new AudioContext();

//General audio file.
function Sound(src){
	
	this.audio = new Audio(src);

	function play(){
		audio.play;
	}
}

//Discrete notes from a certain instrument
function Note(instrument, tone, callback){
	//Load an instrument from the online repo
	//Do this by entering your own URL or just using the default https://gleitz.github.io/midi-js-soundfonts/
	Soundfont.instrument(ac, instrument)
        .then(function(instrument) {
        
        instrument.play(tone);
    }); 
}
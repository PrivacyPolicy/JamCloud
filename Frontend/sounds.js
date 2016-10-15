//var Soundfont = require('soundfont-player')

//General audio file.
function Sound(src){
	
	this.audio = new Audio(src);

	function play(){
		audio.play;
	}
}

//Discrete notes from a certain instrument
function Note(instrument, tone){
	//Load an instrument from the online repo
	//Do this by entering your own URL or just using the default https://gleitz.github.io/midi-js-soundfonts/
	var instr = Soundfont.instrument(instrument); 
	//e.g. 'C4', 'G3', etc.
	var t = tone;

	//guess what this does......
	function play(){
		instr.play(t);
	}
}

var ac = new AudioContext();

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
	this.instr = Soundfont.instrument(ac, instrument); 
	//e.g. 'C4', 'G3', etc.
	this.t = tone;

	//guess what this does......
	this.play = function(){
		this.instr.play(this.t);
	}

	function stop(){
		instr.stop();
	}
}

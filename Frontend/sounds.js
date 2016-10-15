function NoteClip(objID, arr){
	this.ID = objID;
	this.play = function(){
		LIB_PLAY(this.soundSeq);
	}
	
}

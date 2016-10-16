const OBJECT_CLIP = "Clips";
var timeScale = 100; // 100 px / second
                     // future: px/beats
var instrumentTypes = ["acoustic_grand_piano", "acoustic_guitar_steel",
                       "Drum", "acoustic_guitar_steel"];
var data = {
    instruments: [
        {
            id: 1,
            type: 0, // instruments[0] == "Piano"
            clips: [
                new noteClip("C3", 0, 1, 0),
                new noteClip("C4", 1, 1, 0),
                new noteClip("C5", 2, 1, 0)
                ]
        },
        {
            id: 2,
            type: 2, // instruments[2] == "Drum"
            clips: [
                new noteClip("D3", 3, 1, 2),
                new noteClip("D4", 4, 1, 2),
                new noteClip("D5", 5, 1, 2)
                ]
        },
        {
            id: 3,
            type: 4, // instruments[3] == "Electric Guitar"
            clips: [
                new noteClip("E3", 6, 1, 3),
                new noteClip("E4", 7, 1, 3),
                new noteClip("E5", 8, 1, 3)
                ]
        }
        ]
};

$(function() {
    buildTable();
});


// Plays the whole piece. Initiates all sound and moves the timer bar.
function playAll(){
	//Concatenate like instrument sounds together
	var allnotes=[];
	for (var i=0; i<data.instruments.length; i++){
	
		for (var j=0; j<data.instruments[i].clips.length; j++){
			allnotes = allnotes.concat(data.instruments[i].clips[j].notes);
		}
	}
	//Play each instrument separately them all as a single instrument call	
	playNoteSeries("acoustic_grand_piano" , allnotes);
	stepTimerBar();
}

// 
function stepTimerBar(){
	//var increment = ($('#bpm').val) * ($('.clipTimeline').css('width')/60);
	//$('#timerBar').css('left',$('#timerBar').css('left')+increment);
	$('#timerBar').velocity({left: "500px" },{duration:30000});

}

// clip constructor: a segment of sound (MIDI music, file audio)
function Clip(id, startTime, duration, instrument) {
    this.id = id;
    this.startTime = startTime;
    this.duration = duration;
    this.instrument = instrument;
}
// a type of clip: specifically, it contains notes
function noteClip(notes, startTime, noteDuration, instrument) {
                notes = [
                    {note: notes, time: startTime, duration: noteDuration}]

	
	    Clip.call(this);  
	    this.notes = notes;
		
		this.addNote = function(newnote, newtime, newduration){
			this.notes = this.notes.concat({note:newnote, time:newtime, duration:newduration });
		}
}

function waveClip(startTime, duration, instrument, fileURL) {
    Clip.call(this);
    this.fileURL = fileURL;
    // TODO cache the file
}

function buildTable() {
    // Empty the table of any instruments
    $("#content tr:not(.persistant)").remove();

    // go through and add the instruments
    for (var i = 0; i < data.instruments.length; i++) {
        addInstrument(data.instruments[i]);
    }
    if (i === 0) { // No instruments: new file
        // TODO show new file options
    }
    
    // add event listeners
    $(".clip").mousedown(startDragClip);
}

// 
function addInstrument(instrument) {
    // Make a copy of the template
    var template = $("#instrumentTemplate").get(0).cloneNode(true);
    template.id = "instrument_" + instrument.id;
    var $temp = $(template);
    // edit the template values
    $temp.removeClass("persistant").removeClass("hidden");
    $temp.find(".instrumentSettings > .text").text(
        instrumentTypes[instrument.type]);
    // add the clips
    for (var i = 0; i < instrument.clips.length; i++) {
        addClip($temp, instrument.clips[i]);
    }

    // add the newly-filled template to the list
    $temp.insertBefore("#instrumentAdd");
}
function addClip($instrument, clip) {
    // copy the template
    var template = $("#clipTemplate").get(0).cloneNode(true);
    template.id = "clip_" + clip.id;
    var $clipElem = $(template);

    // edit the template values
    $clipElem.removeClass("persistant").removeClass("hidden");
    $clipElem
        .css({left: (timeScale * clip.startTime) + "px",
              width: (timeScale * clip.duration) + "px",
              zIndex: parseInt(clip.startTime)})
    .find(".text")
        .text("TODO content");

    // add the newly-filled template to the list
    $instrument.find(".clipTimeline").append($clipElem);
}

// This is a closure. I'm not explaining JS closures today.
var startDragClip = (function() {
    const xVal = "clientX", yVal = "clientY", dragging = "dragging";
    var oldStartLeft = -1, oldMouseX = -1,
        oldInstrument = -1,
        instrumentHeight = -1,
        $newInstrument,
        oldScrollX = -1,
        oldStartTop = -1;
    return function(event) {
        var $clip = $(event.target);
        $clip.addClass(dragging);
        oldStartLeft = parseFloat($clip.css("left"));
        oldMouseX = parseFloat(event[xVal]);
        oldInstrument = parseInt($clip.parentsUntil("#content").last()
                                 .attr("id").split("_")[1]);
        oldStartTop = $clip.position().top;
        var newX = -1;
        oldScrollX = $(window).scrollLeft();
        
        var $tempInstrument = $("#instrumentTemplate");
        instrumentHeight = $tempInstrument.height() +
            parseInt($tempInstrument.css("margin-bottom"));
        
        var $instruments = $(".instrument:not(.persistant)");
        var mouseMove = function(event) {
            // Handle x movement
            var deltaX = event[xVal] - oldMouseX;
            var deltaScrollX = $(window).scrollLeft() - oldScrollX;
            newX = oldStartLeft + deltaX + deltaScrollX;
            newX = Math.max(0, newX);
            $clip.css("left", newX + "px");
            
            // handle y movement (change of instrument)
            $newInstrument = whichInstrumentForY($instruments,
                                                 event[yVal],
                                                 instrumentHeight);
            if ($newInstrument != null) {console.log(oldStartTop);
                var newY = $newInstrument.position().top - oldStartTop;
                $clip.css("top", newY + "px");
            } else {
                $newInstrument = $clip.parentsUntil("#content").last();
            }
        };
        var end = function(event) {
            $clip.removeClass(dragging);
            $(document).off("mouseup", end)
                .off("mousemove", mouseMove);
            // Update the server
            var instrID = parseInt($newInstrument.attr("id")
                                   .split("_")[1]);
            var clipID = parseInt($clip.attr("id").split("_")[1]);
            var clipData = getClipIndexForClipId(clipID);
            serverUpdate(OBJECT_CLIP,
                         clipID,
                         {"instrument": instrID,
                          "startTime": parseInt(newX / timeScale),
                          "duration": clipData.duration},
                         function(response, status) {
                console.log(JSON.stringify(response) + "\n\n" + status);
            });
        };
        $(document).mousemove(mouseMove).mouseup(end);
    }
})();
// find which instrument the y-position is referring to
function whichInstrumentForY($instruments, y, instrumentHeight) {
    console.log(instrumentHeight);
    var size = $instruments.size();
    for (var i = 0; i < size; i++) {
        if ((i + 1) * instrumentHeight > y) {
            //console.log($instruments.eq(i));
            return $instruments.eq(i);
        }
    }
    return null;
}
    
function getClipIndexForClipId(id) {
    for (var i = 0; i < data.instruments.length; i++) {
        var clips = data.instruments[i].clips;
        for (var j = 0; j < clips.length; j++) {
            if (clips[j].id == id) {
                return clips[j];
            }
        }
    }
}


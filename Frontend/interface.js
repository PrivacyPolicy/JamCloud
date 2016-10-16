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
                new noteClip(1, 0, 2, 0),
                new noteClip(2, 3, 4, 0),
                new noteClip(3, 8, 1, 0)
                ]
        },
        {
            id: 2,
            type: 2, // instruments[2] == "Drum"
            clips: [
                new noteClip(4, 2, 20, 2),
                new noteClip(5, 4, 4, 2),
                new noteClip(6, 3, 1, 2)
                ]
        },
        {
            id: 3,
            type: 4, // instruments[3] == "Electric Guitar"
            clips: [
                new noteClip(7, 1, 2, 3),
                new noteClip(8, 3, 4, 3),
                new noteClip(9, 2, 1, 3)
                ]
        }
        ]
};

$(function() {
    buildTable();
});


// Plays the whole piece. Initiates all sound and moves the timer bar.
function playAll(){
	for (var i=0; i<data.instruments.length; i++){
		for (var j=0; j<data.instruments[i].clips.length; j++){
			playNoteSeries("acoustic_grand_piano" , data.instruments[i].clips[j].notes);
		}
	}
}

// 
function stepTimerBar(){

}

// clip constructor: a segment of sound (MIDI music, file audio)
function Clip(id, startTime, duration, instrument) {
    this.id = id;
    this.startTime = startTime;
    this.duration = duration;
    this.instrument = instrument;
}
// a type of clip: specifically, it contains notes
function noteClip(startTime, duration, instrument, notes) {
                notes = [
                    {pitch: 'C4', startTime: 2.4, duration: 1.3}]
	//	    {pitch: 'E4', startTime: 2.6, duration: 1.3},
  //                  {pitch: 'G4', startTime: 2.8, duration: 1.3}
//                ]
    Clip.call(this);
    //this = new Clip(startTime, duration, instrument);
    this.notes = notes;
	//playNoteSeries("acoustic_grand_piano", this.notes);
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
        instrumentHeight = -1;
    $(function() {
        var $instrument = $("#instrumentTemplate");
        instrumentHeight = $instrument.height() +
            parseInt($instrument.css("margin-bottom"));
    });
    return function(event) {
        var $clip = $(event.target);
        $clip.addClass(dragging);
        oldStartLeft = parseFloat($clip.css("left"));
        oldMouseX = parseFloat(event[xVal]);
        oldInstrument = parseInt($clip.parentsUntil("#content").last()
                                 .attr("id").split("_")[1]);
        var mouseMove = function(event) {
            // Handle x movement
            var deltaX = event[xVal] - oldMouseX;
            var newX = oldStartLeft + deltaX;
            newX = Math.max(0, newX);
            $clip.css("left", newX + "px");
            
            // handle y movement (change of instrument)
            var $instrument = whichInstrumentForY(event[yVal]);
            console.log($instrument);
        };
        var end = function(event) {
            $clip.removeClass(dragging);
            $(document).off("mouseup", end)
                .off("mousemove", mouseMove);
        };
        $(document).mousemove(mouseMove).mouseup(end);
    }
    // find which instrument the y-position is referring to
    function whichInstrumentForY(y) {
        var $instruments = $(".instrument:not(.persistant)");
        console.log($instruments);
        for (var i = 0; i < $instruments.size(); i++) {
            if ((i + 1) * instrumentHeight > y) {
                //var newY = (i - 1) * instrumentHeight;
                //$clip.css("top", newY + "px");
                return $instruments.eq(i);
//                $clip.appendTo(
//                    $instruments.eq(i).find(".clipTimeline"));
//                break;
            }
        }
    }
})();

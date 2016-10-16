var timeScale = 100; // 100 px / second
                     // future: px/beats
var instrumentTypes = ["acoustic_grand_piano", "acoustic_guitar_steel", "Drum", 
    "acoustic_guitar_steel"];
var data = {
    instruments: [
        {
            id: 1,
            type: 0, // instruments[0] == "Piano"
            clips: [
                new Clip(1, 0, 2, 0),
                new Clip(2, 3, 4, 0),
                new Clip(3, 8, 1, 0)
                ]
        },
        {
            id: 2,
            type: 2, // instruments[2] == "Drum"
            clips: [
                new Clip(4, 2, 2, 2),
                new Clip(5, 4, 4, 2),
                new Clip(6, 3, 1, 2)
                ]
        },
        {
            id: 3,
            type: 3, // instruments[3] == "Electric Guitar"
            clips: [
                new Clip(7, 1, 2, 3),
                new Clip(8, 3, 4, 3),
                new Clip(9, 2, 1, 3)
                ]
        }
        ]
};

$(function() {
    buildTable();
});

// clip constructor: a segment of sound (MIDI music, file audio)
function Clip(id, startTime, duration, instrument) {
    this.id = id;
    this.startTime = startTime;
    this.duration = duration;
    this.instrument = instrument;
}
// a type of clip: specifically, it contains notes
function noteClip(startTime, duration, instrument, notes) {
//                notes: [
//                    {pitch: 74, startTime: 2.4, duration: 1.3},
//                    ...
//                ]
    Clip.call(this);
    //this = new Clip(startTime, duration, instrument);
    this.notes = notes;
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
    const xVal = "clientX";
    var oldStartLeft = 0, oldMouseX = 0;
    return function(event) {
        var $clip = $(event.target);
        oldStartLeft = parseFloat($clip.css("left"));
        oldMouseX = parseFloat(event[xVal]);
        $clip.mousemove(mouseMove);
        $clip.mouseup(end).mouseout(end);
        var mouseMove = function(event) {
            console.log(oldStartLeft);
            var deltaX = event[xVal] - oldMouseX;
            $clip.css("left", (oldStartLeft + deltaX) + "px");
        };var end;
//        var end = function(event) {
//            $clip.off("mouseup", end).off("mouseout", end)
//                .off("mousemove", mouseMove);
//        };
    }
})();

function endDragClip(clip) {
    
}

const OBJECT_CLIP = "Clips";
var timeScale = 100; // 100 px / second
                     // future: px/beats
var instrumentTypes = ["acoustic_grand_piano", "acoustic_guitar_steel",
                       "Drum", "acoustic_guitar_steel"];
var data = {
    instruments: [],
    clips: []
};

$(function() {
    console.log("Loading...");
    var loadedFiles = [false, false];
    $.get("../Backend/getdata.php?CLASS=Instruments",
          null,
          function(result, status) {
        if (status == "success") {
            data.instruments = JSON.parse(result);
            loadedFiles[0] = true;
            bothLoaded(loadedFiles);
            return;
        }
        // error occurred
        console.error(data + ": Error occurred, didn't load data. :(");
    });
    $.get("../Backend/getdata.php?CLASS=Clips",
          null,
          function(result, status) {
        if (status == "success") {
            console.log("SOMETHING: " + result);
            console.log(JSON.stringify(JSON.parse(result)));
            data.clips = JSON.parse(result);
            loadedFiles[1] = true;
            bothLoaded(loadedFiles);
            return;
        }
        // error occurred
        console.error(data + ": Error occurred, didn't load data. :(");
    });
    
    function bothLoaded(loadedFiles) {
        if (loadedFiles[0] && loadedFiles[1]) {
            buildTable();
            console.log("Successfully loaded the data");
        }
    }
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
                notes = [
                    {pitch: 'C4', startTime: 2.4, duration: 1.3},
		    {pitch: 'E4', startTime: 2.6, duration: 1.3},
                    {pitch: 'G4', startTime: 2.8, duration: 1.3}
                ]
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
    for (var j = 0; j < data.clips.length; j++) {
        addClip(data.clips[j]);
    }
    if (i === 0) { // No instruments: new file
        // TODO show new file options
    } else if (j === 0) { // there are instruments, just no clips yet
        // TODO show add clips options
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
        instrument.data.type);

    // add the newly-filled template to the list
    $temp.insertBefore("#instrumentAdd");
}
function addClip(clip) {
    // copy the template
    var template = $("#clipTemplate").get(0).cloneNode(true);
    template.id = "clip_" + clip.id;
    var $clipElem = $(template);

    // edit the template values
    $clipElem.removeClass("persistant").removeClass("hidden");
    $clipElem
        .css({left: (timeScale * clip.data.startTime) + "px",
              width: (timeScale * clip.data.duration) + "px",
              zIndex: parseInt(clip.data.startTime)})
    .find(".text")
        .text("TODO content");

    // add the newly-filled template to the list
    $("#instrument_" + clip.data.instrument)
        .find(".clipTimeline").append($clipElem);
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
        oldStartTop = $clip.parentsUntil("#content").last()
            .position().top;
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
            if ($newInstrument != null) {
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
                          "startTime": newX / timeScale,
                          "duration": clipData.data.duration},
                         function(response, status) {
                console.log(JSON.stringify(response) + "\n\n" + status);
            });
        };
        $(document).mousemove(mouseMove).mouseup(end);
    }
})();
// find which instrument the y-position is referring to
function whichInstrumentForY($instruments, y, instrumentHeight) {
    var size = $instruments.size();
    for (var i = 0; i < size; i++) {
        if ((i + 1) * instrumentHeight > y) {
            return $instruments.eq(i);
        }
    }
    return null;
}
    
function getClipIndexForClipId(id) {
    for (var i = 0; i < data.clips.length; i++) {
        if (data.clips[i].id == id) {
            return data.clips[i];
        }
    }
}
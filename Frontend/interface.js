const OBJECT_CLIP = "Clips";
const DEFAULT_DURATION = 4;
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

function buildTable() {
    // Empty the table of any instruments
    $("#content > :not(.persistant)").remove();

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
    $("#content").click(checkForAdd);
    $('#playButton').click(playAll);
    $('#stopButton').click(stopAll);
    $('#newInstr').click(createInstrument);

}

// Plays the whole piece. Initiates all sound and moves the timer bar.
function playAll(){

	//Concatenate like instrument sounds together

	var allnotes=[{note:'E5', time:0, duration:3}];
    	for (var j=0; j < data.clips.length; j++){
        	allnotes = allnotes.concat(data.clips[j].notes);
    	}
	// Play each instrument separately all as a single instrument call
	playNoteSeries("acoustic_grand_piano" , allnotes);
	stepTimerBar();
}

function stepTimerBar(){
	//var increment = ($('#bpm').val) * ($('.clipTimeline').css('width')/60);
	$('#timerBar').css('left', '200px');
	$('#timerBar').velocity({left: $('.clipTimeline').css('width') },{duration:($('#bpm').val())*60000/60 });


	console.log(($('#bpm').val())*100000/60);
}


function stopAll(){
	//"acoustic_grand_piano"
	$('#timerBar').velocity('finish');
}

// clip constructor: a segment of sound (MIDI music, file audio)
function Clip(id, startTime, duration, instrument) {
    this.id = id;
    this.startTime = startTime;
    this.duration = duration;
    this.instrument = instrument;
}
// a type of clip: specifically, it contains notes
function noteClip(notes, instrument) {
      //notes object should be of the form: notes = [{note: "C4", time: 1, duration: 1},{....}]
	
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

function createInstrument(){
	
 	var instrument = {"id":1, "data":{
	"type":"default",
	"volume":1,
	"balance":0}};

	instrument.type = window.prompt("What kind of instrument would you like?","acoustic_grand_piano");
	//addInstrument(instrument);
	//buildTable();
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
            var clipData = getClipDataForClipId(clipID);
            var clipInd = updateClipData(clipID,
                                         instrID,
                                         newX / timeScale,
                                         clipData.data.duration);
            serverUpdate(OBJECT_CLIP,
                         clipID,
                         data.clips[clipInd].data,
                         function(response, status) {
                if (status != "success") {
                    console.error("Some kind of weird error occurred");
                }
                console.log(JSON.stringify(response) + ", " + status);
            });
        };
        $(document).mousemove(mouseMove).mouseup(end);
    }
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
})();

function updateClipData(id, instrument, startTime, duration) {
    var ind = getClipIndexForClipId(id);
    var clip = data.clips[ind];
    clip.data.instrument = instrument;
    clip.data.startTime = startTime;
    clip.data.duration = duration;
    buildTable();
    return ind;
}

function addNewClipObject(instrument, startTime) {
    var id = getRandomInt(1, 10000000);
    data.clips.push({id: id, data: {
        instrument: instrument,
        startTime: startTime,
        duration: DEFAULT_DURATION
    }});
}
    
function getClipIndexForClipId(id) {
    for (var i = 0; i < data.clips.length; i++) {
        if (data.clips[i].id == id) {
            return i;
        }
    }
}
function getClipDataForClipId(id) {
    return data.clips[getClipIndexForClipId(id)];
}
    
// Returns a random integer between min (included) and max (included)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkForAdd(event) {
    console.log(event.target);
}

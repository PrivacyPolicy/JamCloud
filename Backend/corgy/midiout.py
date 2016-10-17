#!/usr/bin/env python

from midiutil.MidiFile import MIDIFile
import json
class Note:
	def __init__(self, pitch, duration,time):
		self.pitch = pitch;
		self.time = time;
		self.duration = duration
		
class NoteClip:
	def __init__(self, startTime,notes):
		self.startTime = startTime
		self.notes = notes
def _createRawMIDI(filename,clips):
	channel = 0;
	track = 0;
	tempo = 60;
	volume = 100
	time = 0;
	outfile = MIDIFile(1)
	outfile.addTempo(track,time,tempo)
	for clip in clips:
		channel = (channel + 1)%16
		for note in clip.notes:
			print(note.time);
			print(note.duration);
			print(note.pitch);
			print(clip.startTime);
			time = int(note.time) + int(clip.startTime)
			print("Oh")
			duration = note.duration
			pitch = note.pitch
			print("About to out")
			print(track)
			print(channel)
			print(pitch)
			print(time)
			print(duration)
			print(volume)
			outfile.addNote(int(track),int(channel),int(pitch),int(time),int(duration),int(volume));
			print("Outing")
	print("Still unwritten")
	with open(filename,"wb") as written_file:
		print(type(filename))
		print(type(outfile))
		print(type(written_file))
		outfile.writeFile(written_file)
		print("Almost Written")
	print("Not unwritten")

def createMIDI(filename, j = '{"0":{"startTime": 0, "duration": 5,"notes":{"0":{"pitch":65, "time":1,"duration":6}}}}'):
	x = json.loads(j)
	keys = list(x)
	clips=[]
	print("for")
	for key in keys:
		try:
			notes = []
			clip = x[key]
			nkeys = list(clip["contents"]);
			for nkey in nkeys:
				note = clip["contents"][nkey]
				notes.append(Note(note["pitch"],note["time"],note["duration"]));
			clips.append(NoteClip(clip["startTime"],notes))
		except Exception as e:
			print("Unhelpful error");
			print(e)
			print("Message")
	print("about ot create");	
	print(filename);
	print(clips)
	_createRawMIDI(filename,clips)


"""
		
degrees  = [60, 62, 64, 65, 67, 69, 71, 72] # MIDI note number
track    = 0
channel  = 0
time     = 0   # In beats
duration = 1   # In beats
tempo    = 60  # In BPM
volume   = 100 # 0-127, as per the MIDI standard

MyMIDI = MIDIFile(1) # One track, defaults to format 1 (tempo track
                     # automatically created)
MyMIDI.addTempo(track,time, tempo)

for pitch in degrees:
    MyMIDI.addNote(track, channel, pitch, time, duration, volume)
    time = time + 1

with open("major-scale.mid", "wb") as output_file:
    MyMIDI.writeFile(output_file)
    """

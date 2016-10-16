#!/usr/bin/env python
import cgi
import midiout
print("Content-Type: text/html;")
print("")
vars = cgi.FieldStorage();
name = "./audio/"+vars["NAME"].value;
data = vars["DATA"].value;
#print(name);
#print(data);
try:
	midiout.createMIDI(name,data);
	print("success")
except Exception as e:
	print(e)

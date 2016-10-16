#!/usr/bin/env python
import cgi
import midiout
print("Content-Type: text/html;")
print("")
vars = cgi.FieldStorage();
name = "./audio/"+vars["NAME"].value;
try:
	data = vars["DATA"].value;
except Exception:
	try:
		import requests
		response = (requests.post("http://107.170.44.215/JamCloud/Backend/corgyjson.php").text);
		data = response
		print(data)
	except Exception as e:
		print("N-Error");
		print(e)
#print(name);
#print(data);
try:
	midiout.createMIDI(name,data);
	print("success")
except Exception as e:
	print(e)

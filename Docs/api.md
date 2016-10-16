# objectcommand.php

objectcommand.php allows a frontend to interact with the JamCloud database  
### POST Request Parmaters

**CLASS** - can be "Instruments" or "Clips"  
**ID** - The object ID  
**ACTION** - The interaction command  
**DATA** - Object JSON data  

### Return Data
`{"status":status,"message":"<message>"}`  

`status` will be `true` or `false`

### Actions
**UPDATE** - Update object (requires data)
**DELETE** - Delete object
**CREATE** - Create object (required data)

# getdata.php
getdata.php returns objects as JSON
### POST/GET Request Prameters
**CLASS** - can be "Instruments or "Clips"
### Return Data
Returns as JSON in the format:  
  
    {
        {"id":5,
        "data":<OBJECT DATA IN JSON FORMAT>}},
	{"id":256,
	"data":<OBJECT DATA IN JSON FORMAT>}
    }

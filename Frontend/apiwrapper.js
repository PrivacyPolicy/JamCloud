var rel_url = "http://107.170.44.215/JamCloud/Backend/getData.php";
function dump(obj){
	var out = '';
	for(var i in obj){
		out+= i+": "+obj[i]+"\n";
	}
	var pre = document.createElement('pre');
	pre.innerHTML = out;
	document.body.appendChild(pre);
}	
function contactAPI(page, params){
	 dump($.ajax({
            type : 'POST',
            url : rel_url+page,           
            data: params
            ,
        })); 
} 


const OBJECT_TYPES = ["Clips", "Instruments"];
function serverUpdate(type, id, data, callback) {
    $.post("../Backend/objectcommand.php",
           {"ACTION": "UPDATE",
            "CLASS": type,
            "ID": id,
            "DATA": JSON.stringify(data)
    }, callback, "json");
}
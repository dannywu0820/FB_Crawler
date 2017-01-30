process.env.PATH=process.env.PATH+":node_modules/phantomjs-prebuilt/bin/"+":node_modules/casperjs/bin/";

var port = 8888,
	host = "127.0.0.1",
	http = require('http');
	
var job_object = require("./self_modules/job_object"),
	action = require("./self_modules/action");
	
http.createServer(onRequest).listen(port, host, function(){
	console.log("Server listening at " + host + ":" + port.toString());
	
	//setup 環境變量 like DB.conf,PATH or 初始化 like port,garbage clean
});

function onRequest(req, res){ //request listener
	//deal with request
	var recv_json_str = "";
	req.on('data', function(data){
		console.log("****on data****");
		recv_json_str += data;
		console.log(recv_json_str);
	});

	var recv_json_obj = "";
	req.on('end', function(){
		console.log("****on end****");
		recv_json_obj = JSON.parse(recv_json_str);
		recv_json_obj.msg2 = "parse_fanpage.php -> server.js";

		//each action is encapsuled as a job object
		var job_obj = new job_object(recv_json_obj);
		console.log(JSON.stringify(job_obj.content));
		
		if(job_obj.action == "parse_fanpage"){
			action.parse_fanpage(job_obj, res);
		}
		else{ //no such action
			action.do_nothing(job_obj, res);
		}
	});
}
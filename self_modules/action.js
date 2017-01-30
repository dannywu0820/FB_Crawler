//[require section]
job_object = require('./job_object');

//[local section]: module variables & module functions
var action = {
	parse_fanpage: function(job_object, response){
		var exec = require('child_process').exec;
		var command = "casperjs ./parse_fanpage/crawler.js" +
		" --config=config.json" +
		" --url_fanpage=" + job_object.content.url_fanpage +
		" --num_want_posts=" + job_object.content.num_want_posts +
		" --fb_account=" + job_object.content.fb_account +
		" --fb_pasword=" + job_object.content.fb_pasword;
		
		console.log(command);
		var child = exec(command, function(error, stdout, stderr){
			//console.log(stdout);
			var result = stdout.split("<Result>")[1].split("</Result>")[0];
			result = JSON.parse(result);
			
			job_object.content.msg3 = "parse fanpage: " + job_object.content.url;
			job_object.result = {
				"status": "success",
				"job_id": job_object.job_id,
				"reaction": result.reaction
			};
			job_object.end(response);
		});
	},
	
	do_nothing: function(job_object, response){
		job_object.content.msg3 = "no such action";
		job_object.result = {
			"status": "failure",
			"job_id": job_object.job_id
		};
		job_object.end(response);
	}
}

//[export section]: module.exports | exports.func_name
module.exports = action;
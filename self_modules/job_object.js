//[require section]

//[local section]: module variables & module functions
var get_time = function(){
	var time = new Date();
	return time.getFullYear()+"/"+(time.getMonth()+1)+"/"+time.getDate()+" "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds()+"."+time.getMilliseconds();
};

var job_object = function(input){
	this.content = input;
	this.action = input.action;
	this.job_id = this.job_id_generate();
	this.time = get_time();
	this.result;
};

//If you want to write a function for an object, write in this way
job_object.prototype.job_id_generate = function(){
	return Date.now();
};

job_object.prototype.end = function(response){
	response.end(JSON.stringify(this.result));
}

//[export section]: module.exports | exports.func_name
module.exports = job_object;
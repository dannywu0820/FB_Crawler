/*
npm init
npm install phantomjs-prebuilt
npm install casperjs

setenv LC_ALL en_US.UTF8
setenv NODE_PATH $HOME/public_html/FB_Crawler/node_modules
setenv PATH $PATH\:$NODE_PATH/phantomjs-prebuilt/bin:$NODE_PATH/casperjs/bin

vim config.json
{
	"ignoreSslErrors": true,
	"sslProtocol": "any"
}

Finally execute in command line: casperjs --config=config.json /PATH_TO/crawler.js*/
var crawler = require('casper').create({
	//"verbose": true,
	//"logLevel": "debug"
});

var url_login = "https://www.facebook.com/login.php";
var url_fanpage = crawler.cli.get("url_fanpage");
var num_want_posts = crawler.cli.get("num_want_posts");
var fb_account = crawler.cli.get("fb_account");
var fb_pasword = crawler.cli.get("fb_pasword");

crawler.on("error", function(msg, trace){
	this.echo("Error: " + msg);
});

crawler.start("www.google.com.tw", function(){
	this.echo("start a crawler");
	console.log(url_fanpage);
	console.log(num_want_posts);
	console.log(fb_account);
	console.log(fb_pasword);
});

//Step1. Login to FB
crawler.thenOpen(url_login, function(){
	crawler.evaluate(function(account, pasword){
		document.getElementById("email").value = account;
		document.getElementById("pass").value = pasword;
		document.querySelector("#login_form").submit();
	}, fb_account, fb_pasword);
});

//Step2. Open the fanpage
crawler.thenOpen(url_fanpage, function(){
	this.echo("Open fanpage: " + this.getTitle());
});


crawler.then(function(){
	ScrollTillEnough(Number(num_want_posts));
});

var reaction_objs = [];
crawler.then(function(){
	var index = 0;
	this.repeat(Number(num_want_posts), function(){
		GetReactionNums(index, reaction_objs);
		index++;
	});
});

crawler.then(function(){
	var result = new Object();
	result.reaction = reaction_objs;
	console.log("<Result>" + JSON.stringify(result) + "</Result>");
	/*for(var i = 0; i < reaction_objs.length; i++){
		console.log(JSON.stringify(reaction_objs[i]));
	}*/
});

crawler.run();

function ScrollTillEnough(num_posts_want){
	crawler.then(function(){
		var num_posts_now = crawler.evaluate(function(){
			window.scrollTo(0, document.body.scrollHeight+5000);
			return document.querySelectorAll("._3t53._4ar-._ipn a._2x4v").length;
		});
		crawler.wait(3000);
		
		if(num_posts_now < num_posts_want) ScrollTillEnough(num_posts_want);
		else console.log("Got enough posts: " + num_posts_now);
	});
}

function GetReactionNums(index, reaction_objs){
	crawler.evaluate(function(index){
		var reactionLink = document.querySelectorAll("._3t53._4ar-._ipn a._2x4v")[index];
		reactionLink.click();
	}, index);
	
	crawler.waitForSelector("._43o4", function(){
		this.echo("Post" + " clicked");
		
		var numbers_get = this.evaluate(function(){
			var reaction_list;
			var numbers = [];
			
			reaction_list = document.querySelectorAll("._ds-._45hc a span span span._21af._9zc._2p7a");
			for(var i = 0; i < reaction_list.length; i++){
				var number = reaction_list[i].parentNode.innerText;
				numbers.push(number);
			}
			
			return numbers;
		});
		
		var types_get = this.evaluate(function(){
			var reaction_list;
			var types = [];
			
			reaction_list = document.querySelectorAll("._ds-._45hc a span span span._21af._9zc._2p7a");
			for(var i = 0; i < reaction_list.length; i++){
				var label = reaction_list[i].parentNode.getAttribute("aria-label");
				types.push(label);
			}
			
			return types;
		});
		
		renderReaction(types_get, numbers_get, reaction_objs);
		
		this.waitWhileSelector("._43o4", function(){
			this.echo("closed");
		});
		
		this.evaluate(function(){
			var close_button = document.querySelector("._42ft._5upp._50zy.layerCancel._1f6._51-t._50-0._50z-");
			close_button.click();
		});
	});
}

function renderReaction(types_get, numbers_get, reaction_objs){
	var reaction_obj = new Object();
	for(var j = 0; j < types_get.length; j++){
		if(types_get[j].indexOf("讚") != -1){ reaction_obj.good = numbers_get[j]; }
		else if(types_get[j].indexOf("心") != -1){ reaction_obj.love = numbers_get[j]; }
		else if(types_get[j].indexOf("哇") != -1){ reaction_obj.woow = numbers_get[j]; }
		else if(types_get[j].indexOf("嗚") != -1){ reaction_obj.cry = numbers_get[j]; }
		else if(types_get[j].indexOf("哈") != -1){ reaction_obj.haha = numbers_get[j]; }
		else if(types_get[j].indexOf("怒") != -1){ reaction_obj.rage = numbers_get[j]; }
		else{}
	}
	reaction_objs.push(reaction_obj);
}
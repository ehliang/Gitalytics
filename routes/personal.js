module.exports = function(router, request, config) {
	router.get('/personal', function(req, res){
	
	var parse = require('parse-diff');
	var fs = require('fs');
	var Promise = require('promise');


	var jsonReturn = {}; 
	var commits =1; 
	var collaborators =1; 
	var analysis ={};
	var additions =0; 
	var deletions=0; 

	var url = 'https://api.github.com/users/' + req.query.owner + '/repos?' + 
			'client_id=' + config.CLIENT_ID + '&client_secret=' + config.CLIENT_SECRET;

	var getRepos = function(){	

		request.get({
			url: url,
			headers: { 'user-agent': 'git-technetium'},
			json: true
		}, function(error, response, body) {
			console.log(error);

			writeFile("repoName", body);


			var repoNames = []; 


			for (var i=0; i<body.length; i++){
				repoNames[i]= body[i].name; 
				getCommits(repoNames[i]);
			}



		});
	};


	var getCommits = function(repoName){
		var commitsUrl = 'https://api.github.com/repos/' + req.query.owner + '/' + repoName + '/commits';
		request.get({
			url:commitsUrl, 
			headers: { 'user-agent': 'git-technetium'},
			json: true
		}, function(error, response, body) {
			console.log(error); 

			writeFile("commits", body); 

			for (var i =0; i<body.length; i++){

				getSingleCommitDiff(repoName, body[i].sha);

			}	

		});	



	};

	var getSingleCommitDiff = function(repoName, commitSha){
		var diffUrl = 'https://api.github.com/repos/' + req.query.owner + '/' + repoName + '/commits/' + commitSha;

		request.get({
			url:diffUrl, 
			headers: { 'user-agent': 'git-technetium', 'Accept': 'application/vnd.github.diff'},
			json: true
		}, function(error, response, body) {
			console.log(error); 

			writeFile(("commitdiff" + commitSha), body); 

		}

		);	

	}





															// var repositories = []; 
															// 		var cunter=0; 

															// var finalJson={personal: []}; 
															// for (var i=0; i<body.length; i++){
															// 	repositories[i]=body[i].name;

																// if(!body[i].fork){
																// 	callback(repositories[i], compareCallback, function(data){
																// 		cunter++; 
																// 		console.log(data);
																// 		finalJson.personal.push(data);	
																// 		console.log(cunter);


																// 		if (cunter==13)
																// 		{
																// 			res.send(finalJson);
																// 		}


																// 	});

															// 				// jsonReturn.name=body[i].name;
																			// jsonReturn.commits=commits; 
																			// jsonReturn.collaborators=collaborators;


																	// analysis = {'linesAdded': additions, 'linesDeleted': deletions};


																	// jsonReturn.analysis = analysis;


																	// console.log(jsonReturn);
				// } 


			// }


	var writeFile = function(name, data){
			fs.writeFile("./folder/" + name, JSON.stringify(data), function(err) {
			    if(err) {
			        return console.log(err);
			    }

    			console.log("The file was saved!");
			}); 


	}		


	// var getCommits = function(repoName, compareCallback, superCallback){
	// 	var repoUrl = 'https://api.github.com/repos/' + req.query.owner + '/' + repoName + '/commits?' + 
	// 		'client_id=' + config.CLIENT_ID + '&client_secret=' + config.CLIENT_SECRET; 

	// 	request.get({
	// 		url: repoUrl,
	// 		headers: { 'user-agent': 'git-technetium'},
	// 		json: true
	// 	}, function(error, response, body) {

	// 		console.log(repoName);
	// 		var add = 0;
	// 		var del =0; 
	// 		var counter =0; 
	// 		for(var i=0; i<body.length-1; i++){
	// 		try{

	// 			var headAuthor=body[i].committer.login; 

	// 			if (headAuthor==req.query.owner)
	// 			{


	// 				var base = body[i].sha; 
	// 				var head = body[i+1].sha;
 
	// 				commits+=1; 
	// 				compareCallback(repoName, head, base, function(data, data2){
	// 					// do something with data
	// 						add += data;
	// 						del+= data2; 
	// 						counter++; 
	// 						if (counter==body.length-1)
	// 						{
	// 						jsonReturn.name=repoName;
	// 						jsonReturn.commits=commits; 
	// 						jsonReturn.collaborators=collaborators;


	// 						analysis = {'filesAdded': 3, 'linesAdded': add, 'linesDeleted': del, 'similarityRating': (Math.random() * 11) + 2};


	// 						jsonReturn.analysis = analysis;


	// 						jsonReturn.gitScore = 10*Math.random(); 

	// 						superCallback(jsonReturn); 

	// 						console.log(jsonReturn);

	// 						}
	// 				});

	// 				//compareCallback(repoName, head, base, additions, deletions);

	// 			}
	// 			else {
	// 				collaborators+=1; 
	// 			}
	// 		}

	// 		catch(err)
	// 		{
	// 			console.log(err);
	// 		}

	// 		}

	// 		console.log('\n');

	// 	});
	// };


	// var compareCommits = function(repoName, head, base, callback)
	// {
	// 	var compareUrl = 'https://api.github.com/repos/' + req.query.owner + '/' + repoName + '/compare/' + head + '...' + base +'?' + 
	// 		'client_id=' + config.CLIENT_ID + '&client_secret=' + config.CLIENT_SECRET; 
	// 	request.get({
	// 		url: compareUrl, 
	// 		headers:{ 'user-agent': 'git-technetium', 'Accept': 'application/vnd.github.VERSION.diff'},
	// 		json: true
	// 	}, function(error, response, body) {

	// 		var diff = body; // input diff string 
	// 		var files = parse(diff);
	// 		var add =0; 
	// 		var del =0; 


	// 			files.forEach(function(file) {

	// 			add+=file.additions; 
	// 			del+=file.deletions; 
	// 			callback(add, del);
	// 		});

	// 	});


	// };

	getRepos();


	});
};


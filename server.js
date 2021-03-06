var express = require('express'),
    request = require('request'),
    config = require('./config'),
    Cookies = require('cookies'),
    fs = require('fs'),
  	path = require('path'),
  	bodyParser = require('body-parser'), 
  	crypto = require('crypto');

var app = express();
//var token;

app.use('/', express.static(path.join(__dirname, '')));
app.use(bodyParser.json());
var GitHubApi = require('github');
var github = new GitHubApi({
	version: "3.0.0",
    	headers: {
		"user-agent": "velocity"
	},
    	protocol: "https",
    	host: "api.github.com",
});


var router = express.Router();
require('./routes/code')(router, request, config, github);
require('./routes/publicrepo')(router, request, config);
require('./routes/personal')(router, request, config);

app.use('/token', function (req, res) { 
  console.log(res);
  res.end();
});

app.use('/api', router);

var oauth2 = require('simple-oauth2')({
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  site: 'https://github.com/login',
  tokenPath: '/oauth/access_token',
  authorizationPath: '/oauth/authorize'
});

// Authorization uri definition
var authorization_uri = oauth2.authCode.authorizeURL({
  redirect_uri: 'http://localhost:' + config.PORT + '/callback',
  scope: 'notifications',
  state: '3(#0/!~'
});

  // Initial page redirecting to Github
app.get('/auth', function (req, res) {
    res.redirect(authorization_uri);
});

app.get('/app', function (req, res) {
    res.sendfile('app.html');
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', function (req, res) {
  var code = req.query.code;
  oauth2.authCode.getToken({
    code: code,
    redirect_uri: 'http://localhost:8000/callback'
  }, saveToken);

  function saveToken(error, result) {
    if (error) { console.log('Access Token Error', error.message); }
    var token = oauth2.accessToken.create(result);
    console.log(result);
    console.log(token);
		new Cookies(req,res).set('access_token',result,{
		      httpOnly: true,
		        //secure: true      // for your production environment
	    });
    res.redirect('/');
  }
});
app.get('/', function(req, res) {
	var cookies = new Cookies(req, res);
	
  	var token = cookies.get( "access_token" );
	console.log('token ' + token);
	//oauth2.authCode.getToken(function(error, token) {
		/*if (token.expired()) {
			token.refresh(function(error, result) {
				token = result;
			});
		}
		console.log(token.error);*/
	if (typeof token == 'undefined') {
		res.send('Hello<br><a href="/auth">Log in with Github</a>');
	} else {
		var url = 'https://api.github.com/user?' + token;
		request.get({
			url: url,
			headers: {/*'Authorization': result,*/ 'user-agent': 'velocity' },
			json: true
		}, function(error, response, body) {
			console.log(body);
			res.send("Welcome! " + body.login);
		});
		console.log(token);
	}
});

app.listen(config.PORT, 'localhost', function() {
	console.log('Express server started on localhost: ' + config.PORT);
});
github.repos.getAll({
	type:'owner'
}, function(err, data){
	console.log('', data);
});
//var initialSort = function(input){
//	if (newFile)
//	{

// var initialSort = function(input){
// 	if (newFile)
// 	{

// 	}

// 	else(change)
// 	{

// 	}

// }

// var hashCheck = function(input){

// 	var fd = fs.createReadStream('./testFileCompare/bootstrap.min.css');

// 	var hash = crypto.createHash('sha1');
// 	hash.setEncoding('hex');

// 	fd.on('end', function() {
// 	    hash.end();
// 	    console.log(hash.read());
// 	});

// 	fd.pipe(hash);

// }; 

// var codeCheck = function(input){

// };

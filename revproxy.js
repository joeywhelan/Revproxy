/**
 * Proxy server to front-end Genesys Mobile Services (GMS) REST API calls 
 * Author: Joey Whelan
 * Date: 20 Feb 18
 */
'use strict';

var path = require('path');
var fs = require('fs'); 
var gms = 'https://svr2:3443';

var express = require('express');
var app = express();
var privateKey = fs.readFileSync('./key.pem'); 
var certificate = fs.readFileSync('./cert.pem'); 
var credentials = {key: privateKey, cert: certificate};
var https = require('https');
var httpsServer = https.createServer(credentials, app);

var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({
	secure : false,
	target : gms
});

httpsServer.on('upgrade', function (req, socket, head) {
	  proxy.ws(req, socket, head);
});

proxy.on('error', function (err, req, res) {
	console.log(err);
	try {
		res.writeHead(500, {
			'Content-Type': 'text/plain'
		});
		res.end('Error: ' + err.message);
	} catch(err) {
		console.log(err);
	}
});

app.use(express.static(path.join(__dirname, 'public')));

app.all("/genesys/*", function(req, res) {
	proxy.web(req, res);
});

httpsServer.listen(8443);

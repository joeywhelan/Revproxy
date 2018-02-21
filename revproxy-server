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
	secure : false
});
proxy.on('error', function (err, req, res) {
	  res.writeHead(500, {
	    'Content-Type': 'text/plain'
	  });
	  res.end('Error: ' + err.message);
});

app.get("/", function(req, res) {
	res.sendFile(path.join(__dirname + '/chat.html'));
});

app.all("/genesys/*", function(req, res) {
	proxy.web(req, res, {target : gms});
});

httpsServer.listen(8443);

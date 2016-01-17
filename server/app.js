var http = require('http');

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var serve = serveStatic('./dist');

var server = http.createServer(function(req, res) {
  var done = finalhandler(req, res);
  if(req.url.split('?')[0]=='/')
    req.url=['html/index.html', req.url.split('?')[1] || ''].join('?');  
  serve(req, res, done);
});

server.listen(80, function(){
  console.log('server started in port 80');
});

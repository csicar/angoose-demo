var ROOT = process.cwd();
var path= require("path"), http = require("http"), fs = require("fs");
var express = require("express");
var logging = require("log4js");
var logger = logging.getLogger('angoose');
logger.setLevel(logging.levels.DEBUG);
 

console.log("Create express app")
var app = express();
app.configure(function() {
    app.set('port', 8080);
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({secret: '1234567890QWERTY'}));
    app.use(app.router);
    app.use(function(err, req, res, next){
        console.log("In default error handling", err)
        res.send(500, 'Unhandled error: '+ err);
    });
    app.use(express.methodOverride());
    app.use(express.static( './public'));
});

// angoose setup
console.log("Init angoose");
require("angoose-users");
//var accessLog = require(ROOT+"/server/access-log");
var options = {
    extensions:[ROOT+'/node_modules/angoose-users','angoose-ui', ROOT+"/server/access-log"],
    modelDir:  './server',
    logging:'DEBUG',
    mongo_opts:'localhost:27017/test'
};    
require("angoose").init(app, options);

app.get("/todomvc", function(req, res){
    var fs = require("fs");
    res.writeHead(200, { "Content-Type" : "text/html" });
    fs.createReadStream("./public/todomvc.html").pipe(res); 
});
app.get("/deform/*", function(req, res){
    var fs = require("fs");
    res.writeHead(200, { "Content-Type" : "text/html" });
    fs.createReadStream("./public/ui-demo.html").pipe(res); 
}); 

http.createServer(app).listen(8080);

process.on('uncaughtException',function(e) {
    console.log(" Unhandled Error caught in server.js -----> : ",e,  e.stack);
});
 
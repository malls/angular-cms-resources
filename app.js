var fs = require('fs-extended');
var express = require('express');
var app = express();

var renderables = ['service', 'directive', 'register', 'routes', 'view', 'controller'];

function capitalize(str) {
	return str[0].toUpperCase() + str.slice(1);
}

function pluralize(str) {
	return str + "s";
}

function render(type, resource) {
    var resources = pluralize(resource);
    var Resource = capitalize(resource);
    var path = "./boilerplates/" + type + ".template";
	var destination = "./modules/" + resources;
    
	var tpl = fs.readFileSync(path);

    tpl = tpl + "";
    tpl = tpl.replace(/{{resources}}/g, resources);
    tpl = tpl.replace(/{{Resource}}/g, Resource);
    tpl = tpl.replace(/{{resource}}/g, resource);

    if (type !== 'view'){
    	var testPath = "./boilerplates/" + type + "test.template";
		var testTpl = fs.readFileSync(testPath)
	    testTpl = testTpl + "";
	    testTpl = testTpl.replace(/{{resources}}/g, resources);
	    testTpl = testTpl.replace(/{{Resource}}/g, Resource);
	    testTpl = testTpl.replace(/{{resource}}/g, resource);
    }

    if (type === 'register') {
    	fs.createFileSync(destination + "/" + resource + ".js", tpl);
    	fs.createFileSync(destination + "/tests/" + resource + ".js", testTpl);
    } else if (type === 'routes') {
    	fs.createFileSync(destination + "/routes.js", tpl);
    	fs.createFileSync(destination + "/tests/routes.js", testTpl);    
    } else if (type === 'view') {
    	fs.createFileSync(destination + "/views/" + resource + ".html", tpl);
    } else {
    	fs.createFileSync(destination + "/" + pluralize(type) + "/" + resource + ".js", tpl);
    	fs.createFileSync(destination + "/tests/" + pluralize(type) + "/" + resource + ".js", testTpl);
    }

}

app.post('/delete', function(req, res){
	fs.deleteDir("./modules");
	res.send('modules deleted');
});

app.post('/:resource', function(req, res){
    var resource = req.params.resource;

    for (var i = 0; i < renderables.length; i++) {
    	render(renderables[i], resource);
    }

    res.send(resource);
});

app.get('*', function(req, res){
    res.send('you should be posting');
});

app.listen(3303);
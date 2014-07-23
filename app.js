var service = './boilerplates/service.template';
var serviceTest = './boilerplates/servicetest.template';
var directive = './boilerplates/directive.template';
var directiveTest = './boilerplates/directiveTest.template';
var register = './boilerplates/register.template';
var routes = './boilerplates/routes.template';


var fs = require('fs-extended');
var express = require('express');
var app = express();


function capitalize(str) {
	return str[0].toUpperCase() + str.slice(1);
}

function pluralize(str) {
	return str + "s";
}

function render(template, resource, type) {
    var resources = pluralize(resource);
    var Resource = capitalize(resource);
	var path = "./modules/" + resources;
    
	var tpl = fs.readFileSync(template);
	
    tpl = tpl + "";
    tpl = tpl.replace(/{{resources}}/g, resources);
    tpl = tpl.replace(/{{Resource}}/g, Resource);
    tpl = tpl.replace(/{{resource}}/g, resource);
    if (template === register) {
    	fs.createFileSync(path + "/" + resource + ".js", tpl);
    }else if (template === routes) {
    	fs.createFileSync(path + "/routes.js", tpl);
    } else {
    	fs.createFileSync(path + "/" + type + "/" + resource + ".js", tpl);
    }


}

app.post('/delete', function(req, res){
	fs.deleteDir("./modules");
	res.send('modules deleted');
});

app.post('/:resource', function(req, res){
    var resource = req.params.resource;

    render(service, resource, 'services');
    render(directive, resource, 'directives');
    render(register, resource);
    render(routes, resource);

    res.send(resource);
});

app.get('*', function(req, res){
    res.send('you should be posting');
});

app.listen(3303);
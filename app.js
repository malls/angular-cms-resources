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

function render(template, resource) {
    var resources = pluralize(resource);
    var Resource = capitalize(resource);
	var path = "./modules/" + resources;
    
	var tpl = fs.readFileSync(template);
    tpl = tpl + "";
    tpl = tpl.replace(/{{resources}}/g, resources);
    tpl = tpl.replace(/{{Resource}}/g, Resource);
    tpl = tpl.replace(/{{resource}}/g, resource);
    if (template === routes || template === register) {
    	fs.createFileSync(path + ".js", tpl);
    }else if (template === routes) {
    	fs.createFileSync("routes.js", tpl);
    } else {
    	fs.createFileSync(path + "/" + resources + "/" + resource + ".js", tpl);
    }
}

app.post('/delete', function(req, res){
	fs.deleteDir("./modules");
	res.send('modules deleted');
});

app.post('/:resource', function(req, res){
    var resource = req.params.resource;
    var resources = pluralize(resource);
    var Resource = capitalize(resource);

    var Resource = capitalize(resource);

    var path = "./modules/" + resources;


    render(service, resource);
    render(directive, resource);
    render(register, resource);
    render(routes, resource);


    // var regTpl = fs.readFileSync(register);
    // regTpl = regTpl + "";
    // regTpl = regTpl.replace(/{{resources}}/g, resources);
    // regTpl = regTpl.replace(/{{Resource}}/g, Resource);
    // regTpl = regTpl.replace(/{{resource}}/g, resource);
    // fs.createFileSync(path + ".js", regTpl);

    // var dirTpl = fs.readFileSync(directive);
    // dirTpl = dirTpl + "";
    // dirTpl = dirTpl.replace(/{{resources}}/g, resources);
    // dirTpl = dirTpl.replace(/{{Resource}}/g, Resource);
    // dirTpl = dirTpl.replace(/{{resource}}/g, resource);
    // fs.createFileSync(path + "/directives/" + resource + ".js", dirTpl);
    
    // var svcTpl = fs.readFileSync(service);
    // svcTpl = svcTpl + "";
    // svcTpl = svcTpl.replace(/{{resources}}/g, resources);
    // svcTpl = svcTpl.replace(/{{Resource}}/g, Resource);
    // svcTpl = svcTpl.replace(/{{resource}}/g, resource);
    // fs.createFileSync(path + "/services/" + resource + ".js", svcTpl);
    
    res.send(resource);
});

app.get('*', function(req, res){
    res.send('you should be posting');
});

app.listen(3303);
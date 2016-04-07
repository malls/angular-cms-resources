'use strict';

var fs = require('fs-extended');

function capitalize(str) {
	return str[0].toUpperCase() + str.slice(1);
}

function pluralize(str) {
	return str + 's';
}

function generator(resource, renderables, views, nonstandard) {	
	var testPath;
	var testTpl;
	var resources;
    var Resource = capitalize(resource);
    var Resources = pluralize(Resource);

	if (nonstandard){
		resources = resource;
	} else {
    	resources = pluralize(resource);
	}
	
	var destination = './app/modules/' + resources;
	
	function replacer(path) {
		var template = fs.readFileSync(path);
	    template = template + '';
	    template = template.replace(/{{resources}}/g, resources);
	    template = template.replace(/{{Resource}}/g, Resource);
	    template = template.replace(/{{Resources}}/g, Resources);
	    template = template.replace(/{{resource}}/g, resource);
	    return template;
	}

	function render(type, resource) {
	    var path = './node_modules/module-generator/boilerplates/' + type + '.template';

		var tpl = replacer(path);

	    if (type === 'register') {
	    	// to do: this needs to be rendered conditionally
	    	fs.createFileSync(destination + '/' + resource + '.js', tpl);
	    } else if (type === 'view') {
	    	fs.createFileSync(destination + '/views/' + resource + '.html', tpl);	    
	    } else if (type === 'stylesheet') {
	    	fs.createFileSync('app/styles/' + resource + '.scss', tpl);
	    } else {
	    	testPath = './node_modules/module-generator/boilerplates/' + type + 'test.template';
			testTpl = replacer(testPath);
	    	fs.createFileSync(destination + '/' + pluralize(type) + '/' + resource + '.js', tpl);
	    	fs.createFileSync(destination + '/test/' + pluralize(type) + '/' + resource + '.js', testTpl);
	    }
	}

    for (var i = 0; i < renderables.length; i++) {
    	render(renderables[i], resource);
    }
    if (views) {
	    views.forEach(function(view){
		    var path = './node_modules/module-generator/boilerplates/view.template';
			var tpl = replacer(path);
			if (view.length > 1) {
				fs.createFileSync(destination + '/views/' + view + '.html', tpl);
			}
	    });
    }
}

module.exports = generator;
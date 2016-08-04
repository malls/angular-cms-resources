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
    var files = [];

	if (nonstandard){
		resources = resource;
	} else {
    	resources = pluralize(resource);
	}
	
	var destination = './app/modules/' + resources;
	var scriptLinks = 'modules/' + resources;
	var scriptLinkIndent = '    ';
	
	function replacer(path) {
		var template = fs.readFileSync(path);
	    template = template + '';
	    template = template.replace(/{{resources}}/g, resources);
	    template = template.replace(/{{Resource}}/g, Resource);
	    template = template.replace(/{{Resources}}/g, Resources);
	    template = template.replace(/{{resource}}/g, resource);
	    return template;
	}

	function addScriptLink(fileLinksArray){
		var htmlFileText = fs.readFileSync('./app/index.html','utf8');
		var indexTarget = '<!-- grunt module targets here -->';
		var scriptLinksString = '';

		for (var i = 0; i < fileLinksArray.length; i++) {
			scriptLinksString += '<script src="' + fileLinksArray[i] + '">' + '</script>\n' + scriptLinkIndent;
		}

		scriptLinksString += '\n' + scriptLinkIndent + indexTarget;

		var newhtmlFileText = htmlFileText.replace(indexTarget, scriptLinksString);

		if (!(htmlFileText.indexOf(scriptLinksString) !== -1)) {
			fs.writeFileSync('./app/index.html', newhtmlFileText);
		}
	}

	function render(type, resource) {
		//push scriptLinksPath to files array if it's not a test
	    var path = './node_modules/module-generator/boilerplates/' + type + '.template';
	    var scriptLinksPath;
		var tpl = replacer(path);

	    if (type === 'register') {
	    	// to do: this needs to be rendered conditionally
	    	scriptLinksPath = scriptLinks + '/' + resource + '.js';
	    	fs.createFileSync(destination + '/' + resource + '.js', tpl);
	    	files.push(scriptLinksPath);
	    } else if (type === 'view') {
	    	fs.createFileSync(destination + '/views/' + resource + '.html', tpl);
	    } else if (type === 'stylesheet') {
	    	fs.createFileSync('app/styles/' + resource + '.scss', tpl);
	    } else {
	    	testPath = './node_modules/module-generator/boilerplates/' + type + 'test.template';
			testTpl = replacer(testPath);
			scriptLinksPath = scriptLinks + '/' + pluralize(type) + '/' + resource + '.js';
	    	fs.createFileSync(destination + '/' + pluralize(type) + '/' + resource + '.js', tpl);
	    	fs.createFileSync(destination + '/test/' + pluralize(type) + '/' + resource + '.js', testTpl);
	    	files.push(scriptLinksPath);
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

    addScriptLink(files);

    return files; //an array of file paths
}

module.exports = generator;
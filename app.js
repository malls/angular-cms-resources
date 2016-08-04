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
    var styleLinksPath;
    var mainScript;

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
		files = files.sort();
		var htmlFileText = fs.readFileSync('./app/index.html','utf8');
		var indexTarget = '<!-- grunt module targets here -->';
		var scriptLinksString = '';

		scriptLinksString += '<script src="' + mainScript + '">' + '</script>\n' + scriptLinkIndent;

		for (var i = 0; i < fileLinksArray.length; i++) {
			scriptLinksString += '<script src="' + fileLinksArray[i] + '">' + '</script>\n' + scriptLinkIndent;
		}

		scriptLinksString += '\n' + scriptLinkIndent + indexTarget;

		var newhtmlFileText = htmlFileText.replace(indexTarget, scriptLinksString);

		fs.writeFileSync('./app/index.html', newhtmlFileText);
	}

	function addStylesLink(styleLinksPath){
		var stylesHtmlFileText = fs.readFileSync('./app/index.html','utf8');
		// console.log("-------------->This is styleLinksArray inside of addStylesLink: ", styleLinksArray);
		var indexStylesheetTarget = '<!-- grunt module style link targets here -->';

		var styleLinksString = '<link rel="stylesheet" href="styles/' + styleLinksPath + '">' + '\n' + scriptLinkIndent + indexStylesheetTarget;

		var htmlFileWithLinkAdded = stylesHtmlFileText.replace(indexStylesheetTarget, styleLinksString);

		fs.writeFileSync('./app/index.html', htmlFileWithLinkAdded);
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
	    	mainScript = scriptLinksPath;
	    } else if (type === 'view') {
	    	fs.createFileSync(destination + '/views/' + resource + '.html', tpl);
	    } else if (type === 'stylesheet') {
	    	styleLinksPath = resources + '.scss';
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

    addStylesLink(styleLinksPath);

    addScriptLink(files);

    return files; //an array of file paths
}

module.exports = generator;
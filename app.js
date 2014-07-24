var fs = require('fs-extended');

function generator(resource, renderables) {	

	function capitalize(str) {
		return str[0].toUpperCase() + str.slice(1);
	}

	function pluralize(str) {
		return str + 's';
	}

	function render(type, resource) {
		var testPath;
		var testTpl;
	    var resources = pluralize(resource);
	    var Resource = capitalize(resource);
	    var path = './node_modules/module-generator/boilerplates/' + type + '.template';
		var destination = './app/modules/' + resources;
		
		function replacer(path) {
			var template = fs.readFileSync(path);
		    template = template + '';
		    template = template.replace(/{{resources}}/g, resources);
		    template = template.replace(/{{Resource}}/g, Resource);
		    template = template.replace(/{{resource}}/g, resource);
		    return template;
		}

		var tpl = replacer(path);

	    if (type !== 'view'){
	    	testPath = './node_modules/module-generator/boilerplates/' + type + 'test.template';
			testTpl = replacer(testPath);
	    }

	    if (type === 'register') {
	    	fs.createFileSync(destination + '/' + resource + '.js', tpl);
	    } else if (type === 'routes') {
	    	fs.createFileSync(destination + '/routes.js', tpl);
	    	fs.createFileSync(destination + '/test/routes.js', testTpl);    
	    } else if (type === 'view') {
	    	fs.createFileSync(destination + '/views/' + resource + '.html', tpl);
	    } else {
	    	fs.createFileSync(destination + '/' + pluralize(type) + '/' + resource + '.js', tpl);
	    	fs.createFileSync(destination + '/test/' + pluralize(type) + '/' + resource + '.js', testTpl);
	    }
	}

    for (var i = 0; i < renderables.length; i++) {
    	render(renderables[i], resource);
    }
}

module.exports = generator;
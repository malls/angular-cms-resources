function generator(resource) {	
	var fs = require('fs-extended');

	var renderables = ['service', 'directive', 'register', 'routes', 'view', 'controller'];

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
	    var path = './boilerplates/' + type + '.template';
	    //test path
		// var destination = './modules/' + resources;
		//actual version
		var destination = '../../app/modules/' + resources;
		
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
	    	testPath = './boilerplates/' + type + 'test.template';
			testTpl = replacer(testPath);
	    }

	    if (type === 'register') {
	    	fs.createFileSync(destination + '/' + resource + '.js', tpl);
	    	fs.createFileSync(destination + '/tests/' + resource + '.js', testTpl);
	    } else if (type === 'routes') {
	    	fs.createFileSync(destination + '/routes.js', tpl);
	    	fs.createFileSync(destination + '/tests/routes.js', testTpl);    
	    } else if (type === 'view') {
	    	fs.createFileSync(destination + '/views/' + resource + '.html', tpl);
	    } else {
	    	fs.createFileSync(destination + '/' + pluralize(type) + '/' + resource + '.js', tpl);
	    	fs.createFileSync(destination + '/tests/' + pluralize(type) + '/' + resource + '.js', testTpl);
	    }
	}

    for (var i = 0; i < renderables.length; i++) {
    	render(renderables[i], resource);
    }

}

module.exports = generator;
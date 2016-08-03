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
		console.log("this is fileLinksArray inside of addScriptLink function: ", fileLinksArray);
		// var s = document.createElement( 'script' );
  // 		s.setAttribute( 'src', src );
  // 		document.head.appendChild( s );

  // 		var htmlFileText = fs.readFile('./app/index.html', 'utf8', (err, data) => {


  // 		if (err) {
  // 			throw err;
  // 		}

  // 		console.log("THIS is the data from fs.readFile: ", data);

		// });

		// fs.open("./app/index.html", "r+", 'utf8', function(err, fd) {
		// 	fs.write(fd,fdsaflkdjsa;fdsja)
		// 	console.log(fd);
		// });

		var htmlFileText = fs.readFileSync('./app/index.html','utf8', (data) => {
		  console.log(data);
		});

		var indexTarget = '<!-- grunt module targets here -->';


		// var regexResult = indexRegex.test(htmlFileText);

		// var scriptLinksString = fileLinksArray.join("</script>\n    ");

		// console.log("this is scriptLinksString: ", scriptLinksString);

		var scriptLinksString = '';

		// console.log("this is fileLinksArray[0]: ", fileLinksArray[0]);

		for (var i = 0; i < fileLinksArray.length; i++) {
			scriptLinksString += '<script src="' + fileLinksArray[i] + '">' + '</script>\n' + scriptLinkIndent;
		}

		scriptLinksString += '\n' + scriptLinkIndent + indexTarget;

		// console.log("this is scriptLinksString: ", scriptLinksString);

		var newhtmlFileText = htmlFileText.replace(indexTarget, scriptLinksString);

		console.log("TTTHHHHIIIIIIISSSSS is htmlFileText: ", htmlFileText);
		console.log("TTTHHHHIIIIIIISSSSS is rnewhtmlFileText: ", newhtmlFileText);

		fs.writeFileSync('./app/index.html', newhtmlFileText);

		// var scriptLinkTarget = '<!-- grunt module targets here -->';



		// console.log("!!!!!!!!!!!!this is fdInterger: ", fdInteger);

		// fs.write("index.html", scriptLinkTarget, 129, 'string');

	}

	function render(type, resource) {
		//push scriptLinksPath to fileLinks array if it's not a test
	    var path = './node_modules/module-generator/boilerplates/' + type + '.template';

	    var realPath;
	    var scriptLinksPath;

		var tpl = replacer(path);

	    if (type === 'register') {
	    	// to do: this needs to be rendered conditionally
	    	realPath = destination + '/' + resource + '.js';
	    	scriptLinksPath = scriptLinks + '/' + resource + '.js';
	    	fs.createFileSync(realPath, tpl);
	    	files.push(scriptLinksPath);
	    } else if (type === 'view') {
	    	realPath = destination + '/views/' + resource + '.html';
	    	fs.createFileSync(realPath, tpl);
	    	// files.push(realPath);
	    	console.log("this is files inside of type === view: ", files);
	    } else if (type === 'stylesheet') {
	    	realPath = 'app/styles/' + resource + '.scss';
	    	fs.createFileSync(realPath, tpl);
	    	// files.push(realPath);
	    	console.log("this is files inside of type === stylesheet: ", files);
	    } else {
	    	testPath = './node_modules/module-generator/boilerplates/' + type + 'test.template';
			testTpl = replacer(testPath);
			realPath = destination + '/' + pluralize(type) + '/' + resource + '.js';
			scriptLinksPath = scriptLinks + '/' + pluralize(type) + '/' + resource + '.js';
	    	fs.createFileSync(realPath, tpl);
	    	fs.createFileSync(destination + '/test/' + pluralize(type) + '/' + resource + '.js', testTpl);
	    	files.push(scriptLinksPath);
	    	console.log("this is files inside of type === stylesheet: ", files);
	    }

	    // files.push(realPath);
	    console.log("this is files after the if statements: ", files);

	
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
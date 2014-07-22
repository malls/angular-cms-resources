var service = './boilerplates/service.template';
var directive = './boilerplates/directive.template';


var fs = require('fs-extended');
var express = require('express');
var app = express();

app.post('/:resource', function(req, res){
    var resource = req.params.resource;
    var path = "./app/modules/" + resource;
    var dirTpl = fs.readFileSync(directive);
    dirTpl = dirTpl + "";
    dirTpl = dirTpl.replace(/{{resource}}/g, resource);

    fs.createFileSync(path + "/" + resource + ".js", dirTpl);

    res.send(resource);

});

app.get('*', function(req, res){
    res.send('you should be posting');
});

app.listen(3303);
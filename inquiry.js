'use strict';

module.exports = function (callback) {
	var app = require('./app');
	var inquirer = require('inquirer');

	inquirer.prompt([
		{
			message: 'What is the name of your module?',
			name: 'mod',
			validate: function(input) {
				var done = this.async();
				if (!input) {
					done('You need to provide a module name.');
					return;
				}
				done(true);
			}
		},
		{
			message: 'Should this module be pluralized?',
			name: 'nonstandard',
			type: 'confirm'
		},
		{
			message: 'Which resources would you like?',
			name: 'choices',
			type: 'checkbox',
			choices: 
				['service',
				'directive', 
				'view',
				'stylesheet',
				'controller']
		},
		{
			message: 'List any additional views you would like to create.',
			name: 'views',
			when: function(answers){
				if (answers.choices.indexOf('view') > -1) {
					return true;
				}
				return false;
			}
		}
		], function(answers) {
			answers.choices.push('register');
			console.log('Find your new module in app/modules. You will need to include js and css files in app/index.html.');
			if (answers.views) {
				answers.views = answers.views.split(' ');
			}
			var files = app(answers.mod, answers.choices, answers.views, !answers.nonstandard);

			callback(files);
		});
};
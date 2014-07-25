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
				'routes',
				'view',
				'controller']
		},
		{
			message: 'Do you want to create additional views?',
			name: 'views',
			when: function(answers){
				if (Array.contains(answers.choices, 'views')){
					return true;
				}
				return false;
			}
		}
		], function( answers ) {
			answers.choices.push('register');
			console.log('Find your new module in app/modules');
			console.log(answers.views);
			app(answers.mod, answers.choices, !answers.nonstandard);
			callback();
		});
};
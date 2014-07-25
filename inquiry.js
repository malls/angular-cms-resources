'use strict';

module.exports = function (callback) {
	var app = require('./app');
	var inquirer = require('inquirer');
	var ui = new inquirer.ui.BottomBar();

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
			message: 'Is this a nonstandard module?',
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
		}], function( answers ) {
			answers.choices.push('register');
			ui.log.write('Find your new module in app/modules');
			app(answers.mod, answers.choices, answers.nonstandard);
			callback();
		});
};
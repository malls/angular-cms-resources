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
			message: 'Is this a nonstandard module?',
			name: 'nonstandard'
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

			if (answers.nonstandard === 'y' || answers.standard === 'yes' || answers.standard === 'yeah'){
				answers.nonstandard = true;
			} else {
				answers.nonstandard = false;
			}

			app(answers.mod, answers.choices, answers.nonstandard);
			callback();
		});
};
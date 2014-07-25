module.exports = function (callback) {
	var app = require('./app');
	var inquirer = require("inquirer");
	
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
			choices: 
				['service',
				'directive', 
				'register', 
				'routes',
				'view',
				'controller'],
			message: 'Which resources would you like?',
			name: 'choices',
			type: 'checkbox'
		}], function( answers ) {
			answers.choices.push('register');
			app(answers.mod, answers.choices);
			callback();
		});
};
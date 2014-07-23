module.exports = function () {
	var app = require('./app');
	var inquirer = require("inquirer");

	var renderables = ['register'];

	inquirer.prompt([
		{
			choices: 
				['service',
				'directive', 
				'register', 
				'routes',
				'view',
				'controller'],
			message: "Which resources would you like?",
			name: 'choices',
			type: 'checkbox'
		},
		{
			message: "What is the name of your module?",
			name: 'mod'
		}], function( answers ) {
			renderables += answers.choices;
			app(answers.mod, renderables)
		});
}
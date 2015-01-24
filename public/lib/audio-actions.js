var Reflux = require('reflux');

var actions = Reflux.createActions({
	setFile: {
		children: ['completed']
	},
	changeFormula: {
		children: ['valid', 'invalid']
	},
	play: {},
	pause: {},
	speedUp: {},
	slowDown: {},
	jumpForward: {},
	jumpBack: {},
	changeTempo: {},
	pausePlay: {},
	changePosition: {},
	changeSong: {},
	setBreakPoint: {}
});

actions.setFile.listen(function (file) {
	if (!file) {
		return;
	}
	var reader = new FileReader();
	reader.onerror = console.error.bind(console);
	reader.onload = (e) => this.completed(e.target.result);
	reader.readAsDataURL(file);
});

actions.changeFormula.listen(function (formula) {
	this.valid(formula);
});

module.exports = actions;

var Reflux = require('reflux');

var actions = Reflux.createActions({
	setFile: {
		children: ['completed']
	},
	play: {},
	pause: {},
	speedUp: {},
	slowDown: {},
	jumpForward: {},
	jumpBack: {},
	changeTempo: {},
	pausePlay: {},
	changePosition: {}
});

actions.setFile.listen(function (file) {
	var reader = new FileReader();
	console.log(file);
	reader.onerror = console.error.bind(console);
	reader.onload = (e) => this.completed(e.target.result);
	reader.readAsDataURL(file);
});

module.exports = actions;

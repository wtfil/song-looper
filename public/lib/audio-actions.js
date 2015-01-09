var Reflux = require('reflux');

var actions = Reflux.createActions({
	setFile: {
		children: ['completed']
	},
	play: {},
	pause: {},
	changeTempo: {}
});

actions.setFile.listen(function (file) {
	var reader = new FileReader();
	reader.onerror = console.error.bind(console);
	reader.onload = (e) => this.completed(e.target.result);
	reader.readAsDataURL(file);
});

module.exports = actions;

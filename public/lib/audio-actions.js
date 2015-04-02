var Reflux = require('reflux');

var actions = Reflux.createActions({
	setFile: {
		children: ['completed']
	},
	changePosition: {},
	addRiff: {},
	updateRiff: {},
	deleteSong: {},
	changeName: {},
	play: {},
	pause: {},
	speedUp: {},
	slowDown: {},
	jumpForward: {},
	jumpBack: {},
	changeTempo: {},
	pausePlay: {},
	changeDuration: {},
	changeSong: {},
	playRiff: {},
	deleteRiff: {},
	nextSection: {},
	prevSection: {}
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

actions.setFile.completed.listen(function (src) {
	audio.src = src;
	actions.play();
});

module.exports = actions;

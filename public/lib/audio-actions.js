var Reflux = require('reflux');
var playingRiff;

var actions = Reflux.createActions({
	setFile: {
		children: ['completed']
	},
	next: {
		children: ['section', 'song']
	},
	prev: {
		children: ['section', 'song']
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
});

actions.playRiff.listen(() => {
	playingRiff = true;
});
actions.changeSong.listen(() => {
	playingRiff = false;
});

actions.next.listen(function () {
	playingRiff ?
		this.section() :
		this.song();
});

actions.prev.listen(function () {
	playingRiff ?
		this.section() :
		this.song();
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

module.exports = actions;

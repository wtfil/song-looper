var Reflux = require('reflux');
var audio = new Audio();
var repeater = require('./repeater');
var breakpoint = repeater.end();

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
	changeDuration: {},
	changePosition: {},
	changeSong: {}
});

audio.addEventListener('loadedmetadata', () => {
	actions.changeDuration(audio.duration);
});
audio.addEventListener('timeupdate', () => {
	var time = audio.currentTime;
	if (time > breakpoint) {
		audio.currentTime = repeater.start();
	} else {
		actions.changePosition(audio.currentTime);
	}
});


actions.changePosition.listen(function (position) {
	if (audio.currentTime !== position) {
		audio.currentTime = position;
	}
});
actions.speedUp.listen(function () {
	actions.changeTempo(audio.playbackRate += 0.1);
});
actions.slowDown.listen(function () {
	actions.changeTempo(audio.playbackRate -= 0.1);
});
actions.jumpForward.listen(function () {
	audio.currentTime += 5;
});
actions.jumpBack.listen(function () {
	audio.currentTime -= 5;
});
actions.changeTempo.listen(function (tempo) {
	audio.playbackRate = tempo;
});
actions.play.listen(function () {
	audio.play();
});
actions.pause.listen(function () {
	audio.pause();
});

actions.pausePlay.listen(function () {
	if (audio.paused) {
		actions.play();
	} else {
		actions.pause();
	}
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

actions.changeFormula.listen(function (formula) {
	breakpoint = repeater(formula).end();
	audio.currentTime = repeater.start();
});

actions.changeSong.listen(function (song) {
	audio.src = song.src;
	actions.play();
});

module.exports = actions;

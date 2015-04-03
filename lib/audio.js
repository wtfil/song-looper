var audio = new Audio();
var actions = require('./audio-actions');
var store = require('./audio-store');
var active = true;
var lastTimeTrigered;

audio.addEventListener('loadedmetadata', () => {
	actions.changeDuration(audio.duration);
});
audio.addEventListener('timeupdate', () => {
	var time = audio.currentTime;
	lastTimeTrigered = time;
	if (store.riff && time > store.riff.to) {
		audio.currentTime = store.riff.from;
	} else {
		actions.changePosition(audio.currentTime);
	}
});

window.addEventListener('blur', () => {active = false;});
window.addEventListener('focus', () => {active = true;});

function on() {
	store.listen(() => {
		if (audio.playbackRate !== store.tempo) {
			audio.playbackRate = store.tempo;
		}
		if (active && lastTimeTrigered !== store.current) {
			audio.currentTime = store.current;
		}
		if (store.isPlay) {
			audio.play();
		} else {
			audio.pause();
		}
		if (audio.src !== store.src) {
			audio.src = store.src;
		}
	});

}

module.exports = {on};

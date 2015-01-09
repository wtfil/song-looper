var Reflux = require('reflux');
var actions = require('./audio-actions');

module.exports = Reflux.createStore({
	init() {
		this.listenTo(actions.setFile.completed, this.setAudio);
		this.listenTo(actions.pause, this.pause);
		this.listenTo(actions.play, this.play);
		this.listenTo(actions.changeTempo, this.changeTempo);
		this.audio = new Audio();
		this.duration = 0;
		this.tempo = 1;
		this.current = 0;
		this.isPlay = false;
	},

	setAudio(src) {
		this.audio.src = src;
		this.audio.play();
		this.audio.addEventListener('loadedmetadata', () => {
			this.duration = this.audio.duration;
			this.trigger();
		});
		this.audio.addEventListener('timeupdate', () => {
			this.current = this.audio.currentTime;
			this.isPlay = !this.audio.paused;
			this.trigger();
		});
		this.trigger();
	},

	pause() {
		this.audio.pause();
	},
	play() {
		this.audio.play();
	},
	changeTempo(tempo) {
		this.tempo = tempo;
		this.audio.playbackRate = tempo;
		this.trigger();
	}
});

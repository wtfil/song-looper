var Reflux = require('reflux');
var actions = require('./audio-actions');

module.exports = Reflux.createStore({
	init() {
		this.listenToMany(actions);
		this.listenTo(actions.setFile.completed, this.setAudio);
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

	onPause() {
		this.audio.pause();
	},
	onPlay() {
		this.audio.play();
	},
	onChangeTempo(tempo) {
		this.tempo = this.audio.playbackRate = tempo;
		this.trigger();
	},
	onSpeedUp() {
		this.tempo = (this.audio.playbackRate += 0.1);
		this.trigger();
	},
	onSlowDown() {
		this.tempo = (this.audio.playbackRate -= 0.1);
		this.trigger();
	},
	onJunmpForward() {
		this.current = (this.audio.currentTime += 5);
		this.trigger();
	},
	onJumpBack() {
		this.current = (this.audio.currentTime -= 5);
		this.trigger();
	},
	onPausePlay() {
		this.isPlay ? this.onPause() : this.onPlay();
	}
});

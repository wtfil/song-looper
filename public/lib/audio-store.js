var Reflux = require('reflux');
var actions = require('./audio-actions');
var Formula = require('./formula');

module.exports = Reflux.createStore({
	init() {
		this.listenToMany(actions);
		this.listenTo(actions.setFile.completed, this.setAudio);
		this.listenTo(actions.changeFormula, this.setBreakPoint);
		this.audio = new Audio();
		this.duration = 0;
		this.tempo = 1;
		this.current = 0;
		this.isPlay = false;
		this.setBreakPoint();
	},

	setBreakPoint(formula) {
		this.breakPoint = null;
		if (formula) {
			this.formula = Formula(formula);
		}
		if (this.formula) {
			this.breakPoint = this.formula.next().value;
		}
		this.breakPoint = this.breakPoint || {breakAt: Infinity, seekTo: 0};
	},

	setAudio(src) {
		this.audio.src = src;
		this.audio.play();
		this.audio.addEventListener('loadedmetadata', () => {
			this.duration = this.audio.duration;
			this.trigger();
		});
		this.audio.addEventListener('timeupdate', () => {
			if (this.audio.currentTime > this.breakPoint.breakAt) {
				this.seekTo(this.breakPoint.seekTo);
				this.setBreakPoint();
			} else {
				this.current = this.audio.currentTime;
				this.isPlay = !this.audio.paused;
				this.trigger();
			}
		});
		this.trigger();
	},

	onPause() {
		this.audio.pause();
	},
	onPlay() {
		this.audio.play();
	},
	seekTo(time) {
		this.current = this.audio.currentTime = time;
		this.trigger();
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
	},
	onChangePosition(position) {
		this.audio.currentTime = position;
	},
	onChangeSong(song) {
		this.setBreakPoint(song.formula);
		this.setAudio(song.src);
		this.seekTo(this.breakPoint.seekTo);
		this.audio.play();
	}
});

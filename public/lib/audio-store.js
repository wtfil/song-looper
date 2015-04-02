var Reflux = require('reflux');
var actions = require('./audio-actions');

module.exports = Reflux.createStore({
	init() {
		this.listenToMany(actions);
		this.duration = 0;
		this.tempo = 1;
		this.current = 0;
		this.isPlay = false;
	},

	onChangeSong(song) {
		this.current = 0;
		this.isPlay = true;
		this.tempo = 1;
		this.src = song.src;
		this.trigger();
	},

   	onChangeDuration(duration) {
   		this.duration = duration;
   		this.trigger();
   	},

   	onJumpForward() {
   		this.current = Math.min(this.current + 5, this.duration);
   		this.trigger();
   	},
	onJumpBack() {
		this.current = Math.max(this.current - 5, 0);
		this.trigger();
	},

   	onChangePosition(current) {
   		this.current = current;
   		this.trigger();
   	},

	onPause() {
		this.isPlay = false;
		this.trigger();
	},
	onPlay() {
		this.isPlay = true;
		this.trigger();
	},
	onPausePlay() {
		this.isPlay ?
			this.onPause() :
			this.onPlay();
	},

	onChangeTempo(tempo) {
		this.tempo = tempo;
		this.trigger();
	},
	onSlowDown() {
		this.tempo = Math.max(0.1, this.tempo - 0.1);
		this.trigger();
	},
	onSpeedUp() {
		this.tempo = Math.min(2, this.tempo + 0.1);
		this.trigger();
	},
	onPlayRiff(data) {
		if (this.riff === data.riff) {
			return this.onPausePlay();
		}
		this.current = data.riff.from;
		this.src = data.song.src;
		this.riff = data.riff;
		this.isPlay = true;
		this.trigger();
	}
});

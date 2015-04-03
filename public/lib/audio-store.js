var Reflux = require('reflux');
var actions = require('./audio-actions');
var library = require('./library');

module.exports = Reflux.createStore({
	init() {
		this.listenToMany(actions);
		this.duration = 0;
		this.tempo = 1;
		this.current = 0;
		this.isPlay = false;
	},

	onChangeSong(song) {
		this.sondId = song.id;
		this.current = 0;
		this.isPlay = true;
		this.tempo = 1;
		this.src = song.src;
		this.riff = null;
		this.trigger();
	},

	onSetFileCompleted(src) {
		this.src = src;
		this.isPlay = true;
		this.current = 0;
		this.trigger();
	},

	onNextSong() {
		var song = library.getNextSong(this.sondId);
		if (song) {
			this.onChangeSong(song);
		}
	},

	onPrevSong() {
		var song = library.getPrevSong(this.sondId);
		if (song) {
			this.onChangeSong(song);
		}
	},
	onNextSection() {
		var section = library.getNextSection(this.sondId, this.riff);
		this.setRiff(section);
	},
	onPrevSection() {
		var section = library.getPrevSection(this.sondId, this.riff);
		this.setRiff(section);
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
	setRiff(riff) {
		this.riff = riff;
		this.current = riff.from;
		this.isPlay = true;
		this.trigger();
	},

	onPlayRiff(data) {
		if (this.riff === data.riff) {
			return this.onPausePlay();
		}
		this.src = data.song.src;
		this.sondId = data.song.id;
		this.setRiff(data.riff);
	}
});

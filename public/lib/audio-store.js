var Reflux = require('reflux');
var actions = require('./audio-actions');
var Formula = require('./formula');

module.exports = Reflux.createStore({
	init() {
		this.listenToMany(actions);
		this.listenTo(actions.changeFormula, this.setBreakPoint);
		this.duration = 0;
		this.tempo = 1;
		this.current = 0;
		this.isPlay = false;
		/*this.setBreakPoint();*/
	},

	/*
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
	*/


   	onChangeDuration(duration) {
   		this.duration = duration;
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
	onChangeTempo(tempo) {
		this.tempo = tempo;
		this.trigger();
	}
});

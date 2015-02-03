var Reflux = require('reflux');
var actions = require('./audio-actions');

module.exports = Reflux.createStore({
	init() {
		this.listenToMany(actions);
		this.listenTo(actions.changePosition.completed, 'onChangePositionCompleted');
		this.duration = 0;
		this.tempo = 1;
		this.current = 0;
		this.isPlay = false;
	},

   	onChangeDuration(duration) {
   		this.duration = duration;
   		this.trigger();
   	},

   	onChangePositionCompleted(current) {
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

var React = require('react');
var Reflux = require('reflux');
var PlayerTime = require('./player-time');
var Progress = require('./progress');
var actions = require('../lib/audio-actions');
var audioStore = require('../lib/audio-store');
var SongUpload = require('./song-upload');

module.exports = React.createClass({

	displayName: 'Player',

	mixins: [Reflux.listenTo(audioStore, 'forceUpdate')],

	changeTempo(value) {
		actions.changeTempo(value + 0.5);
	},

	changePosition(position) {
		actions.changePosition(position * audioStore.duration);
	},

	next() {
		actions.nextSection();
	},
	prev() {
		actions.prevSection();
	},

	render() {
		return <div className="player">
			<PlayerTime current={audioStore.current} duration={audioStore.duration} onChange={this.changePosition}/>
			<div className="player__footer">
				<div className="player__controls">
					<i className="icon-prev" onClick={actions.prevSection} />
					{audioStore.isPlay ?
						<i className="mr ml icon-pause" onClick={actions.pause}/> :
						<i className="mr ml icon-play" onClick={actions.play} />
					}
					<i className="icon-next" onClick={actions.nextSection} />
				</div>
				<div className="player__tempo">
					<span>Temp</span>
					<Progress progress={audioStore.tempo - 0.5} onChange={this.changeTempo}/>
					<span>x{audioStore.tempo.toFixed(1)}</span>
				</div>
				<div className="player__file">
					<SongUpload small>Upload new song</SongUpload>
				</div>
			</div>
		</div>;
	}

});


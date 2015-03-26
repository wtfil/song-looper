var React = require('react');
var Reflux = require('reflux');
var actions = require('./lib/audio-actions');
var audioStore = require('./lib/audio-store');
var songStore = require('./lib/song-store');
var Progress = require('./components/progress');
var PlayerTime = require('./components/player-time');
var SongsList = require('./components/songs-list');
var SongUpload = require('./components/song-upload');

var Player = React.createClass({

	mixins: [Reflux.listenTo(audioStore, 'forceUpdate')],

	changeTempo(value) {
		actions.changeTempo(value + 0.5);
	},

	changePosition(position) {
		actions.changePosition(position * audioStore.duration);
	},

	render() {
		return <div className="player">
			<PlayerTime current={audioStore.current} duration={audioStore.duration} onChange={this.changePosition}/>
			<div className="player__footer">
				<div className="player__controls">
					{audioStore.isPlay ?
						<i className="icon-pause" onClick={actions.pause}/> :
						<i className="icon-play" onClick={actions.play} />
					}
				</div>
				<div className="player__tempo">
					<Progress progress={audioStore.tempo - 0.5} onChange={this.changeTempo}/>
					<span>{audioStore.tempo.toFixed(1)}</span>
				</div>
				<div className="player__file">
					<SongUpload small>Upload new song</SongUpload>
				</div>
			</div>
		</div>;
	}

});

var App = React.createClass({
	mixins: [Reflux.listenTo(songStore, 'forceUpdate')],
	render() {
		if (!songStore.ready) {
			return null;
		}
		if (songStore.isEmpty()) {
			return <div className="app">
				<div className="center">
					<SongUpload>Upload song</SongUpload>
				</div>
			</div>
		}
		return <div className="app">
			<SongsList/>
			<Player/>
		</div>;
	}
});

window.addEventListener('keyup', function (e) {
	var node = e.target.nodeName;
	if (node === 'INPUT') {
		return;
	}
	switch (e.keyCode) {
		case 32: actions.pausePlay(); break;
		case 38: actions.speedUp(); break;
		case 40: actions.slowDown(); break;
		case 37: actions.jumpBack(); break;
		case 39: actions.jumpForward(); break;
	}
});

window.addEventListener('DOMContentLoaded', function () {
	React.render(<App/>, document.body);
});

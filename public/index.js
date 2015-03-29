var React = require('react');
var Reflux = require('reflux');
var actions = require('./lib/audio-actions');
var songStore = require('./lib/song-store');
var SongsList = require('./components/songs-list');
var SongUpload = require('./components/song-upload');
var Player = require('./components/player');

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
			</div>;
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

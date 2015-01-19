var React = require('react');
var Reflux = require('reflux');
var store= require('../lib/song-store');
var actions = require('../lib/audio-actions');

var Song = React.createClass({
	render() {
		return <div className="song-item" onClick={this.onClick}>
			{this.props.song.name}
		</div>;
	},
	onClick() {
		actions.changeSong(this.props.song.name);
		actions.setFile.completed(this.props.song.src);
	}
});

module.exports = React.createClass({
	displayName: 'SongsList',
	mixins: [Reflux.listenTo(store, 'forceUpdate')],
	render() {
		return <div>
			{store.songs.map(song => <Song song={song}/>)}
		</div>
	}
});

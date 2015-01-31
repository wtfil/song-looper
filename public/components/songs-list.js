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
		actions.changeSong(this.props.song);
	}
});

module.exports = React.createClass({
	displayName: 'SongsList',
	mixins: [Reflux.listenTo(store, 'forceUpdate')],
	render() {
		return <div className="songs-list">
			<div className="songs-list__head">
				<label className="file-input">
					<input type="file" onChange={this.onChange}/>
					<div>+ upload file</div>
				</label>
			</div>
			<div className="songs-list__list">
				{store.songs.map((song, key) => <Song key={key} song={song}/>)}
			</div>
		</div>
	},
	onChange(e) {
		actions.setFile(e.target.files[0]);
	}
});
